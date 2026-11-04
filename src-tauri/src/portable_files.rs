//! Course transfers use user-selected files only; never accept caller-provided paths/URIs.
use tauri::AppHandle;
#[cfg(target_os = "android")]
use tauri::Manager;

const MAX_BYTES: usize = 24 * 1024 * 1024;
#[cfg(target_os = "android")]
pub struct PortableFilesHandle(pub tauri::plugin::PluginHandle<tauri::Wry>);
#[cfg(not(target_os = "android"))]
static TRANSFER: std::sync::Mutex<()> = std::sync::Mutex::new(());

#[tauri::command(async)]
pub fn pick_portable_course(app: AppHandle) -> Result<Option<String>, String> {
    #[cfg(target_os = "android")]
    {
        let handle = app.try_state::<PortableFilesHandle>().ok_or("Course file picker unavailable")?;
        let value: serde_json::Value = handle.0.run_mobile_plugin("pickCourse", serde_json::json!({}))
            .map_err(|e| e.to_string())?;
        if value.get("cancelled").and_then(|v| v.as_bool()) == Some(true) { return Ok(None); }
        let content = value.get("content").and_then(|v| v.as_str()).ok_or("Invalid course file response")?;
        validate_content(content)?;
        Ok(Some(content.to_owned()))
    }
    #[cfg(not(target_os = "android"))]
    {
        use std::io::Read;
        use tauri_plugin_dialog::DialogExt;
        let _guard = TRANSFER.try_lock().map_err(|_| "A course file transfer is already open")?;
        let Some(file) = app.dialog().file().add_filter("Erudior course", &["json"]).blocking_pick_file() else { return Ok(None); };
        let path = file.into_path().map_err(|_| "Unsupported course file location")?;
        let mut bytes = Vec::new();
        std::fs::File::open(path).map_err(|_| "Cannot open selected course file")?
            .take((MAX_BYTES + 1) as u64).read_to_end(&mut bytes).map_err(|_| "Cannot read selected course file")?;
        if bytes.len() > MAX_BYTES { return Err("Course file exceeds 24 MiB".into()); }
        let content = String::from_utf8(bytes).map_err(|_| "Course file must be UTF-8")?;
        validate_content(&content)?;
        Ok(Some(content))
    }
}

fn validate_content(content: &str) -> Result<(), String> {
    if content.is_empty() { return Err("Course file is empty".into()); }
    if content.len() > MAX_BYTES { return Err("Course file exceeds 24 MiB".into()); }
    Ok(())
}

fn safe_name(name: &str) -> String {
    let stem: String = name.trim_end_matches(".json").chars().filter(|c| c.is_ascii_alphanumeric() || *c == '-' || *c == '_').take(80).collect();
    format!("{}.json", if stem.is_empty() { "course" } else { &stem })
}

#[tauri::command(async)]
pub fn export_portable_course(app: AppHandle, content: String, name: String) -> Result<bool, String> {
    validate_content(&content)?;
    let name = safe_name(&name);
    #[cfg(target_os = "android")]
    {
        let handle = app.try_state::<PortableFilesHandle>().ok_or("Course file picker unavailable")?;
        let value: serde_json::Value = handle.0.run_mobile_plugin("exportCourse", serde_json::json!({"content": content, "name": name}))
            .map_err(|e| e.to_string())?;
        if value.get("cancelled").and_then(|v| v.as_bool()) == Some(true) { return Ok(false); }
        if value.get("saved").and_then(|v| v.as_bool()) != Some(true) { return Err("Course export was not confirmed".into()); }
        Ok(true)
    }
    #[cfg(not(target_os = "android"))]
    {
        use tauri_plugin_dialog::DialogExt;
        let _guard = TRANSFER.try_lock().map_err(|_| "A course file transfer is already open")?;
        let Some(file) = app.dialog().file().add_filter("Erudior course", &["json"]).set_file_name(name).blocking_save_file() else { return Ok(false); };
        let path = file.into_path().map_err(|_| "Unsupported course file location")?;
        std::fs::write(path, content).map_err(|_| "Cannot write selected course file")?;
        Ok(true)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test] fn filenames_cannot_supply_a_path() {
        assert_eq!(safe_name("../../course.json"), "course.json");
        assert_eq!(safe_name(""), "course.json");
        assert_eq!(safe_name("math-1_v2.json"), "math-1_v2.json");
    }
    #[test] fn limits_are_bytes_not_characters() {
        assert!(validate_content("").is_err());
        assert!(validate_content(&"a".repeat(MAX_BYTES)).is_ok());
        assert!(validate_content(&"é".repeat(MAX_BYTES / 2 + 1)).is_err());
    }
}
