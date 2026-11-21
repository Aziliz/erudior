"""Installed inside each disposable Linux guest. The host supplies no command lines."""
import grp
import json
import os
import platform
import pwd
import shutil
import shlex
import stat
from pathlib import Path
import re
import subprocess
import sys
import time
import tempfile

PORT = "/dev/virtio-ports/com.erudior.lab.0"
PARAMS_FILE = "/etc/erudior-lab/params.json"
DATA_DISK = "/dev/disk/by-id/virtio-erudior-data"
SPARE_MAC = {"server": "52:54:00:aa:01:10", "client": "52:54:00:aa:01:20"}
SERVER = "192.168.77.10"
# Values from disks prepared before per-attempt parameters existed.
LEGACY = {"teamDir": "/srv/team", "teamGroup": "labops", "opUser": "labtech", "opGroup": "labops",
          "repoId": "erudior-local", "scriptPath": "/usr/local/bin/lab-classify", "threshold": "10",
          "tunedProfile": "throughput-performance", "swapFile": "/var/lib/erudior.swap", "swapMiB": "64",
          "hostAlias": "files.lab.test", "webFile": "/var/www/html/erudior-status.txt"}


def params():
    try:
        with open(PARAMS_FILE, encoding="utf-8") as source:
            loaded = json.load(source)
    except (OSError, ValueError):
        loaded = {}
    merged = dict(LEGACY)
    merged.update({k: v for k, v in loaded.items() if isinstance(k, str) and isinstance(v, str)} if isinstance(loaded, dict) else {})
    return merged


