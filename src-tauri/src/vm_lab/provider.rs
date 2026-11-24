use std::io::{self, Write};
use std::process::{Child, Command, Stdio};

const BOOT: &str = include_str!("bootstrap.py");
const SOURCE: &str = concat!(include_str!("alma_setup.py"), "\n", include_str!("runner.py"));
const GUEST: &str = include_str!("guest_probe.py");
const ALMA_KIT: &[u8] = include_bytes!("../../../public/downloads/Erudior-AlmaLinux-10.3-Practice-Kit.zip");

fn provider(_app: &tauri::AppHandle) -> Result<Command, String> {
    #[cfg(target_os = "linux")]
    {
        Ok(Command::new("/usr/bin/python3"))
    }
    #[cfg(target_os = "windows")]
    {
        super::windows::provider(_app)
    }
    #[cfg(target_os = "macos")]
    {
        let executable = [
            "/opt/homebrew/bin/limactl",
            "/usr/local/bin/limactl",
            "/opt/local/bin/limactl",
        ]
        .into_iter()
        .find(|p| std::path::Path::new(p).is_file())
        .ok_or("Install Lima and start the erudior-labs instance. See First-time setup.")?;
        let mut cmd = Command::new(executable);
        cmd.args([
            "shell",
            "--tty=false",
            "--workdir",
            "/tmp",
            "erudior-labs",
            "/usr/bin/env",
            "ERUDIOR_VM_PROVIDER=lima",
            "/usr/bin/python3",
        ]);
        Ok(cmd)
    }
    #[cfg(not(any(target_os = "linux", target_os = "windows", target_os = "macos")))]
    {
        Err("Local VMs require the Windows, macOS or Linux desktop app.".into())
    }
}

/// Send source and arguments over a length-delimited pipe: Windows has a 32K command-line
/// limit, and Lima forwards arguments through SSH. No learner strings become shell syntax.
pub(super) fn launch(app: &tauri::AppHandle, args: &[String]) -> Result<Child, String> {
    let kit = args.first().filter(|action| action.as_str() == "start").map(|_| ALMA_KIT);
    let bytes = serde_json::to_vec(&(SOURCE, GUEST, args, kit)).map_err(|e| e.to_string())?;
    let mut child = provider(app)?
        .args(["-I", "-u", "-c", BOOT, &bytes.len().to_string()])
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| {
            format!("Could not launch the local VM provider. See First-time setup. {e}")
        })?;
    let written: io::Result<()> = child.stdin.as_mut().unwrap().write_all(&bytes);
    if let Err(e) = written {
        drop(child.stdin.take());
        if e.kind() == io::ErrorKind::BrokenPipe {
            if let Ok(output) = child.wait_with_output() {
                let detail = if output.stderr.is_empty() { &output.stdout } else { &output.stderr };
                if !detail.is_empty() { return Err(message(detail)); }
            }
        } else {
            let _ = child.kill();
            let _ = child.wait();
        }
        return Err(format!(
            "The local provider did not start Python 3. See First-time setup. {e}"
        ));
    }
    Ok(child)
}

pub(super) fn message(bytes: &[u8]) -> String {
    // wsl.exe can emit UTF-16 diagnostics before Linux Python starts.
    let result = if bytes.contains(&0) {
        String::from_utf16_lossy(
            &bytes
                .chunks_exact(2)
                .map(|p| u16::from_le_bytes([p[0], p[1]]))
                .collect::<Vec<_>>(),
        )
    } else {
        String::from_utf8_lossy(bytes).into_owned()
    };
    if result.contains("WSL_E_DISTRO_NOT_FOUND") || result.contains("WSL_E_DEFAULT_DISTRO_NOT_FOUND") {
        return "Windows could not find the lab host. Choose Set up Windows labs to install Debian or use an existing WSL 2 host.".into();
    }
    let detail = result.trim().chars().take(700).collect::<String>();
    if detail.is_empty() {
        "Could not contact the local lab provider. See First-time setup.".into()
    } else {
        detail
    }
}
