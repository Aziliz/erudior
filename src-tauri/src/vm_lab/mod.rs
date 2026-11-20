//! Only the packaged main window can control a learner's local VM pair.
mod provider;
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
        let child = provider::launch(&args)?;
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
            let mut guard = provider::launch(&["_hold_wsl".into()])?;
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
