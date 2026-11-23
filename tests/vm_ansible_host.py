"""Exercise the production playbook grader using two fresh AlmaLinux overlays."""
import base64
import json
import os
from pathlib import Path
import tempfile
import time

from vm_lab_host import read_until, runner

TASKS = [{"id": runner.ANSIBLE_TASK, "points": 100}]
GOOD = """- hosts: managed
  gather_facts: false
  become: true
  tasks:
    - ansible.builtin.copy:
        dest: /etc/erudior-proof.conf
        content: "managed=true\\n"
        owner: root
        group: root
        mode: "0640"
"""


def stage(guest, playbook):
    payload = base64.b64encode(playbook.encode()).decode()
    guest.sendall(("echo " + payload + " | base64 -d > /home/learner/site.yml && printf 'STAGED_%s\\n' YES\n").encode())
    read_until(guest, rb"STAGED_YES")


def verify():
    original = Path.cwd()
    source = runner.lab_root() / "images"
    with tempfile.TemporaryDirectory() as folder:
        os.environ["XDG_DATA_HOME"] = folder
        images = runner.lab_root() / "images"
        images.mkdir(parents=True)
        # The original media and base are immutable; the runner creates overlays in this test directory.
        for name in (runner.AUTO_IMAGE, runner.DVD_NAME, "Erudior-setup.iso"):
            shared = source / name
            if not shared.is_file():
                raise FileNotFoundError(shared)
            (images / name).symlink_to(shared)
        args = [runner.RHCE_EXAM, "acceptance", runner.RHCE_COURSE, "collector-converge", "60"]
        state = runner.main(["start", *args])
        attempt = runner.load("attempt.json")
        identifier = attempt["id"]
        try:
            deadline = time.monotonic() + 900
            while True:
                try:
                    state = runner.main(["begin", *args, identifier])
                    break
                except (OSError, ValueError, runner.LabError) as error:
                    if time.monotonic() >= deadline:
                        raise TimeoutError("Guest preflight") from error
                    time.sleep(3)
            assert state["exam"]["phase"] == "active"
            with runner.connect("client", "serial") as console:
                console.sendall(b"\n"); read_until(console, rb"login: ")
                console.sendall(b"learner\n"); read_until(console, rb"Password: ")
                console.sendall(attempt["password"].encode() + b"\n"); read_until(console, rb"\$ ")
                stage(console, GOOD + "    - ansible.builtin.command: /usr/bin/true\n")
                assert runner.capture(attempt, TASKS, persistent=True)["before"] == {runner.ANSIBLE_TASK: False}
                stage(console, GOOD)
            runner.main(["submit", *args, identifier])
            deadline = time.monotonic() + 1200
            while True:
                state = runner.main(["status", *args])
                if state["exam"]["phase"] in {"complete", "error"} or time.monotonic() >= deadline:
                    break
                time.sleep(2)
            assert state["exam"]["phase"] == "complete", state["exam"].get("error")
            report = state["report"]
            assert report["tasks"] == [dict(TASKS[0], before=True, after=True)], report["tasks"]
            assert report["exam"]["reason"] == "submitted"
            assert all("AlmaLinux 10" in name for name in state["exam"]["platforms"].values())
            evidence = original / "ansible-guest-receipt.json"
            evidence.write_text(json.dumps({
                "platforms": state["exam"]["platforms"], "nonIdempotentRejected": True, "report": report
            }, indent=2))
            evidence.chmod(0o644)  # Only this synthetic score is exported from the root-owned CI container.
        finally:
            for role in runner.ROLES:
                if runner.running(role):
                    runner.monitor(role, "quit")
                    runner.wait_off(role)
            os.chdir(original)


if __name__ == "__main__":
    verify()
