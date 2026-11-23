"""Observe serial boot messages only during setup on the isolated macOS CI runner."""
import json
import os
from pathlib import Path
import re
import select
import socket
import time

root = Path.home() / ".local/share/erudior-vm-labs/attempts"
end = time.monotonic() + 40 * 60
channels = {}
buffers = {}
last = 0
safe = re.compile(r"cloud-init|emergency|failed|timed out|login:|Starting kernel|Linux version|Reached target|error:|panic|CPU does not support", re.I)
while time.monotonic() < end:
    dirs = list(root.glob("*/attempt.json"))
    if not dirs:
        time.sleep(2)
        continue
    attempt = dirs[0]
    state = json.loads(attempt.read_text())
    if state.get("exam", {}).get("phase"):
        break
    if time.monotonic() > last + 30:
        last = time.monotonic()
        print("Provider", os.uname().machine, "KVM", os.access("/dev/kvm", os.R_OK | os.W_OK),
              "overlays", [(p.name, p.stat().st_blocks * 512) for p in attempt.parent.glob("*.qcow2")], flush=True)
        for log in attempt.parent.glob("*.log"):
            tail = log.read_bytes()[-1200:].decode(errors="replace")
            if tail:
                print(log.name, tail, flush=True)
    for role in ("server", "client"):
        if role in channels:
            continue
        try:
            sock = socket.socket(socket.AF_UNIX)
            os.chdir(attempt.parent)
            sock.connect(role + ".serial")
            sock.setblocking(False)
            channels[role] = sock
            buffers[role] = ""
        except OSError:
            sock.close()
    waiting = list(channels.values())
    if not waiting:
        time.sleep(1)
        continue
    ready, _, _ = select.select(waiting, [], [], 1)
    for role, sock in list(channels.items()):
        if sock not in ready:
            continue
        data = sock.recv(32768)
        if not data:
            sock.close()
            del channels[role]
            continue
        buffers[role] += data.decode(errors="replace")
        lines = buffers[role].split("\n")
        buffers[role] = lines.pop()[-4096:]
        for line in lines:
            line = re.sub(r"\x1b\[[0-9;:?]*[a-zA-Z]", "", line).strip()
            if safe.search(line) and not re.search(r"key|password", line, re.I):
                print(role, line[:300], flush=True)
