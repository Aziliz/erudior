//! Examiner backend: stores question banks and progress as JSON files in the
//! per-user app data directory, and reads/writes files the user picks for
//! import/export.

use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

const PROGRESS_FILE: &str = "progress.json";
const BANKS_DIR: &str = "banks";

fn data_dir(app: &AppHandle) -> Result<PathBuf, String> {
    let dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("cannot resolve app data dir: {e}"))?;
    fs::create_dir_all(&dir).map_err(|e| format!("cannot create {}: {e}", dir.display()))?;
    Ok(dir)
}

fn banks_dir(app: &AppHandle) -> Result<PathBuf, String> {
    let dir = data_dir(app)?.join(BANKS_DIR);
    fs::create_dir_all(&dir).map_err(|e| format!("cannot create {}: {e}", dir.display()))?;
    Ok(dir)
}

/// Bank ids become file names, so restrict them to a safe character set.
fn bank_path(app: &AppHandle, id: &str) -> Result<PathBuf, String> {
    let valid = !id.is_empty()
        && id.len() <= 100
        && id
            .chars()
            .all(|c| c.is_ascii_alphanumeric() || c == '-' || c == '_');
    if !valid {
        return Err(format!("invalid bank id: {id:?}"));
    }
    Ok(banks_dir(app)?.join(format!("{id}.json")))
}

/// Write via a temp file + rename so a crash never leaves a half-written file.
fn write_atomic(path: &PathBuf, content: &str) -> Result<(), String> {
    let tmp = path.with_extension("json.tmp");
    fs::write(&tmp, content).map_err(|e| format!("write failed: {e}"))?;
    fs::rename(&tmp, path).map_err(|e| format!("rename failed: {e}"))
}

/// Returns the raw JSON text of every stored bank; the frontend validates.
#[tauri::command]
fn list_banks(app: AppHandle) -> Result<Vec<String>, String> {
    let dir = banks_dir(&app)?;
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
fn save_bank(app: AppHandle, id: String, content: String) -> Result<(), String> {
    serde_json::from_str::<serde_json::Value>(&content)
        .map_err(|e| format!("bank is not valid JSON: {e}"))?;
    write_atomic(&bank_path(&app, &id)?, &content)
}

#[tauri::command]
fn delete_bank(app: AppHandle, id: String) -> Result<(), String> {
    let path = bank_path(&app, &id)?;
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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            list_banks,
            save_bank,
            delete_bank,
            load_progress,
            save_progress,
            read_text_file,
            write_text_file,
            data_location
        ])
        .run(tauri::generate_context!())
        .expect("error while running Examiner");
}
