//! Erudior backend: stores courses, question banks and progress as JSON files in the
//! per-user app data directory, and reads/writes files the user picks for
//! import/export.

use std::fs;
use std::path::{Path, PathBuf};
use std::sync::Mutex;

// Serializes named-state writes/CAS across webviews in this application process.
// This is not an inter-process lock.
static NAMED_STATE_LOCK: Mutex<()> = Mutex::new(());
use tauri::{AppHandle, Manager};

const PROGRESS_FILE: &str = "progress.json";

/// Stored collections. Each item is one JSON file named after its id.
fn collection_dir(app: &AppHandle, kind: &str) -> Result<PathBuf, String> {
    let sub = match kind {
        "banks" => "banks",
        "courses" => "courses",
        // Homeschool attachments: {"mime", "data" (base64)} per file; never listed in bulk.
        "documents" => "documents",
        _ => return Err(format!("unknown collection: {kind:?}")),
    };
    let dir = data_dir(app)?.join(sub);
    fs::create_dir_all(&dir).map_err(|e| format!("cannot create {}: {e}", dir.display()))?;
    Ok(dir)
}

fn data_dir(app: &AppHandle) -> Result<PathBuf, String> {
    let dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("cannot resolve app data dir: {e}"))?;
    fs::create_dir_all(&dir).map_err(|e| format!("cannot create {}: {e}", dir.display()))?;
    Ok(dir)
}

/// Item ids become file names, so restrict them to a safe character set.
fn item_path(app: &AppHandle, kind: &str, id: &str) -> Result<PathBuf, String> {
    let valid = !id.is_empty()
        && id.len() <= 100
        && id
            .chars()
            .all(|c| c.is_ascii_alphanumeric() || c == '-' || c == '_');
    if !valid {
        return Err(format!("invalid id: {id:?}"));
    }
    Ok(collection_dir(app, kind)?.join(format!("{id}.json")))
}

/// Write via a temp file + rename so a crash never leaves a half-written file.
fn write_atomic(path: &PathBuf, content: &str) -> Result<(), String> {
    let tmp = path.with_extension("json.tmp");
    fs::write(&tmp, content).map_err(|e| format!("write failed: {e}"))?;
    fs::rename(&tmp, path).map_err(|e| format!("rename failed: {e}"))
}

/// Returns the raw JSON text of every stored item; the frontend validates.
#[tauri::command]
fn list_items(app: AppHandle, kind: String) -> Result<Vec<String>, String> {
    let dir = collection_dir(&app, &kind)?;
    let mut out = Vec::new();
    let entries = fs::read_dir(&dir).map_err(|e| format!("read_dir failed: {e}"))?;
    for entry in entries.flatten() {
        let path = entry.path();
        if path.extension().and_then(|s| s.to_str()) == Some("json") {
            if let Ok(text) = fs::read_to_string(&path) {
                out.push(text);
            }
        }
    }
    Ok(out)
}

#[tauri::command]
fn save_item(app: AppHandle, kind: String, id: String, content: String) -> Result<(), String> {
    serde_json::from_str::<serde_json::Value>(&content)
        .map_err(|e| format!("content is not valid JSON: {e}"))?;
    write_atomic(&item_path(&app, &kind, &id)?, &content)
}

#[tauri::command]
fn delete_item(app: AppHandle, kind: String, id: String) -> Result<(), String> {
    let path = item_path(&app, &kind, &id)?;
    if path.exists() {
        fs::remove_file(path).map_err(|e| format!("delete failed: {e}"))?;
    }
    Ok(())
}

#[tauri::command]
fn load_progress(app: AppHandle) -> Result<Option<String>, String> {
    let path = data_dir(&app)?.join(PROGRESS_FILE);
    if !path.exists() {
        return Ok(None);
    }
    fs::read_to_string(path)
        .map(Some)
        .map_err(|e| format!("read failed: {e}"))
}

#[tauri::command]
fn save_progress(app: AppHandle, content: String) -> Result<(), String> {
    write_atomic(&data_dir(&app)?.join(PROGRESS_FILE), &content)
}

/// Small named state files next to progress.json (e.g. the in-progress exam).
/// Homeschool families and classrooms add "family"; a student's own device joined to classes
/// adds "classes"; and per-student "progress-<id>", "records-<id>" and
/// "session-<id>", "portfolio-<id>" (ids are 1-24 lowercase letters or digits).
fn aux_path(app: &AppHandle, name: &str) -> Result<PathBuf, String> {
    if valid_state_name(name) {
        Ok(data_dir(app)?.join(format!("{name}.json")))
    } else {
        Err(format!("unknown state file: {name:?}"))
    }
}

