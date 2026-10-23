//! Examiner backend: stores courses, question banks and progress as JSON files in the
//! per-user app data directory, and reads/writes files the user picks for
//! import/export.

use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

const PROGRESS_FILE: &str = "progress.json";

/// Stored collections. Each item is one JSON file named after its id.
fn collection_dir(app: &AppHandle, kind: &str) -> Result<PathBuf, String> {
    let sub = match kind {
        "banks" => "banks",
        "courses" => "courses",
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
/// Homeschool families add "family", and per-student "progress-<id>", "records-<id>" and
/// "session-<id>" (ids are 1-24 lowercase letters or digits).
fn aux_path(app: &AppHandle, name: &str) -> Result<PathBuf, String> {
    if valid_state_name(name) {
        Ok(data_dir(app)?.join(format!("{name}.json")))
    } else {
        Err(format!("unknown state file: {name:?}"))
    }
}

fn valid_state_name(name: &str) -> bool {
    if name == "session" || name == "family" {
        return true;
    }
    for prefix in ["progress-", "records-", "session-"] {
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

#[tauri::command]
fn data_location(app: AppHandle) -> Result<String, String> {
    Ok(data_dir(&app)?.display().to_string())
}

/// How this copy was installed, so the app knows whether it can update itself.
/// Tauri's updater can replace an AppImage or a Windows install, but not a
/// .deb or .rpm installed through the system package manager.
#[tauri::command]
fn install_kind() -> &'static str {
    if cfg!(target_os = "windows") {
        "windows"
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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            list_items,
            save_item,
            delete_item,
            load_progress,
            save_progress,
            load_state,
            save_state,
            read_text_file,
            write_text_file,
            data_location,
            install_kind
        ])
        .run(tauri::generate_context!())
        .expect("error while running Examiner");
}
