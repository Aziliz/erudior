"""Opt-in weighted exam with two real connected guests. Run on a prepared Linux desktop."""
import json
import os
from pathlib import Path
import sys
import tempfile
import time
from unittest.mock import patch

from vm_lab_host import read_until, ready, runner

TASKS = [{"id": "client-operator", "points": 3}, {"id": "server-team-directory", "points": 4},
         {"id": "client-nfs", "points": 3}]


def configure(role, password, with_nfs):
    script = "sudo groupadd labops"
    if role == "server":
        script += " && sudo install -d -g labops -m 2770 /srv/team"
    else:
        script += " && sudo useradd -G labops labtech"
        if with_nfs:
            script += (" && printf '%s\\n' '/- /etc/auto.erudior' | sudo tee /etc/auto.master.d/erudior.autofs"
                       " && printf '%s\\n' '/mnt/projects -fstype=nfs4,ro 192.168.77.10:/srv/projects' | sudo tee /etc/auto.erudior"
                       " && sudo systemctl enable autofs && sudo systemctl restart autofs")
    with runner.connect(role, "serial") as console:
        console.sendall(b"\n")
        read_until(console, rb"login: ")
        console.sendall(b"learner\n")
        read_until(console, rb"Password: ")
        console.sendall(password.encode() + b"\n")
        read_until(console, rb"\$ ")
        console.sendall((script + " && printf '\\nTASK_%s_DONE\\n' CHECK\n").encode())
        read_until(console, rb"TASK_CHECK_DONE")


def verify(report, with_nfs):
    assert report["exam"]["reason"] == "submitted"
    assert report["tasks"] == [dict(TASKS[0], before=True, after=True), dict(TASKS[1], before=True, after=True),
                               dict(TASKS[2], before=with_nfs, after=with_nfs)]


# Actual serial configurations used by the opt-in acceptance test.
MOCK_TASKS = [
    {"id": key, "points": 30}
    for key in ("client-operator", "server-team-directory", "client-nfs", "client-repo",
                "client-script", "server-tuning", "server-swap", "server-service",
                "client-resolution", "server-selinux")
]


def configure_mock(role, password, transient_directory=False):
    if role == "server":
        commands = [
            "sudo groupadd labops",
            "sudo mkdir -p /srv/team",
            *(["sudo mount -t tmpfs tmpfs /srv/team"] if transient_directory else []),
            "sudo chgrp labops /srv/team && sudo chmod 2770 /srv/team",
            "sudo tuned-adm profile throughput-performance",
            "sudo dd if=/dev/zero of=/var/lib/erudior.swap bs=1M count=65 status=none",
            "sudo chmod 600 /var/lib/erudior.swap && sudo mkswap /var/lib/erudior.swap",
            "sudo swapon /var/lib/erudior.swap",
            "echo '/var/lib/erudior.swap none swap defaults 0 0' | sudo tee -a /etc/fstab",
            "sudo systemctl enable --now erudior-maint.service",
            "sudo mkdir -p /var/www/html && sudo touch /var/www/html/erudior-status.txt",
            "sudo restorecon -RF /var/www/html",
        ]
    else:
        commands = [
            "sudo groupadd labops && sudo useradd -G labops labtech",
            "printf '%s\\n' '/- /etc/auto.erudior' | sudo tee /etc/auto.master.d/erudior.autofs",
            "printf '%s\\n' '/mnt/projects -fstype=nfs4,ro 192.168.77.10:/srv/projects' | sudo tee /etc/auto.erudior",
            "sudo systemctl enable autofs && sudo systemctl restart autofs",
            "timeout 40 cat /mnt/projects/erudior-lab.txt >/dev/null",
            "printf '%s\\n' '[erudior-local]' 'name=Lab' 'baseurl=file:///srv/erudior-repo' 'enabled=1' 'gpgcheck=1' | sudo tee /etc/yum.repos.d/erudior-local.repo",
            "sudo dnf -q --disablerepo='*' --enablerepo=erudior-local makecache --refresh",
            """printf '%s\\n' '#!/bin/sh' 'if [ "$1" -lt 10 ]; then echo small; else echo large; fi' | sudo tee /usr/local/bin/lab-classify""",
            "sudo chmod 755 /usr/local/bin/lab-classify",
            "echo '192.168.77.10 files.lab.test' | sudo tee -a /etc/hosts",
        ]
    with runner.connect(role, "serial") as console:
        console.sendall(b"\n")
        read_until(console, rb"login: ")
        console.sendall(b"learner\n")
        read_until(console, rb"Password: ")
        console.sendall(password.encode() + b"\n")
        read_until(console, rb"\$ ")
        for step, command in enumerate(commands):
            console.sendall((command + f" && printf '\\nSTEP_%s_{step}\\n' OK\n").encode())
            read_until(console, f"STEP_OK_{step}".encode())


