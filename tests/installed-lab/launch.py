"""Launch the installed acceptance package twice and keep a machine-readable receipt."""
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import time

app = sys.argv[1]
base = Path(os.environ["APPDATA"]) if sys.platform == "win32" else Path.home() / "Library/Application Support"
receipt = base / "com.erudior.acceptance/documents/installed-lab.json"
destination = Path("installed-lab-receipt.json")
if receipt.exists():
    raise SystemExit("The runner must have a fresh acceptance profile.")
for target in ("restart", "verified"):
    process = subprocess.Popen([app])
    try:
        deadline = time.monotonic() + (125 if sys.platform == "darwin" and target == "restart" else 55) * 60
        phase = None
        while time.monotonic() < deadline:
            if process.poll() is not None:
                raise RuntimeError("The installed application exited prematurely.")
            if receipt.exists():
                data = json.loads(receipt.read_text(encoding="utf-8"))
                if data["phase"] != phase:
                    phase = data["phase"]
                    print(phase, flush=True)
                shutil.copyfile(receipt, destination)
                if phase == "failed":
                    raise RuntimeError(str(data["detail"]))
                if phase == target:
                    break
            time.sleep(1)
        else:
            raise TimeoutError(target)
    finally:
        process.terminate()
        process.wait(timeout=30)