def command(*argv, seconds=5):
    # Bound guest I/O even when a learner's NFS mount is unresponsive.
    result = subprocess.run(["/usr/bin/timeout", "-k", "1", str(seconds), *argv],
                            stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    return result.returncode, result.stdout.decode(errors="replace").strip()


def readiness():
    release = platform.freedesktop_os_release() if hasattr(platform, "freedesktop_os_release") else {}
    os_id = release.get("ID", "")
    el10 = (os_id in {"rhel", "almalinux", "rocky", "centos"} or "rhel" in release.get("ID_LIKE", "").split()) and release.get("VERSION_ID", "").split(".")[0] == "10"
    return {"platform": {"el10": el10, "name": release.get("PRETTY_NAME", os_id)[:100]}, "probeRevision": 4, "boot": Path("/proc/sys/kernel/random/boot_id").read_text().strip(),
             "ready": command("systemctl", "is-system-running")[1] in {"running", "degraded"},
             "capabilities": capabilities()}


def spare_interface(role):
    for entry in Path("/sys/class/net").iterdir():
        try:
            if (entry / "address").read_text().strip().lower() == SPARE_MAC[role]:
                return entry.name
        except OSError:
            continue
    return None


def capabilities():
    which = lambda *names: all(shutil.which(n) or os.path.exists(n) for n in names)
    role = sys.argv[1] if len(sys.argv) > 1 else ""
    return {"lvm": which("lvcreate", "vgcreate", "pvcreate"), "xfs": which("mkfs.xfs"), "parted": which("parted"),
            "dataDisk": os.path.exists(DATA_DISK), "httpd": which("/usr/sbin/httpd"), "firewalld": which("firewall-cmd"),
            "semanage": which("semanage"), "ssh": which("ssh"), "cron": which("crontab", "/usr/sbin/crond"),
            "nmcli": which("nmcli"), "spareNic": role in SPARE_MAC and spare_interface(role) is not None}


def observe(role):
    state = readiness()
    if role == "server":
        code, marker = command("head", "-c", "128", "/srv/projects/erudior-lab.txt")
        state["marker"] = marker if code == 0 else ""
        state["exportActive"] = command("systemctl", "is-active", "--quiet", "nfs-server")[0] == 0
    else:
        state["clientToolsReady"] = all(shutil.which(name) for name in ("automount", "mount.nfs"))
        path = "/mnt/projects/erudior-lab.txt"
        for reading in range(2):
            code, marker = command("head", "-c", "128", path)
            fs_code, fs = command("stat", "-f", "-c", "%t", "--", path)
            mounts_code, mounts = command("findmnt", "-rnt", "autofs", "-o", "TARGET")
            active = command("systemctl", "is-active", "--quiet", "autofs")[0] == 0
            state["automount"] = active and mounts_code == 0 and bool({"/mnt", "/mnt/projects"} & set(mounts.splitlines()))
            state["remoteMarker"] = marker if code == fs_code == 0 and fs == "6969" else ""
            if not active or (state["automount"] and state["remoteMarker"]) or reading == 1:
                break
            # An active autofs daemon may still be attaching the on-demand share.
            time.sleep(1)
    return state


def task_observations(role, with_nfs):
    state = observe(role) if with_nfs else readiness()
    p = params()
    try:
        if role == "client":
            group = grp.getgrnam(p["opGroup"])
            user = pwd.getpwnam(p["opUser"])
            passed = group.gr_gid in os.getgrouplist(user.pw_name, user.pw_gid)
        else:
            group = grp.getgrnam(p["teamGroup"])
            info = os.lstat(p["teamDir"])
            passed = stat.S_ISDIR(info.st_mode) and info.st_gid == group.gr_gid and stat.S_IMODE(info.st_mode) == 0o2770
    except (KeyError, FileNotFoundError, NotADirectoryError):
        passed = False
    state["operator" if role == "client" else "teamDirectory"] = passed
    return state


def configured_repo(p):
    import dnf
    if not Path("/srv/erudior-repo/repodata/repomd.xml").is_file():
        raise OSError("The local RPM repository fixture is missing.")
    with dnf.Base() as base:
        base.read_all_repos()
        repo = base.repos.get(p["repoId"])
        return bool(repo and repo.enabled and repo.gpgcheck and
                    [url.rstrip("/") for url in repo.baseurl] == ["file:///srv/erudior-repo"] and
                    not repo.mirrorlist and not repo.metalink)


def script_result(attempt, p):
    script = p["scriptPath"]
    threshold = int(p["threshold"])
    if not os.path.isfile(script) or not os.access(script, os.X_OK):
        return False
    with open(script, "rb") as source:
        line = source.readline(257)
    if len(line) > 256 or not line.startswith(b"#!"):
        return False
    try:
        interpreter = shlex.split(line[2:].decode("ascii"))
    except (UnicodeDecodeError, ValueError):
        return False
    if interpreter and os.path.basename(interpreter[0]) == "env":
        interpreter = [part for part in interpreter[1:] if part != "-S"]
    if not interpreter or os.path.basename(interpreter[0]) not in {"sh", "bash", "dash", "ksh", "zsh"}:
        return False
    # Execute only inside the guest, as an unprivileged user, with bounded output and runtime.
    sample = int(attempt.replace("-", "")[:8], 16)
    for value in (threshold - 1, threshold, sample % threshold, threshold + 1 + sample % 997):
        arg, expected = str(value), "small" if value < threshold else "large"
        with tempfile.TemporaryFile() as output:
            args = ["/usr/bin/timeout", "-k", "1", "3", "runuser", "-u", "nobody", "--", "prlimit",
                    "--fsize=4096", "--as=134217728", "--nproc=32", "--cpu=1", "--", script, arg]
            result = subprocess.run(args, stdin=subprocess.DEVNULL, stdout=output, stderr=subprocess.DEVNULL)
            output.seek(0)
            answer = output.read(4097).strip()
        if result.returncode or answer != expected.encode():
            return False
    return True


def disk_name(path):
    return os.path.basename(os.path.realpath(path))


def on_data_disk(device):
    """True when the block device is the data disk or sits on it (partition, LV, or both)."""
    if not os.path.exists(DATA_DISK):
        return False
    code, names = command("lsblk", "-nslo", "NAME", "--", os.path.realpath(device))
    return code == 0 and disk_name(DATA_DISK) in {n.strip() for n in names.splitlines()}


def lvm_result(p):
    vg, lv = p["vgName"], p["lvName"]
    code, out = command("lvs", "--noheadings", "--units", "m", "--nosuffix", "-o", "lv_size,lv_path", vg + "/" + lv)
    fields = out.split()
    if code or len(fields) != 2:
        return False
    size, path = float(fields[0]), fields[1]
    want = int(p["lvMiB"])
    code, pvs = command("pvs", "--noheadings", "-o", "pv_name", "-S", "vg_name=" + vg)
    devices = [d.strip() for d in pvs.splitlines() if d.strip()]
    code2, mount = command("findmnt", "-nro", "SOURCE,FSTYPE", "--mountpoint", p["lvMount"])
    parts = mount.split()
    return (not code and devices and all(on_data_disk(d) for d in devices) and want * 0.95 <= size <= want * 1.1 + 8
            and code2 == 0 and len(parts) == 2 and parts[1] == "xfs"
            and os.path.realpath(parts[0]) == os.path.realpath(path))


def swap_device_result(p):
    want_kib = (int(p["swapDevMiB"]) - 1) * 1024
    for row in (line.split() for line in Path("/proc/swaps").read_text().splitlines()[1:]):
        if len(row) >= 3 and row[1] == "partition" and int(row[2]) >= want_kib and on_data_disk(row[0]):
            return True
    return False


def web_port_result(p):
    from urllib import request, error
    port = p["webPort"]
    if not (command("systemctl", "is-active", "--quiet", "httpd")[0] == 0 and
            command("systemctl", "is-enabled", "httpd") == (0, "enabled") and command("getenforce") == (0, "Enforcing")):
        return False
    code, listening = command("ss", "-Hltn", "sport = :" + port)
    if code or not listening:
        return False
    if command("firewall-cmd", "--state")[0] or command("firewall-cmd", "--query-port=" + port + "/tcp")[1] != "yes":
        return False
    for host in ("127.0.0.1", SERVER):  # httpd may listen on the lab address only.
        try:
            request.urlopen("http://" + host + ":" + port + "/", timeout=5)
            return True
        except error.HTTPError as answer:
            if answer.code < 500:  # A 403 for an empty document root still proves httpd answered.
                return True
        except (OSError, ValueError):
            continue
    return False


def ssh_result(p):
    user = p["sshUser"]
    if not re.fullmatch(r"[a-z_][a-z0-9_-]{0,31}", user):
        return False
    code, _ = command("runuser", "-u", "learner", "--", "ssh", "-n", "-o", "BatchMode=yes",
                      "-o", "PasswordAuthentication=no", "-o", "KbdInteractiveAuthentication=no",
                      "-o", "StrictHostKeyChecking=no", "-o", "UserKnownHostsFile=/dev/null", "-o", "LogLevel=ERROR",
                      "-o", "ConnectTimeout=10", user + "@" + SERVER, "true", seconds=30)
    return code == 0


def cron_result(p):
    if not (command("systemctl", "is-active", "--quiet", "crond")[0] == 0 and
            command("systemctl", "is-enabled", "crond") == (0, "enabled")):
        return False
    code, table = command("crontab", "-l", "-u", "learner")
    if code:
        return False
    for line in table.splitlines():
        fields = line.split(None, 5)
        if len(fields) < 6 or fields[0].startswith("#") or "=" in fields[0]:
            continue
        try:
            timing = int(fields[0]) == int(p["cronMinute"]) and int(fields[1]) == int(p["cronHour"])
        except ValueError:
            continue
        if timing and fields[2:5] == ["*", "*", "*"] and "logger" in fields[5] and p["cronTag"] in fields[5]:
            return True
    return False


def network_result(p, role):
    device = spare_interface(role)
    if not device:
        return False
    code, raw = command("ip", "-j", "-4", "addr", "show", "dev", device)
    try:
        addresses = {(a["local"], a["prefixlen"]) for link in json.loads(raw or "[]") for a in link.get("addr_info", [])}
    except (ValueError, KeyError, TypeError):
        return False
    code2, info = command("nmcli", "-t", "-g", "IP4.GATEWAY,IP4.DNS", "device", "show", device)
    values = {v.strip() for line in info.splitlines() for v in line.split("|") if v.strip()}
    try:
        hostname = Path("/etc/hostname").read_text().strip()
    except OSError:
        hostname = ""
    return (not code and (p["spareAddress"], 24) in addresses and not code2 and
            p["spareGateway"] in values and p["spareDns"] in values and
            hostname == p["clientHostname"] and command("hostname") == (0, p["clientHostname"]))


def extra_task(key, attempt):
    tools = {"client-script": ("runuser", "prlimit"), "server-tuning": ("tuned-adm",),
             "client-resolution": ("getent",), "server-selinux": ("getenforce",),
             "server-lvm": ("lvs", "pvs", "findmnt", "lsblk"), "server-swap-part": ("lsblk",),
             "server-web-port": ("ss", "firewall-cmd", "getenforce"), "client-ssh-key": ("ssh", "runuser"),
             "client-cron": ("crontab",), "client-network": ("ip", "nmcli")}
    for name in tools.get(key, ()):
        if not shutil.which(name):
            raise OSError(f"Missing guest utility {name}")
    p = params()
    if key == "client-repo":
        return configured_repo(p)
    if key == "client-script":
        return script_result(attempt, p)
    if key == "server-tuning":
        code, result = command("tuned-adm", "active")
        return code == 0 and result.split(":")[-1].strip() == p["tunedProfile"]
    if key == "server-swap":
        return any(len(row) >= 3 and row[0] == p["swapFile"] and row[1] == "file"
                   and int(row[2]) >= int(p["swapMiB"]) * 1024 - 4 for row in
                   (line.split() for line in Path("/proc/swaps").read_text().splitlines()[1:]))
    if key == "server-service":
        return (command("systemctl", "is-active", "--quiet", "erudior-maint.service")[0] == 0 and
                command("systemctl", "is-enabled", "erudior-maint.service") == (0, "enabled") and
                Path("/run/erudior-maint.ready").is_file())
    if key == "client-resolution":
        code, result = command("getent", "ahostsv4", p["hostAlias"])
        return code == 0 and {row.split()[0] for row in result.splitlines() if row.split()} == {"192.168.77.10"}
    if key == "server-selinux":
        path = p["webFile"]
        code, label = command("stat", "-c", "%C", "--", path)
        return (os.path.isfile(path) and not os.path.islink(path) and code == 0 and
                label.split(":")[2:3] == ["httpd_sys_content_t"] and command("getenforce") == (0, "Enforcing"))
    if key == "server-lvm":
        return lvm_result(p)
    if key == "server-swap-part":
        return swap_device_result(p)
    if key == "server-web-port":
        return web_port_result(p)
    if key == "client-ssh-key":
        return ssh_result(p)
    if key == "client-cron":
        return cron_result(p)
    if key == "client-network":
        return network_result(p, "client")
    raise ValueError("Unknown observation")


EXTRA = {"client-repo", "client-script", "server-tuning", "server-swap", "server-service",
         "client-resolution", "server-selinux", "server-lvm", "server-swap-part", "server-web-port",
         "client-ssh-key", "client-cron", "client-network"}


def serve(port, role, attempt):
    while True:
        line = port.readline(256)
        if not line:
            return
        match = re.fullmatch(rb"([a-f0-9]{32}) (observe|tasks|tasks-nfs|reboot|extra:[a-z-]+)\n", line)
        if not match:
            continue
        nonce, verb = (field.decode() for field in match.groups())
        reboot = verb == "reboot" and role in {"client", "server"}
        if verb.startswith("extra:"):
            key = verb[6:]
            if key not in EXTRA or not key.startswith(role + "-"):
                continue
            try:
                data = {"passed": extra_task(key, attempt)}
            except (OSError, ValueError, ImportError, RuntimeError) as error:
                data = {"observationError": str(error)[:160]}
        elif verb in {"tasks", "tasks-nfs"}:
            data = task_observations(role, verb == "tasks-nfs")
        else:
            data = observe(role) if verb == "observe" else {"reboot": reboot}
        port.write(json.dumps(dict(data, nonce=nonce, role=role, attempt=attempt)).encode() + b"\n")
        if reboot:
            command("systemctl", "--no-block", "reboot")


if __name__ == "__main__":
    role, attempt = sys.argv[1:]
    while True:
        try:
            with open(PORT, "r+b", buffering=0) as channel:
                serve(channel, role, attempt)
        except OSError:
            pass  # The host may be restarting or closing its endpoint.
        time.sleep(0.5)
