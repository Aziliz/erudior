"""Check all six additional RHCSA graders on fresh AlmaLinux course VMs."""
import base64
import contextlib
import json
import os
from pathlib import Path
import re
import tempfile
import time
from unittest.mock import patch

from vm_lab_host import read_until, runner

TASKS = [{"id": name, "points": 10} for name in runner.NEW_TASKS]


@contextlib.contextmanager
def console(role, password):
    with runner.connect(role, "serial") as sock:
        sock.sendall(b"\n")
        read_until(sock, rb"login: ")
        sock.sendall(b"learner\n")
        read_until(sock, rb"Password: ")
        sock.sendall(password.encode() + b"\n")
        read_until(sock, rb"\$ ")
        yield sock


def execute(sock, script):
    """Run one short fixture script in the guest, returning its stdout or its failure."""
    encoded = base64.b64encode(script.encode()).decode()
    # Keep each serial input line below Linux's canonical input limit.
    assert len(encoded) < 3500
    command = ("printf 'BEGIN_%s\\n' FIXTURE; echo " + encoded +
               " | base64 -d | bash -eu -o pipefail; printf '\\nEND_%s_%d\\n' FIXTURE $?\n")
    sock.sendall(command.encode())
    buffer = b""
    deadline = time.monotonic() + 180
    while time.monotonic() < deadline:
        sock.settimeout(max(0.1, deadline - time.monotonic()))
        piece = sock.recv(4096)
        if not piece:
            break
        buffer = (buffer + piece)[-32768:]
        result = re.search(rb"BEGIN_FIXTURE\r?\n(.*?)\r?\nEND_FIXTURE_(\d+)\r?\n", buffer, re.S)
        if result:
            output = result[1].decode(errors="replace").strip()
            if result[2] != b"0":
                raise RuntimeError(f"Guest fixture failed ({result[2].decode()}): {output[-1200:]}")
            return output
    raise TimeoutError("Guest fixture did not return its exit status.")


def configure(password):
    with console("client", password) as client, console("server", password) as server:
        public_key = execute(client, """
mkdir -p -m 700 ~/.ssh
ssh-keygen -q -t ed25519 -N '' -C acceptance -f ~/.ssh/id_ed25519
cat ~/.ssh/id_ed25519.pub
""")
        assert re.fullmatch(r"ssh-ed25519 [A-Za-z0-9+/=]+ acceptance", public_key), public_key
        execute(server, f"""
sudo useradd -m labssh
sudo install -d -m 700 -o labssh -g labssh /home/labssh/.ssh
echo '{public_key}' | sudo tee /home/labssh/.ssh/authorized_keys >/dev/null
sudo chown labssh:labssh /home/labssh/.ssh/authorized_keys
sudo chmod 600 /home/labssh/.ssh/authorized_keys
sudo restorecon -RF /home/labssh/.ssh
""")
        execute(server, """
disk=/dev/disk/by-id/virtio-erudior-data
test -b "$disk"
test -z "$(sudo wipefs --noheadings -o TYPE "$disk")"
sudo pvcreate -y "$disk"
sudo vgcreate labvg "$disk"
sudo lvcreate -L 400M -n labdata labvg
sudo lvcreate -L 256M -n swap labvg
sudo mkfs.xfs /dev/labvg/labdata
sudo mkswap /dev/labvg/swap
sudo mkdir -p /srv/labdata
printf '%s\\n' '/dev/labvg/labdata /srv/labdata xfs defaults 0 0' '/dev/labvg/swap none swap defaults 0 0' | sudo tee -a /etc/fstab
sudo systemctl daemon-reload
sudo mount /srv/labdata
sudo swapon /dev/labvg/swap
sudo semanage port -a -t http_port_t -p tcp 18080
echo 'Listen 18080' | sudo tee /etc/httpd/conf.d/erudior-test.conf
echo 'ready' | sudo tee /var/www/html/index.html
sudo systemctl enable --now httpd
sudo firewall-cmd --permanent --zone=rhcsa-lab --add-port=18080/tcp
sudo firewall-cmd --zone=rhcsa-lab --add-port=18080/tcp
""")
        execute(client, """
echo '15 2 * * * /usr/bin/logger erudior-nightly' | crontab -
sudo systemctl enable --now crond
for path in /sys/class/net/*; do
  if [[ $(cat "$path/address") == 52:54:00:aa:01:20 ]]; then device=${path##*/}; fi
done
sudo nmcli connection add type ethernet con-name exam-spare ifname "$device" \
  connection.autoconnect-priority 999 ipv4.method manual ipv4.addresses 10.88.10.20/24 \
  ipv4.gateway 10.88.10.1 ipv4.dns 10.88.10.53 ipv6.method disabled
sudo nmcli connection up exam-spare
sudo hostnamectl set-hostname client01.lab.test
""")


def verify():
    original = Path.cwd()
    source = runner.lab_root() / "images"
    with tempfile.TemporaryDirectory() as tmp, patch.dict(os.environ, XDG_DATA_HOME=tmp):
        images = runner.lab_root() / "images"
        images.mkdir(parents=True)
        for name in (runner.AUTO_IMAGE, runner.DVD_NAME, "Erudior-setup.iso"):
            (images / name).symlink_to((source / name).resolve(strict=True))

        def action(name, expected=""):
            return runner.main([name, runner.ADMIN_EXAM, "acceptance", runner.RHCSA_COURSE,
                                "six-new-tasks", "60", expected, json.dumps(TASKS)])

        try:
            started = action("start")
            attempt_id = started["exam"]["id"]
            deadline = time.monotonic() + 1200
            while True:
                try:
                    active = action("begin", attempt_id)
                    break
                except (OSError, ValueError, runner.LabError) as error:
                    if time.monotonic() >= deadline:
                        raise TimeoutError("RHCSA preflight") from error
                    time.sleep(3)
            assert active["exam"]["phase"] == "active"
            platforms = active["exam"]["platforms"]
            assert set(platforms) == set(runner.ROLES)
            assert all("AlmaLinux 10" in label for label in platforms.values())
            attempt = runner.load("attempt.json")
            baseline = runner.capture(attempt, TASKS, persistent=True)
            assert baseline["before"] == dict.fromkeys(runner.NEW_TASKS, False), baseline["before"]
            configure(active["password"])
            action("submit", attempt_id)
            deadline = time.monotonic() + 1200
            while time.monotonic() < deadline:
                state = action("status")
                if state["exam"]["phase"] == "complete":
                    break
                if state["exam"]["phase"] == "error":
                    raise RuntimeError(state["exam"]["error"])
                time.sleep(2)
            else:
                raise TimeoutError("RHCSA grading")
            report = state["report"]
            assert report["tasks"] == [dict(task, before=True, after=True) for task in TASKS], report
            assert report["exam"]["reason"] == "submitted"
            after = {role: runner.probe(role, "tasks", attempt_id)["boot"] for role in runner.ROLES}
            assert all(after[role] != baseline["boots"][role] for role in runner.ROLES)
            receipt = original / "rhcsa-six-guest-receipt.json"
            receipt.write_text(json.dumps({"platforms": platforms, "baseline": baseline["before"],
                                           "bootsBefore": baseline["boots"], "bootsAfter": after,
                                           "report": report}, indent=2))
            receipt.chmod(0o644)
        finally:
            try:
                for role in runner.ROLES:
                    if runner.running(role):
                        runner.monitor(role, "quit")
                        runner.wait_off(role)
            finally:
                os.chdir(original)


if __name__ == "__main__":
    verify()
