//! The live updater resource selects the installed bundle type and holds the release signature.
//! Only the package survives an app restart. Recheck it against the current offer before use.
use std::{
    fs,
    io::{self, Write},
    path::{Path, PathBuf},
    time::Duration,
};
use tauri::{ipc::Channel, Manager, ResourceId, Webview};
use tauri_plugin_updater::Update;

fn cache_path(webview: &Webview) -> Result<PathBuf, String> {
    Ok(webview
        .path()
        .app_cache_dir()
        .map_err(|e| e.to_string())?
        .join("desktop-updates")
        .join("package"))
}

fn cached_package(path: &Path, update: &Update) -> Result<Option<Vec<u8>>, String> {
    match fs::read(path) {
        Ok(bytes) if update.verify(&bytes).is_ok() => Ok(Some(bytes)),
        Ok(_) => Ok(None),
        Err(e) if e.kind() == io::ErrorKind::NotFound => Ok(None),
        Err(e) => Err(format!("Could not read the saved update: {e}")),
    }
}

#[tauri::command]
pub async fn desktop_update_cached(
    webview: Webview,
    rid: Option<ResourceId>,
) -> Result<bool, String> {
    let path = cache_path(&webview)?;
    let Some(rid) = rid else {
        // Windows exits inside its installer handoff. Clean up on the next current-version check.
        let _ = fs::remove_file(path);
        return Ok(false);
    };
    let update = webview
        .resources_table()
        .get::<Update>(rid)
        .map_err(|e| e.to_string())?;
    Ok(cached_package(&path, &update)?.is_some())
}

#[tauri::command]
pub async fn desktop_update_download(
    webview: Webview,
    rid: ResourceId,
    progress: Channel<Option<u32>>,
) -> Result<(), String> {
    let path = cache_path(&webview)?;
    let update = webview
        .resources_table()
        .get::<Update>(rid)
        .map_err(|e| e.to_string())?;
    if cached_package(&path, &update)?.is_some() {
        return Ok(());
    }
    let mut update = (*update).clone();
    update.timeout = Some(Duration::from_secs(300));
    let mut received = 0u64;
    let bytes = update
        .download(
            |chunk, total| {
                received += chunk as u64;
                let percent = total
                    .filter(|&n| n > 0)
                    .map(|n| (100 * received / n).min(100) as u32);
                let _ = progress.send(percent);
            },
            || {},
        )
        .await
        .map_err(|e| e.to_string())?;
    let dir = path.parent().unwrap();
    fs::create_dir_all(dir).map_err(|e| e.to_string())?;
    let mut tmp = tempfile::NamedTempFile::new_in(dir).map_err(|e| e.to_string())?;
    tmp.write_all(&bytes)
        .and_then(|_| tmp.as_file().sync_all())
        .map_err(|e| e.to_string())?;
    tmp.persist(&path)
        .map_err(|e| format!("Could not save the verified update: {e}"))?;
    Ok(())
}

#[tauri::command]
pub async fn desktop_update_install(webview: Webview, rid: ResourceId) -> Result<bool, String> {
    let path = cache_path(&webview)?;
    let update = webview
        .resources_table()
        .get::<Update>(rid)
        .map_err(|e| e.to_string())?;
    tauri::async_runtime::spawn_blocking(move || {
        let Some(bytes) = cached_package(&path, &update)? else {
            return Ok(false);
        };
        #[cfg(target_os = "linux")]
        match super::install_kind() {
            kind @ ("deb" | "rpm") => return install_linux_package(kind, &bytes).map(|()| true),
            _ => {}
        }
        update.install(bytes).map_err(|e| e.to_string())?;
        Ok(true)
    })
    .await
    .map_err(|e| e.to_string())?
}

#[cfg(target_os = "linux")]
fn install_linux_package(kind: &str, bytes: &[u8]) -> Result<(), String> {
    use std::process::{Command, Stdio};
    let (manager, args): (&str, &[&str]) = match kind {
        "rpm" if bytes.starts_with(&[0xed, 0xab, 0xee, 0xdb]) => {
            if Path::new("/usr/bin/dnf").is_file() {
                ("/usr/bin/dnf", &["-y", "install"])
            } else {
                ("/usr/bin/rpm", &["-U"])
            }
        }
        "deb" if bytes.starts_with(b"!<arch>\n") => ("/usr/bin/apt-get", &["-y", "install"]),
        _ => return Err("The signed update does not match the installed package format.".into()),
    };
    // Give the package manager a private copy of the bytes that were just verified.
    let mut file = tempfile::Builder::new()
        .prefix("erudior-")
        .suffix(&format!(".{kind}"))
        .tempfile()
        .map_err(|e| e.to_string())?;
    file.write_all(bytes).map_err(|e| e.to_string())?;
    let output = Command::new("/usr/bin/pkexec")
        .arg("--disable-internal-agent")
        .arg(manager)
        .args(args)
        .arg(file.path())
        .stdin(Stdio::null())
        .output()
        .map_err(|e| {
            format!("Could not start the system authorization prompt: {e}. The update is saved.")
        })?;
    if output.status.success() {
        return Ok(());
    }
    let detail = String::from_utf8_lossy(&output.stderr);
    let stdout = String::from_utf8_lossy(&output.stdout);
    Err(match output.status.code() {
        Some(126) => "Installation was canceled. The update is saved.".into(),
        Some(127) => format!("System authorization was unavailable or denied. Use the administrator account shown by your system. {}", detail.trim()),
        _ => format!("{} could not install the update ({}). {}", manager, output.status,
            if detail.trim().is_empty() { stdout.trim() } else { detail.trim() }),
    })
}
