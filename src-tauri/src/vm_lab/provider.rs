use std::io::{self, Write};
use std::process::{Child, Command, Stdio};

const BOOT: &str = include_str!("bootstrap.py");
const SOURCE: &str = include_str!("runner.py");
const GUEST: &str = include_str!("guest_probe.py");

fn provider() -> Result<Command, String> {
    #[cfg(target_os = "linux")]
    {
        Ok(Command::new("/usr/bin/python3"))
    }
    #[cfg(target_os = "windows")]
    {
        use std::os::windows::process::CommandExt;
        let root =
            std::env::var_os("SystemRoot").ok_or("Windows system directory is unavailable.")?;
        let mut cmd = Command::new(std::path::Path::new(&root).join("System32").join("wsl.exe"));
        cmd.args([
            "--distribution",
            "Debian",
            "--cd",
            "/",
            "--exec",
            "/usr/bin/python3",
        ]);
        cmd.creation_flags(0x08000000); // CREATE_NO_WINDOW; the terminal lives in Erudior.
        Ok(cmd)
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
pub(super) fn launch(args: &[String]) -> Result<Child, String> {
    let bytes = serde_json::to_vec(&(SOURCE, GUEST, args)).map_err(|e| e.to_string())?;
    let mut child = provider()?
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
        let _ = child.kill();
        let _ = child.wait();
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
    let detail = result.trim().chars().take(700).collect::<String>();
    if detail.is_empty() {
        "Could not contact the local lab provider. See First-time setup.".into()
    } else {
        detail
    }
}
