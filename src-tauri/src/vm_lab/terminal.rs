use std::collections::HashMap;
use std::io::{Read, Write};
use std::process::ChildStdin;
use std::sync::{Arc, Mutex, OnceLock};
use tauri::ipc::Channel;

type Pipe = Arc<Mutex<ChildStdin>>;
static INPUTS: OnceLock<Mutex<HashMap<String, Pipe>>> = OnceLock::new();
fn inputs() -> &'static Mutex<HashMap<String, Pipe>> {
    INPUTS.get_or_init(Mutex::default)
}

#[derive(Clone, serde::Serialize)]
#[serde(tag = "kind", rename_all = "lowercase")]
pub enum ConsoleEvent {
    Output { bytes: Vec<u8> },
    Closed { message: String },
}

#[tauri::command]
pub async fn vm_console_open(
    window: tauri::WebviewWindow,
    id: String,
    role: String,
    scenario: String,
    profile: String,
    course: String,
    lesson: String,
    expected: String,
    channel: Channel<ConsoleEvent>,
) -> Result<(), String> {
    super::own_window(&window)?;
    if id.len() != 36
        || !id.bytes().all(|b| b.is_ascii_hexdigit() || b == b'-')
        || !["client", "server"].contains(&role.as_str())
        || expected.len() != 36
    {
        return Err("Invalid guest console.".into());
    }
    tauri::async_runtime::spawn_blocking(move || {
        let mut child = super::provider::launch(&[
            "_stream".into(),
            role,
            scenario,
            profile,
            course,
            lesson,
            expected,
        ])?;
        let input = Arc::new(Mutex::new(child.stdin.take().unwrap()));
        {
            let mut map = inputs().lock().unwrap();
            if map.len() >= 4 || map.contains_key(&id) {
                drop(input);
                let _ = child.kill();
                let _ = child.wait();
                return Err("Close an existing guest console and try again.".into());
            }
            map.insert(id.clone(), input);
        }
        std::thread::spawn(move || {
            let mut stdout = child.stdout.take().unwrap();
            let mut buffer = [0; 4096];
            loop {
                match stdout.read(&mut buffer) {
                    Ok(0) => break,
                    Ok(n)
                        if channel
                            .send(ConsoleEvent::Output {
                                bytes: buffer[..n].to_vec(),
                            })
                            .is_ok() => {}
                    Err(e) if e.kind() == std::io::ErrorKind::Interrupted => continue,
                    _ => {
                        let _ = child.kill();
                        break;
                    }
                }
            }
            inputs().lock().unwrap().remove(&id);
            let message = match child.wait_with_output() {
                Ok(result) if !result.status.success() => super::provider::message(&result.stderr),
                _ => "Console closed.".into(),
            };
            let _ = channel.send(ConsoleEvent::Closed { message });
        });
        Ok(())
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn vm_console_write(
    window: tauri::WebviewWindow,
    id: String,
    bytes: Vec<u8>,
) -> Result<(), String> {
    super::own_window(&window)?;
    if bytes.len() > 8192 {
        return Err("Input too large.".into());
    }
    let pipe = inputs()
        .lock()
        .unwrap()
        .get(&id)
        .cloned()
        .ok_or("Console closed.")?;
    tauri::async_runtime::spawn_blocking(move || {
        pipe.lock()
            .unwrap()
            .write_all(&bytes)
            .map_err(|e| e.to_string())
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub fn vm_console_close(window: tauri::WebviewWindow, id: String) -> Result<(), String> {
    super::own_window(&window)?;
    inputs().lock().unwrap().remove(&id);
    Ok(())
}
