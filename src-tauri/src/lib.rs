//! Erudior backend: stores courses, question banks and progress as JSON files in the
//! per-user app data directory, and reads/writes files the user picks for
//! import/export.

use std::fs;
use std::path::{Path, PathBuf};
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
/// Homeschool families add "family", and per-student "progress-<id>", "records-<id>" and
/// "session-<id>", "portfolio-<id>" (ids are 1-24 lowercase letters or digits).
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

/// The app was called Examiner (identifier com.aziliz.examiner) before v0.17.0. On the first
/// start under the new identifier, copy that data folder's files over; the old folder is left
/// as it was. Only our own files are copied (JSON at the top level, courses/banks/documents).
fn move_old_data(app: &AppHandle) {
    let Ok(new) = app.path().app_data_dir() else { return };
    let Some(parent) = new.parent() else { return };
    copy_old_data(&parent.join("com.aziliz.examiner"), &new);
}

/// Copies Examiner's files into the new data folder once; returns how many were copied.
fn copy_old_data(old: &Path, new: &Path) -> usize {
    let marker = new.join(".moved-from-examiner");
    if !old.is_dir() || marker.exists() || new.join("progress.json").exists() || new.join("family.json").exists() {
        return 0;
    }
    if fs::create_dir_all(new).is_err() {
        return 0;
    }
    let mut copied = 0usize;
    if let Ok(entries) = fs::read_dir(old) {
        for e in entries.flatten() {
            let p = e.path();
            let name = e.file_name();
            if p.is_file() && p.extension().and_then(|x| x.to_str()) == Some("json") {
                if fs::copy(&p, new.join(&name)).is_ok() {
                    copied += 1;
                }
            } else if p.is_dir() && matches!(name.to_str(), Some("courses" | "banks" | "documents")) {
                let dest = new.join(&name);
                let _ = fs::create_dir_all(&dest);
                if let Ok(files) = fs::read_dir(&p) {
                    for f in files.flatten() {
                        if f.path().is_file() && fs::copy(f.path(), dest.join(f.file_name())).is_ok() {
                            copied += 1;
                        }
                    }
                }
            }
        }
    }
    let _ = fs::write(&marker, format!("Copied {copied} files from {}\n", old.display()));
    copied
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            move_old_data(app.handle());
            Ok(())
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
            read_text_file,
            write_text_file,
            data_location,
            install_kind
        ])
        .run(tauri::generate_context!())
        .expect("error while running Erudior");
}
