"""Opt-in acceptance with two real QEMU guests. Supply a prepared cloud image."""
import json
import os
from pathlib import Path
import re
import sys
import tempfile
import time
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src-tauri/src/vm_lab"))
import runner


def ready(role, attempt):
    deadline = time.monotonic() + 300
    while time.monotonic() < deadline:
        try:
            state = runner.probe(role, "observe", attempt)
            if state.get("ready") and (role != "server" or state.get("exportActive")):
                return
        except (runner.LabError, OSError, ValueError):
            pass
        time.sleep(2)
    raise RuntimeError(f"The {role} fixture did not become ready.")


def read_until(sock, pattern):
    deadline = time.monotonic() + 45
    buf = b""
    while time.monotonic() < deadline:
        sock.settimeout(max(0.1, deadline - time.monotonic()))
        piece = sock.recv(4096)
        if not piece:
            break
        buf = (buf + piece)[-16384:]
        if re.search(pattern, buf):
            return
    raise RuntimeError("The acceptance console did not reach the expected prompt.")


def configure_client(password):
    # Use the same serial login as the learner. The observation service accepts no shell input.
    with runner.connect("client", "serial") as console:
        console.sendall(b"\n")
        read_until(console, rb"login: ")
        console.sendall(b"learner\n")
        read_until(console, rb"Password: ")
        console.sendall(password.encode() + b"\n")
        read_until(console, rb"\$ ")
        script = ("printf '%s\\n' '/- /etc/auto.erudior' | sudo tee /etc/auto.master.d/erudior.autofs"
                  " && printf '%s\\n' '/mnt/projects -fstype=nfs4,ro 192.168.77.10:/srv/projects'"
                  " | sudo tee /etc/auto.erudior && sudo systemctl enable autofs && sudo systemctl restart autofs"
                  " && printf '\\nERUDIOR_%s_OK\\n' CONFIG\n")
        console.sendall(script.encode())
        read_until(console, rb"ERUDIOR_CONFIG_OK")


def acceptance(base):
    if not base.is_file():
        raise ValueError("Supply the path of a prepared qcow2 image.")
    original = Path.cwd()
    with tempfile.TemporaryDirectory(prefix="erudior-host-test-") as temp:
        root = Path(temp) / "erudior-vm-labs"
        images = root / "images"
        images.mkdir(parents=True)
        (images / (runner.SCENARIO + ".qcow2")).symlink_to(base)
        def action(name):
            return runner.main([name, runner.SCENARIO, "host-test", "fixture", "nfs"])
        with patch.dict(os.environ, XDG_DATA_HOME=temp):
            try:
                state = action("start")
                assert all(state["running"].values())
                attempt = runner.load("attempt.json")["id"]
                for role in runner.ROLES:
                    ready(role, attempt)
                baseline = action("check")["report"]
                assert baseline["before"] == baseline["after"] == {"remoteFile": False, "automount": False}
                configure_client(state["password"])
                passing = action("check")["report"]
                assert passing["before"] == passing["after"] == {"remoteFile": True, "automount": True}
                action("stop")
                assert not any(action("status")["running"].values())
                action("start")
                assert runner.load("attempt.json")["id"] == attempt
                action("reset")
                assert action("status")["password"] is None
                action("start")
                assert runner.load("attempt.json")["id"] != attempt
                print(json.dumps({"baseline": baseline, "configured": passing}, indent=2))
            finally:
                try:
                    action("reset")
                finally:
                    os.chdir(original)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("Usage: python3 tests/vm_lab_host.py /absolute/path/to/prepared-image.qcow2")
    acceptance(Path(sys.argv[1]).resolve())
