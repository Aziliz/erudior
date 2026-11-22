use base64::{engine::general_purpose::STANDARD, Engine};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::os::windows::process::CommandExt;
use std::process::Command;
use std::sync::Mutex;

const MANAGED: &str = "Erudior-Labs";
const HIDDEN: u32 = 0x08000000;
const SETUP: &str = include_str!("windows_setup.ps1");
static SETUP_LOCK: Mutex<()> = Mutex::new(());

#[derive(Deserialize, Serialize)]
struct Host {
    distribution: String,
    managed: bool,
}

fn config_path(app: &tauri::AppHandle) -> Result<std::path::PathBuf, String> {
    Ok(crate::data_dir(app)?.join("vm-wsl-host.json"))
}

fn saved_host(app: &tauri::AppHandle) -> Result<Option<Host>, String> {
    match std::fs::read(config_path(app)?) {
        Ok(data) => serde_json::from_slice(&data).map(Some).map_err(|_| "Windows lab host settings could not be read. Run Windows lab setup.".into()),
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => Ok(None),
        Err(e) => Err(e.to_string()),
    }
}

fn system_directory() -> Result<std::path::PathBuf, String> {
    std::env::var_os("SystemRoot").map(|root| std::path::PathBuf::from(root).join("System32"))
        .ok_or_else(|| "Windows system directory is unavailable.".to_string())
}

pub(super) fn provider(app: &tauri::AppHandle) -> Result<Command, String> {
    // v0.25.1 stored its disks in Debian under that distribution's default user.
    let host = saved_host(app)?.unwrap_or(Host { distribution: "Debian".into(), managed: false });
    let mut cmd = Command::new(system_directory()?.join("wsl.exe"));
    cmd.creation_flags(HIDDEN).args(["--distribution", &host.distribution]);
    if host.managed {
        cmd.args(["--user", "erudior-lab"]);
    }
    cmd.args(["--cd", "/", "--exec", "/usr/bin/python3"]);
    Ok(cmd)
}

fn host_action(action: &str, target: &str) -> Result<Value, String> {
    let encoded = STANDARD.encode(SETUP.encode_utf16().flat_map(u16::to_le_bytes).collect::<Vec<_>>());
    let result = Command::new(system_directory()?.join(r"WindowsPowerShell\v1.0\powershell.exe"))
        .creation_flags(HIDDEN)
        .args(["-NoLogo", "-NoProfile", "-NonInteractive", "-EncodedCommand", &encoded])
        .env("ERUDIOR_HOST_ACTION", action)
        .env("ERUDIOR_HOST_TARGET", target)
        .env("ERUDIOR_HOST_SCRIPT", include_str!("windows-host.sh"))
        .output().map_err(|e| format!("Could not open Windows lab setup. {e}"))?;
    if !result.status.success() {
        return Err(super::provider::message(&result.stderr));
    }
    serde_json::from_slice(&result.stdout).map_err(|_| "Windows lab setup returned an unreadable result.".into())
}

pub(super) fn configure(app: &tauri::AppHandle, target: Option<String>) -> Result<Value, String> {
    if let Some(name) = target {
        if name.is_empty() || name.len() > 256 || name.starts_with('-') || name.chars().any(char::is_control) {
            return Err("Choose an installed WSL 2 host or the dedicated Debian host.".into());
        }
        let _guard = SETUP_LOCK.try_lock().map_err(|_| "Windows lab setup is already running.".to_string())?;
        let result = host_action("setup", &name)?;
        if result["state"] == "ready" {
            let host: Host = serde_json::from_value(result.clone()).map_err(|_| "Invalid Windows lab host.")?;
            if !host.distribution.eq_ignore_ascii_case(&name) || host.managed != host.distribution.eq_ignore_ascii_case(MANAGED) {
                return Err("Windows returned a different lab host. Retry setup.".into());
            }
            crate::write_atomic(&config_path(app)?, &serde_json::to_string(&host).map_err(|e| e.to_string())?)?;
        }
        Ok(result)
    } else {
        let saved = saved_host(app)?;
        let mut inventory = host_action("list", saved.as_ref().map_or("Debian", |h| h.distribution.as_str()))?;
        inventory["selected"] = saved.map_or(Value::Null, |h| Value::String(h.distribution));
        Ok(inventory)
    }
}
