"""Exercise the learner's normal provider start, serial consoles and disk reset."""
import re
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src-tauri/src/vm_lab"))
import runner


def read_prompt(console, pattern, timeout=600):
    deadline = time.monotonic() + timeout
    output = b""
    while time.monotonic() < deadline:
        console.settimeout(10)
        try:
            part = console.recv(4096)
        except TimeoutError:
            continue
        if not part:
            break
        output = (output + part)[-32768:]
        if re.search(pattern, output):
            return output
    raise RuntimeError(f"Guest did not reach {pattern!r}. Last output: {output[-600:]!r}")


def login(console, password):
    console.sendall(b"\n")
    read_prompt(console, rb"login: ")
    console.sendall(b"learner\n")
    read_prompt(console, rb"Password: ")
    console.sendall(password.encode() + b"\n")
    read_prompt(console, rb"\$ ")


def check(console, command):
    console.sendall((command + " && printf 'DESKTOP_%s_PASSED\\n' CHECK || printf 'DESKTOP_%s_FAILED\\n' CHECK\n").encode())
    output = read_prompt(console, rb"DESKTOP_CHECK_(?:PASSED|FAILED)")
    if b"DESKTOP_CHECK_PASSED" not in output:
        raise RuntimeError(f"Guest verification failed: {output[-850:]!r}")


def verify(course):
    def action(name):
        return runner.main([name, runner.SCENARIO, "release-acceptance", course, "practice-environment"])

    consoles = {}
    try:
        state = action("start")
        assert all(state["running"].values())
        for role in runner.ROLES:
            console = consoles[role] = runner.connect(role, "serial", timeout=30)
            login(console, state["password"])
            check(console, 'cloud-init status --wait && . /etc/os-release && test "$VERSION_ID" = 10.3 '
                  '&& test "$(getenforce)" = Enforcing && test -b /dev/vdb && test -b /dev/vdc')
            print(course, role, "booted AlmaLinux with enforcing SELinux and both practice disks", flush=True)
        if course == runner.RHCE_COURSE:
            for role, console in consoles.items():
                check(console, f"sudo bash /mnt/erudior-tools/check-guest.sh rhce {role}")
            check(consoles["client"], "ANSIBLE_HOST_KEY_CHECKING=True ansible all -i '192.168.77.10,' "
                  "-u learner --private-key ~/.ssh/erudior_rhce -m ansible.builtin.ping")
        else:
            for console in consoles.values():
                check(console, "test -s /mnt/erudior-dvd/BaseOS/repodata/repomd.xml")
            observed = runner.capture(runner.load("attempt.json"), preflight=True)
            print("Grader confirmed both guests:", observed["platforms"], flush=True)
        for console in consoles.values():
            console.close()
        action("reset")
        assert not any(action("status")["running"].values())
        assert action("status")["password"] is None
        print(course, "readiness and disk reset passed", flush=True)
    finally:
        for console in consoles.values():
            console.close()
        for role in runner.ROLES:
            try:
                runner.monitor(role, "quit")
            except OSError:
                pass


if __name__ == "__main__":
    verify(sys.argv[1])
