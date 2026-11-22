//! Only the packaged main window can control a learner's local VM pair.
mod provider;
#[cfg(target_os = "windows")]
mod windows;
use tauri::Manager;
pub(super) mod terminal;

use std::io;

fn own_window(window: &tauri::WebviewWindow) -> Result<(), String> {
    if window.label() == "main"
        && window
            .url()
            .map(|url| super::own_page(&url))
            .unwrap_or(false)
    {
        Ok(())
    } else {
        Err("Open this lab in Erudior's desktop window.".into())
    }
}

#[tauri::command]
pub async fn vm_lab(
    window: tauri::WebviewWindow,
    action: String,
    scenario: String,
    profile: String,
    course: String,
    lesson: String,
    minutes: Option<u16>,
    expected: Option<String>,
    tasks: Option<Vec<serde_json::Value>>,
) -> Result<serde_json::Value, String> {
    own_window(&window)?;
    if ![
        "status",
        "start",
        "stop",
        "reset",
        "check",
        "begin",
        "submit",
        "retry",
        "console-client",
        "console-server",
    ]
    .contains(&action.as_str())
    {
        return Err("Unknown lab action.".into());
    }
    let duration = minutes.unwrap_or(if scenario == "rhcsa-rhel10-practice-v1" {
        180
    } else {
        20
    });
    let rubric = serde_json::to_string(&tasks).map_err(|e| e.to_string())?;
    if rubric.len() > 1024 {
        return Err("Invalid practical task list.".into());
    }
    let args = [
        action,
        scenario,
        profile,
        course,
        lesson,
        duration.to_string(),
        expected.unwrap_or_default(),
        rubric,
    ];
    tauri::async_runtime::spawn_blocking(move || {
        let child = provider::launch(window.app_handle(), &args)?;
        let output = child
            .wait_with_output()
            .map_err(|e: io::Error| e.to_string())?;
        if !output.status.success() {
            return Err(provider::message(if output.stderr.is_empty() {
                &output.stdout
            } else {
                &output.stderr
            }));
        }
        #[cfg(target_os = "windows")]
        if args[0] == "start" {
            let mut guard = provider::launch(window.app_handle(), &["_hold_wsl".into()])?;
            drop(guard.stdin.take());
            std::thread::spawn(move || {
                let _ = guard.wait_with_output();
            });
        }
        serde_json::from_slice(&output.stdout).map_err(|_| "Unreadable lab response.".into())
    })
    .await
    .map_err(|e| e.to_string())?
}

/// Only native file dialogs supply host paths. Stream picked media into the provider so
/// Windows and Lima do not need shared folders, and no ISO crosses the JavaScript bridge.
#[tauri::command]
pub async fn vm_setup_media(window: tauri::WebviewWindow, kind: String) -> Result<serde_json::Value, String> {
    use tauri_plugin_dialog::DialogExt;

    own_window(&window)?;
    tauri::async_runtime::spawn_blocking(move || {
        let mut file = match kind.as_str() {
            "status" => None,
            "dvd" | "kit" => {
                let (label, ext, size) = if kind == "dvd" {
                    ("AlmaLinux 10.3 DVD", "iso", 10_824_908_800_u64)
                } else {
                    ("Erudior practice kit", "zip", 24_703)
                };
                let Some(selected) = window.dialog().file().add_filter(label, &[ext]).blocking_pick_file() else {
                    return Ok(serde_json::Value::Null);
                };
                let path = selected.into_path().map_err(|_| "Unsupported file location")?;
                let metadata = std::fs::metadata(&path).map_err(|e| e.to_string())?;
                if !metadata.is_file() || metadata.len() != size {
                    return Err(format!("Choose the official {label} ({size} bytes)."));
                }
                Some(std::fs::File::open(path).map_err(|e| e.to_string())?)
            }
            _ => return Err("Unknown setup medium.".into()),
        };
        let mut child = provider::launch(window.app_handle(), &["_media".into(), kind])?;
        let mut input = child.stdin.take().ok_or("Missing provider input")?;
        let copied = file.as_mut().map(|f| io::copy(f, &mut input)).transpose();
        drop(input);
        let output = child.wait_with_output().map_err(|e| e.to_string())?;
        if !output.status.success() {
            return Err(provider::message(if output.stderr.is_empty() { &output.stdout } else { &output.stderr }));
        }
        copied.map_err(|e| e.to_string())?;
        serde_json::from_slice(&output.stdout).map_err(|_| "Unreadable setup response.".into())
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn vm_windows_host(
    window: tauri::WebviewWindow,
    target: Option<String>,
) -> Result<serde_json::Value, String> {
    own_window(&window)?;
    #[cfg(target_os = "windows")]
    {
        tauri::async_runtime::spawn_blocking(move || {
            windows::configure(window.app_handle(), target)
        })
        .await
        .map_err(|e| e.to_string())?
    }
    #[cfg(not(target_os = "windows"))]
    {
        let _ = target;
        Err("Windows lab setup is available in the Windows desktop app.".into())
    }
}