def verify_mock(report, transient_directory):
    assert report["gradingVersion"] == 2 and report["exam"]["reason"] == "submitted"
    assert report["tasks"] == [
        dict(task, before=True, after=not (transient_directory and task["id"] == "server-team-directory"))
        for task in MOCK_TASKS
    ], report["tasks"]


def acceptance(base, mock_exam=False):
    if not base.is_file():
        raise ValueError("Supply a prepared qcow2 image.")
    original = Path.cwd()
    with tempfile.TemporaryDirectory() as tmp, patch.dict(os.environ, XDG_DATA_HOME=tmp):
        images = Path(tmp) / "erudior-vm-labs/images"
        images.mkdir(parents=True)
        image_name = runner.ALMA_IMAGE if mock_exam else runner.SCENARIO + ".qcow2"
        course = runner.RHCSA_COURSE if mock_exam else "fixture"
        (images / image_name).symlink_to(base)
        try:
            scenario = runner.RHCSA_MOCK if mock_exam else runner.ADMIN_EXAM
            minutes, tasks = ("180", MOCK_TASKS) if mock_exam else ("10", TASKS)
            prepare, check = (configure_mock, verify_mock) if mock_exam else (configure, verify)
            for variant in (False, True):
                def action(name, expected=""):
                    return runner.main([name, scenario, "host", course, "weighted", minutes, expected, json.dumps(tasks)])
                started = action("start")
                attempt = started["exam"]["id"]
                for role in runner.ROLES:
                    ready(role, attempt)
                state = action("begin", attempt)
                if mock_exam:
                    platforms = state["exam"]["platforms"]
                    boots = {role: runner.probe(role, "tasks", attempt)["boot"] for role in runner.ROLES}
                    assert len(set(boots.values())) == len(runner.ROLES)
                    print(json.dumps({"attempt": attempt, "platforms": platforms, "bootsBefore": boots}), flush=True)
                for role in runner.ROLES:
                    prepare(role, state["password"], variant)
                action("submit", attempt)
                deadline = time.monotonic() + 1200
                while time.monotonic() < deadline:
                    state = action("status")
                    if state["exam"]["phase"] == "complete":
                        break
                    if state["exam"]["phase"] == "error":
                        raise RuntimeError(state["exam"]["error"])
                    time.sleep(2)
                check(state["report"], variant)
                if mock_exam:
                    rebooted = {role: runner.probe(role, "tasks", attempt)["boot"] for role in runner.ROLES}
                    assert all(rebooted[role] != boots[role] for role in runner.ROLES)
                    print(json.dumps({"attempt": attempt, "bootsAfter": rebooted}), flush=True)
                print(json.dumps(state["report"]), flush=True)
                action("reset", attempt)
        finally:
            if Path(tmp) in Path.cwd().parents:
                with open("lock", "a") as guard:
                    runner.fcntl.flock(guard, runner.fcntl.LOCK_EX)
                    runner.operate("reset", base)
            os.chdir(original)


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("image", type=Path)
    parser.add_argument("--rhcsa", action="store_true", help="run the fixed 180-minute profile and its persistence case")
    args = parser.parse_args()
    acceptance(args.image.resolve(), args.rhcsa)