fn valid_state_name(name: &str) -> bool {
    if name == "session" || name == "family" || name == "classes" || name == "classroom-submissions" {
        return true;
    }
    for prefix in ["progress-", "records-", "session-", "portfolio-"] {
        if let Some(id) = name.strip_prefix(prefix) {
            return !id.is_empty() && id.len() <= 24 && id.chars().all(|c| c.is_ascii_lowercase() || c.is_ascii_digit());
        }
    }
    false
}

#[tauri::command]
fn load_state(app: AppHandle, name: String) -> Result<Option<String>, String> {
    let path = aux_path(&app, &name)?;
    if !path.exists() {
        return Ok(None);
    }
    fs::read_to_string(path).map(Some).map_err(|e| format!("read failed: {e}"))
}

/// Saves the state file, or deletes it when `content` is None.
#[tauri::command]
fn save_state(app: AppHandle, name: String, content: Option<String>) -> Result<(), String> {
    let path = aux_path(&app, &name)?;
    let _guard = NAMED_STATE_LOCK.lock().map_err(|_| "state lock unavailable".to_string())?;
    match content {
        Some(c) => write_atomic(&path, &c),
        None => {
            if path.exists() {
                fs::remove_file(path).map_err(|e| format!("delete failed: {e}"))?;
            }
            Ok(())
        }
    }
}

/// Optimistic read/transform happens in the frontend; comparison and replacement
/// are atomic against every named-state save in this native application process.
#[tauri::command]
fn compare_and_swap_state(app: AppHandle, name: String, expected: Option<String>, content: String) -> Result<bool, String> {
    let path = aux_path(&app, &name)?;
    let _guard = NAMED_STATE_LOCK.lock().map_err(|_| "state lock unavailable".to_string())?;
    compare_and_swap_path(&path, expected.as_deref(), &content)
}

fn compare_and_swap_path(path: &PathBuf, expected: Option<&str>, content: &str) -> Result<bool, String> {
    let current = match fs::read_to_string(path) {
        Ok(text) => Some(text),
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => None,
        Err(error) => return Err(format!("read failed: {error}")),
    };
    if current.as_deref() != expected { return Ok(false); }
    write_atomic(path, content)?;
    Ok(true)
}

#[cfg(test)]
mod named_state_tests {
    use super::*;
    #[test]
    fn exact_classroom_state_allowlist() {
        for name in ["classroom-submissions", "family", "classes", "session", "progress-a1", "records-a1", "session-a1", "portfolio-a1"] {
            assert!(valid_state_name(name), "{name}");
        }
        for name in ["classroom-submissions-extra", "classroom-submissions/other", "../classroom-submissions", "progress-", "records-A", "progress-a/../b", "classroom-other", "progress"] {
            assert!(!valid_state_name(name), "{name}");
        }
    }
    #[test]
    fn stale_native_cas_does_not_replace_current_bytes() {
        let dir = std::env::temp_dir().join(format!("erudior-state-test-{}-{}", std::process::id(), std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_nanos()));
        fs::create_dir_all(&dir).unwrap();
        let path = dir.join("state.json");
        assert!(compare_and_swap_path(&path, None, "one").unwrap());
        assert!(!compare_and_swap_path(&path, None, "stale").unwrap());
        assert!(!compare_and_swap_path(&path, Some("other"), "stale").unwrap());
        assert_eq!(fs::read_to_string(&path).unwrap(), "one");
        assert!(compare_and_swap_path(&path, Some("one"), "two").unwrap());
        assert_eq!(fs::read_to_string(&path).unwrap(), "two");
        fs::remove_dir_all(dir).unwrap();
    }
}

/// Used for importing a bank from a path chosen in the native open dialog.
#[tauri::command]
fn read_text_file(path: String) -> Result<String, String> {
    fs::read_to_string(&path).map_err(|e| format!("cannot read {path}: {e}"))
}

/// Used for exporting a bank to a path chosen in the native save dialog.
#[tauri::command]
fn write_text_file(path: String, content: String) -> Result<(), String> {
    fs::write(&path, content).map_err(|e| format!("cannot write {path}: {e}"))
}

