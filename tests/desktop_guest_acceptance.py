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
    # The serial console may attach before cloud-init creates the learner or
    # after a login prompt was printed on a disconnected port.
    for attempt in range(5):
        console.sendall(b"\n")
        read_prompt(console, rb"login: ", timeout=100)
        console.sendall(b"learner\n")
        read_prompt(console, rb"Password: ", timeout=25)
        console.sendall(password.encode() + b"\n")
        reply = read_prompt(console, rb"\$ |[Ll]ogin incorrect|login: ", timeout=40)
        if re.search(rb"\$ ", reply):
            return
        time.sleep(3)
    raise RuntimeError("The generated learner credential did not open the console.")


def check(console, command):
    console.sendall((command + " && printf 'DESKTOP_%s_PASSED\\n' CHECK || printf 'DESKTOP_%s_FAILED\\n' CHECK\n").encode())
    output = read_prompt(console, rb"DESKTOP_CHECK_(?:PASSED|FAILED)")
    if b"DESKTOP_CHECK_PASSED" not in output:
        console.sendall(b"cloud-init status --long; systemctl list-jobs --no-pager; ps -eo pid,ppid,etime,stat,wchan:20,comm | tail -90; sudo tail -50 /var/log/cloud-init-output.log; sudo tail -20 /var/log/dnf.log; lsblk -o NAME,SIZE,LABEL; cat /etc/os-release | head -7; getenforce; ip -br a; systemctl --failed --no-pager; sudo grep -Ei 'error|warn|fail' /var/log/cloud-init.log | tail -20; printf 'END_%s_DIAGNOSTICS\\n' GUEST\n")
        detail = read_prompt(console, rb"END_GUEST_DIAGNOSTICS", timeout=40)
        print(detail.decode(errors="replace")[-13500:], flush=True)
        raise RuntimeError(f"Guest verification failed: {output[-850:]!r}")


def verify(course):
    def action(name):
        return runner.main([name, runner.SCENARIO, "release-acceptance", course, "practice-environment"])

    consoles = {}
    try:
        print(course, "starting practice pair", flush=True)
        state = action("start")
        assert all(state["running"].values())
        base = runner.lab_root() / "images" / runner.AUTO_IMAGE
        original_base = (base.stat().st_ino, base.stat().st_mtime_ns)
        for role in runner.ROLES:
            console = consoles[role] = runner.connect(role, "serial", timeout=30)
            print(course, role, "logging in", flush=True)
            login(console, state["password"])
            check(console, 'timeout 150 cloud-init status --wait && . /etc/os-release && test "$VERSION_ID" = 10.3 '
                  '&& test "$(getenforce)" = Enforcing && test -b /dev/vdb && test -b /dev/vdc')
            check(console, "echo practice-change > /var/tmp/erudior-reset-test")
            print(course, role, "booted AlmaLinux with enforcing SELinux and both practice disks", flush=True)
        track = "rhce" if course == runner.RHCE_COURSE else "rhcsa"
        for role, console in consoles.items():
            print(track, role, "validating the course kit", flush=True)
            check(console, f"sudo bash /mnt/erudior-tools/check-guest.sh {track} {role}")
        if course == runner.RHCE_COURSE:
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
        fresh = action("start")
        assert fresh["password"] != state["password"] and fresh["attemptId"] != state["attemptId"]
        assert (base.stat().st_ino, base.stat().st_mtime_ns) == original_base
        for role in runner.ROLES:
            console = consoles[role] = runner.connect(role, "serial", timeout=30)
            login(console, fresh["password"])
            check(console, "timeout 150 cloud-init status --wait && test ! -e /var/tmp/erudior-reset-test")
            console.close()
        action("reset")
        print(course, "readiness and second-attempt reset passed on both guests", flush=True)
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
