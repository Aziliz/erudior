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


def command(*argv):
    # Bound guest I/O even when a learner's NFS mount is unresponsive.
    result = subprocess.run(["/usr/bin/timeout", "-k", "1", "5", *argv],
                            stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    return result.returncode, result.stdout.decode(errors="replace").strip()


def readiness():
    release = platform.freedesktop_os_release() if hasattr(platform, "freedesktop_os_release") else {}
    os_id = release.get("ID", "")
    el10 = (os_id in {"rhel", "almalinux", "rocky", "centos"} or "rhel" in release.get("ID_LIKE", "").split()) and release.get("VERSION_ID", "").split(".")[0] == "10"
    return {"platform": {"el10": el10, "name": release.get("PRETTY_NAME", os_id)[:100]}, "probeRevision": 3, "boot": Path("/proc/sys/kernel/random/boot_id").read_text().strip(),
             "ready": command("systemctl", "is-system-running")[1] in {"running", "degraded"}}


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
    try:
        group = grp.getgrnam("labops")
        if role == "client":
            user = pwd.getpwnam("labtech")
            passed = group.gr_gid in os.getgrouplist(user.pw_name, user.pw_gid)
        else:
            info = os.lstat("/srv/team")
            passed = stat.S_ISDIR(info.st_mode) and info.st_gid == group.gr_gid and stat.S_IMODE(info.st_mode) == 0o2770
    except (KeyError, FileNotFoundError, NotADirectoryError):
        passed = False
    state["operator" if role == "client" else "teamDirectory"] = passed
    return state


def configured_repo():
    import dnf
    if not Path("/srv/erudior-repo/repodata/repomd.xml").is_file():
        raise OSError("The local RPM repository fixture is missing.")
    with dnf.Base() as base:
        base.read_all_repos()
        repo = base.repos.get("erudior-local")
        return bool(repo and repo.enabled and repo.gpgcheck and
                    [url.rstrip("/") for url in repo.baseurl] == ["file:///srv/erudior-repo"] and
                    not repo.mirrorlist and not repo.metalink)


def script_result(attempt):
    script = "/usr/local/bin/lab-classify"
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
    for value in (9, 10, sample % 9, 11 + sample % 997):
        arg, expected = str(value), "small" if value < 10 else "large"
        with tempfile.TemporaryFile() as output:
            args = ["/usr/bin/timeout", "-k", "1", "3", "runuser", "-u", "nobody", "--", "prlimit",
                    "--fsize=4096", "--as=134217728", "--nproc=32", "--cpu=1", "--", script, arg]
            result = subprocess.run(args, stdin=subprocess.DEVNULL, stdout=output, stderr=subprocess.DEVNULL)
            output.seek(0)
            answer = output.read(4097).strip()
        if result.returncode or answer != expected.encode():
            return False
    return True


def extra_task(key, attempt):
    tools = {"client-script": ("runuser", "prlimit"), "server-tuning": ("tuned-adm",),
             "client-resolution": ("getent",), "server-selinux": ("getenforce",)}
    for name in tools.get(key, ()):
        if not shutil.which(name):
            raise OSError(f"Missing guest utility {name}")
    if key == "client-repo":
        return configured_repo()
    if key == "client-script":
        return script_result(attempt)
    if key == "server-tuning":
        code, result = command("tuned-adm", "active")
        return code == 0 and result.split(":")[-1].strip() == "throughput-performance"
    if key == "server-swap":
        return any(len(row) >= 3 and row[0] == "/var/lib/erudior.swap" and row[1] == "file"
                   and int(row[2]) >= 65532 for row in
                   (line.split() for line in Path("/proc/swaps").read_text().splitlines()[1:]))
    if key == "server-service":
        return (command("systemctl", "is-active", "--quiet", "erudior-maint.service")[0] == 0 and
                command("systemctl", "is-enabled", "erudior-maint.service") == (0, "enabled") and
                Path("/run/erudior-maint.ready").is_file())
    if key == "client-resolution":
        code, result = command("getent", "ahostsv4", "files.lab.test")
        return code == 0 and {row.split()[0] for row in result.splitlines() if row.split()} == {"192.168.77.10"}
    if key == "server-selinux":
        path = "/var/www/html/erudior-status.txt"
        code, label = command("stat", "-c", "%C", "--", path)
        return (os.path.isfile(path) and not os.path.islink(path) and code == 0 and
                label.split(":")[2:3] == ["httpd_sys_content_t"] and command("getenforce") == (0, "Enforcing"))
    raise ValueError("Unknown observation")


EXTRA = {"client-repo", "client-script", "server-tuning", "server-swap", "server-service",
         "client-resolution", "server-selinux"}


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