/// Read one stored item's JSON text (used for attachments, which are too big to list).
#[tauri::command]
fn load_item(app: AppHandle, kind: String, id: String) -> Result<Option<String>, String> {
    let path = item_path(&app, &kind, &id)?;
    if !path.exists() {
        return Ok(None);
    }
    fs::read_to_string(path).map(Some).map_err(|e| format!("read failed: {e}"))
}

/// Saves a copy of an attachment (base64) to a path chosen in the native save dialog.
#[tauri::command]
fn write_base64_file(path: String, data: String) -> Result<(), String> {
    let bytes = decode_base64(&data)?;
    fs::write(&path, bytes).map_err(|e| format!("cannot write {path}: {e}"))
}

/// Standard base64 (with or without padding); whitespace is ignored.
fn decode_base64(s: &str) -> Result<Vec<u8>, String> {
    fn val(c: u8) -> Option<u32> {
        match c {
            b'A'..=b'Z' => Some((c - b'A') as u32),
            b'a'..=b'z' => Some((c - b'a' + 26) as u32),
            b'0'..=b'9' => Some((c - b'0' + 52) as u32),
            b'+' => Some(62),
            b'/' => Some(63),
            _ => None,
        }
    }
    let mut out = Vec::with_capacity(s.len() * 3 / 4);
    let (mut acc, mut bits) = (0u32, 0u32);
    for &c in s.as_bytes() {
        if c == b'=' || c.is_ascii_whitespace() {
            continue;
        }
        let v = val(c).ok_or_else(|| "invalid base64".to_string())?;
        acc = (acc << 6) | v;
        bits += 6;
        if bits >= 8 {
            bits -= 8;
            out.push((acc >> bits) as u8);
            acc &= (1 << bits) - 1;
        }
    }
    Ok(out)
}

#[tauri::command]
fn data_location(app: AppHandle) -> Result<String, String> {
    Ok(data_dir(&app)?.display().to_string())
}

/// How this copy was installed, so the app knows whether it can update itself.
/// Tauri's updater can replace an AppImage, a Windows install or the macOS app, but not a
/// .deb or .rpm installed through the system package manager.
#[tauri::command]
fn install_kind() -> &'static str {
    if cfg!(target_os = "windows") {
        "windows"
    } else if cfg!(target_os = "macos") {
        "macos"
    } else if cfg!(target_os = "linux") {
        if std::env::var_os("APPIMAGE").is_some() {
            "appimage"
        } else {
            "linux-package"
        }
    } else {
        "other"
    }
}

/// True for the app's own pages (bundled UI, or the dev server in debug builds).
fn own_page(url: &tauri::Url) -> bool {
    match url.scheme() {
        // macOS and Linux serve the bundled UI from tauri://localhost, Windows from http(s)://tauri.localhost.
        "tauri" => true,
        "http" | "https" => match url.host_str() {
            Some("tauri.localhost") => true,
            Some("localhost") => cfg!(debug_assertions),
            _ => false,
        },
        _ => false,
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            // Speaking practice records the student's voice (getUserMedia). WebKitGTK ships with
            // media streams turned off; turn them on for the main window.
            #[cfg(target_os = "linux")]
            {
                use tauri::Manager;
                if let Some(w) = app.get_webview_window("main") {
                    let _ = w.with_webview(|wv| {
                        use webkit2gtk::{SettingsExt, WebViewExt};
                        if let Some(s) = wv.inner().settings() {
                            s.set_enable_media_stream(true);
                        }
                    });
                }
            }
            Ok(())
        })
        // The microphone is only used when the student presses Record in a speaking exercise,
        // and only Erudior's own pages may have it. Without this, WebKitGTK (Linux) denies it
        // silently; Windows and macOS still apply the system's microphone privacy settings
        // (macOS asks once, using NSMicrophoneUsageDescription in Info.plist). Everything else
        // (camera, location, …) keeps the web view's default behavior.
        .on_permission_request(|webview, kind| match kind {
            tauri::webview::PermissionKind::Microphone if webview.url().map(|u| own_page(&u)).unwrap_or(false) => {
                tauri::webview::PermissionResponse::Allow
            }
            _ => tauri::webview::PermissionResponse::Default,
        })
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            list_items,
            save_item,
            delete_item,
            load_item,
            write_base64_file,
            load_progress,
            save_progress,
            load_state,
            save_state,
            compare_and_swap_state,
            read_text_file,
            write_text_file,
            data_location,
            install_kind
        ])
        .run(tauri::generate_context!())
        .expect("error while running Erudior");
}
