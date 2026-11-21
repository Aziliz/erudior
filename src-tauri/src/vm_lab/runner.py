"""Run and grade built-in two-machine practice labs and timed practicals."""
import fcntl
import hashlib
import json
import os
import platform
from pathlib import Path
import re
import secrets
import shutil
import socket
import subprocess
import sys
import time
import uuid

# Tauri embeds both source files. The standalone runner reads its adjacent guest service.
GUEST_SOURCE = Path(__file__).with_name("guest_probe.py").read_text() if "__file__" in globals() else sys.argv.pop(1)

SCENARIO = "linux-nfs-autofs-v1"
ROLES = ("server", "client")
MACS = {"server": "52:54:00:aa:00:10", "client": "52:54:00:aa:00:20"}
# A second client interface with no peer, for static addressing tasks; a blank disk on the server.
SPARE_MACS = {"server": "52:54:00:aa:01:10", "client": "52:54:00:aa:01:20"}
DATA_DISK_MIB = 2048
ADDRESSES = {"server": "192.168.77.10", "client": "192.168.77.20"}
ACTIONS = {"status", "start", "stop", "reset", "check", "console-client", "console-server"}


class LabError(Exception):
    pass


def save(name, value):
    temp = Path(name + ".tmp")
    temp.write_text(json.dumps(value), encoding="utf-8")
    temp.replace(name)


def load(name):
    try:
        return json.loads(Path(name).read_text())
    except FileNotFoundError:
        return None


def tool(name):
    binary = shutil.which(name)
    if not binary:
        raise LabError(f"Install {name} on the Linux host to use this control.")
    return binary


def run(args):
    result = subprocess.run(args, capture_output=True, text=True, timeout=30)
    if result.returncode:
        raise LabError(f"{Path(args[0]).name}: {result.stderr.strip()[-450:]}")


def seed(role, attempt):
    folder = Path(role + "-seed")
    folder.mkdir(exist_ok=True)
    (folder / "meta-data").write_text(json.dumps({
        "instance-id": attempt["id"] + "-" + role, "local-hostname": role}))
    # NoCloud accepts JSON as YAML; a static interface works without DHCP or DNS.
    (folder / "network-config").write_text(json.dumps({"version": 2, "ethernets": {
        "lab": {"match": {"macaddress": MACS[role]}, "dhcp4": False,
                "addresses": [ADDRESSES[role] + "/24"]},
        # Declared so the spare link does not wait for DHCP; learners configure it.
        "spare": {"match": {"macaddress": SPARE_MACS[role]}, "dhcp4": False, "dhcp6": False, "optional": True}}}))
    config = {
        # Set the role name once; later hostname changes are the learner's (hostname tasks).
        "preserve_hostname": True,
        "users": [{"name": "learner", "shell": "/bin/bash", "lock_passwd": False,
                   "sudo": ["ALL=(ALL) NOPASSWD:ALL"]}],
        "chpasswd": {"expire": False, "users": [
            {"name": "learner", "type": "text", "password": attempt["password"]}]},
        "write_files": [
            {"path": "/usr/local/libexec/erudior-lab-probe.py", "content": GUEST_SOURCE},
            {"path": "/etc/erudior-lab/params.json", "permissions": "0600",
             "content": json.dumps(attempt_params(attempt))},
            {"path": "/etc/systemd/system/erudior-lab-probe.service", "content":
             "[Unit]\nDescription=Erudior practice checks\nAfter=local-fs.target\n"
             "[Service]\nType=simple\nRestart=always\nRestartSec=2\n"
             f"ExecStart=/usr/bin/python3 -I /usr/local/libexec/erudior-lab-probe.py {role} {attempt['id']}\n"
             "[Install]\nWantedBy=multi-user.target\n"}],
        "runcmd": [["hostnamectl", "set-hostname", role], ["systemctl", "daemon-reload"], ["systemctl", "enable", "erudior-lab-probe.service"],
                   ["systemctl", "restart", "erudior-lab-probe.service"]]}
    if role == "client":
        primary = '<metadata xmlns="http://linux.duke.edu/metadata/common" packages="0"/>'
        digest = hashlib.sha256(primary.encode()).hexdigest()
        repomd = ('<repomd xmlns="http://linux.duke.edu/metadata/repo"><revision>1</revision>'
                  f'<data type="primary"><checksum type="sha256">{digest}</checksum>'
                  '<location href="repodata/primary.xml"/><timestamp>1</timestamp></data></repomd>')
        config["write_files"].extend([
            {"path": "/srv/erudior-repo/repodata/primary.xml", "content": primary},
            {"path": "/srv/erudior-repo/repodata/repomd.xml", "content": repomd}])
    if role == "server":
        config["write_files"] += [
            {"path": "/srv/projects/erudior-lab.txt", "content": attempt["marker"] + "\n"},
            {"path": "/etc/systemd/system/erudior-maint.service", "content":
             "[Unit]\nDescription=Lab maintenance marker\n[Service]\nType=oneshot\n"
             "ExecStart=/usr/bin/touch /run/erudior-maint.ready\nRemainAfterExit=yes\n"
             "[Install]\nWantedBy=multi-user.target\n"},
            {"path": "/etc/exports.d/erudior.exports",
             "content": "/srv/projects 192.168.77.20(ro,sync,root_squash)\n"}]
        config["runcmd"] += [
            ["systemctl", "enable", "--now", "nfs-server.service"],
            ["exportfs", "-ra"],
            ["sh", "-c", "if systemctl is-active --quiet firewalld; then "
             "firewall-cmd --permanent --add-service=nfs && firewall-cmd --add-service=nfs; fi"]]
    (folder / "user-data").write_text("#cloud-config\n" + json.dumps(config))
    output = role + "-seed.iso"
    iso_tool = [tool("genisoimage")] if shutil.which("genisoimage") else [tool("xorriso"), "-as", "mkisofs"]
    run([*iso_tool, "-quiet", "-output", output + ".tmp", "-volid", "cidata",
         "-joliet", "-rock", *(str(folder / name) for name in ("user-data", "meta-data", "network-config"))])
    Path(output + ".tmp").replace(output)


def connect(role, channel, timeout=3):
    sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
    try:
        sock.settimeout(timeout)
        sock.connect(f"{role}.{channel}")
        return sock
    except BaseException:
        sock.close()
        raise


def reply(stream):
    while True:
        line = stream.readline(131072)
        if not line or len(line) >= 131072:
            raise LabError("Lost the virtual machine connection.")
        packet = json.loads(line.lstrip(b"\xff"))
        if "error" in packet:
            raise LabError(str(packet["error"].get("desc", "VM request failed"))[:300])
        if "return" in packet:
            return packet["return"]


def send(stream, command, arguments=None):
    payload = {"execute": command}
    if arguments is not None:
        payload["arguments"] = arguments
    stream.write(json.dumps(payload).encode() + b"\n")


def monitor(role, command):
    with connect(role, "qmp") as sock, sock.makefile("rwb", buffering=0) as stream:
        if "QMP" not in json.loads(stream.readline(32768)):
            raise LabError("Unexpected QEMU monitor.")
        send(stream, "qmp_capabilities")
        reply(stream)
        send(stream, command)
        return reply(stream)


def process_alive(role):
    pidfile = Path(role + ".pid")
    try:
        pid = int(pidfile.read_text())
        return (Path(f"/proc/{pid}/cwd").resolve(strict=True) == Path.cwd() and
                f"file={role}.qcow2,format=qcow2,if=virtio".encode() in
                Path(f"/proc/{pid}/cmdline").read_bytes().split(b"\0"))
    except (FileNotFoundError, ProcessLookupError, ValueError):
        return False


def running(role):
    if Path(role + ".qmp").exists():
        try:
            monitor(role, "query-status")
            return True
        except (FileNotFoundError, ConnectionRefusedError, ConnectionResetError):
            pass
    if process_alive(role):
        raise LabError(f"The {role} monitor is unavailable. Wait and refresh its status.")
    return False


def probe(role, verb, attempt_id):
    nonce = secrets.token_hex(16)
    deadline = time.monotonic() + 35
    with connect(role, "probe", 35) as sock:
        sock.sendall(f"{nonce} {verb}\n".encode())
        pending = b""
        while time.monotonic() < deadline:
            sock.settimeout(max(0.01, deadline - time.monotonic()))
            chunk = sock.recv(4096)
            if not chunk:
                break
            pending += chunk
            while b"\n" in pending:
                line, _, pending = pending.partition(b"\n")
                if len(line) > 4096:
                    raise LabError("Oversized guest response.")
                message = json.loads(line)
                if not isinstance(message, dict) or message.get("nonce") != nonce:
                    continue
                if message.get("attempt") != attempt_id or message.get("role") != role:
                    raise LabError("The guest reported a different lab attempt.")
                return message
            if len(pending) >= 4096:
                raise LabError("Oversized guest response.")
    raise LabError(f"The {role} lab service did not respond. Check its console and retry.")


def x86_kvm():
    if platform.machine().lower() not in {"x86_64", "amd64"}:
        return False
    try:
        with open("/dev/kvm", "rb+", buffering=0) as device:
            # KVM_CREATE_VM verifies that nested virtualization actually works in the provider.
            vm_fd = fcntl.ioctl(device, 0xAE01, 0)
            os.close(vm_fd)
            return True
    except OSError:
        return False


def launch(role, base, attempt):
    image = role + ".qcow2"
    if not Path(image).exists():
        run([tool("qemu-img"), "create", "-f", "qcow2", "-F", "qcow2", "-b", str(base), image + ".tmp"])
        Path(image + ".tmp").replace(image)
    fresh = not Path(role + "-seed.iso").exists()
    if fresh:
        seed(role, attempt)
        # New disk sets get the extra devices; earlier attempts keep their original hardware.
        Path(role + ".devices").write_text("2")
    data = role + "-data.qcow2"
    extra = Path(role + ".devices").exists()
    if extra and role == "server" and not Path(data).exists():
        run([tool("qemu-img"), "create", "-f", "qcow2", data + ".tmp", f"{DATA_DISK_MIB}M"])
        Path(data + ".tmp").replace(data)
    net = "stream,id=wire,addr.type=unix,addr.path=wire.sock,"
    net += "server=on" if role == "server" else "server=off,reconnect-ms=1000"
    kvm = x86_kvm()
    args = [tool("qemu-system-x86_64"), "-name", "Erudior-" + role,
            "-machine", "q35,accel=" + ("kvm" if kvm else "tcg"), "-cpu", "host" if kvm else "max",
            "-m", "1536", "-smp", "2", "-display", "none", "-nodefaults",
            "-pidfile", role + ".pid",
            "-drive", f"file={image},format=qcow2,if=virtio",
            "-drive", f"file={role}-seed.iso,format=raw,media=cdrom,readonly=on",
            "-netdev", net, "-device", f"virtio-net-pci,netdev=wire,mac={MACS[role]}",
            *(["-netdev", "hubport,id=spare,hubid=7", "-device", f"virtio-net-pci,netdev=spare,mac={SPARE_MACS[role]}"]
              if extra else []),
            *(["-drive", f"file={data},format=qcow2,if=none,id=data",
               "-device", "virtio-blk-pci,drive=data,serial=erudior-data"] if extra and role == "server" else []),
            "-serial", f"unix:{role}.serial,server=on,wait=off",
            "-qmp", f"unix:{role}.qmp,server=on,wait=off",
            "-device", "virtio-serial-pci",
            "-chardev", f"socket,id=probe,path={role}.probe,server=on,wait=off",
            "-device", "virtserialport,chardev=probe,name=com.erudior.lab.0"]
    with open(role + ".log", "w") as log:
        proc = subprocess.Popen(args, stdin=subprocess.DEVNULL, stdout=log, stderr=log,
                                start_new_session=True)
    deadline = time.monotonic() + 10
    while time.monotonic() < deadline and proc.poll() is None:
        if Path(role + ".qmp").exists():
            try:
                monitor(role, "query-status")
                return
            except (FileNotFoundError, ConnectionRefusedError):
                pass
        time.sleep(0.1)
    if proc.poll() is None:
        proc.terminate()
        proc.wait(timeout=5)
    raise LabError(f"Could not start {role}. " + Path(role + ".log").read_text()[-450:])


def wait_off(role):
    deadline = time.monotonic() + 60
    while time.monotonic() < deadline:
        if not process_alive(role) and not running(role):
            return
        time.sleep(0.3)
    raise LabError(f"{role} is still running. Shut it down in the console or reset this lab.")


def checks(observed, marker):
    if type(observed.get("automount")) is not bool or not isinstance(observed.get("remoteMarker"), str):
        raise LabError("The client returned an incomplete practice check.")
    return {"automount": observed["automount"], "remoteFile": observed["remoteMarker"] == marker}


EXAM = "linux-nfs-autofs-exam-v1"
ADMIN_EXAM = "linux-admin-exam-v1"
RHCSA_MOCK = "rhcsa-rhel10-practice-v1"
TASK_ROLES = {"client-operator": "client", "server-team-directory": "server", "client-nfs": "client"}


RHCSA_MOCK2 = "rhcsa-rhel10-practice-v2"
EXAMS = {EXAM, ADMIN_EXAM, RHCSA_MOCK, RHCSA_MOCK2}
SCENARIOS = {SCENARIO, *EXAMS}
# Tasks graded by the second guest-probe revision: they read per-attempt values and need new devices.
NEW_TASKS = ("server-lvm", "server-swap-part", "server-web-port", "client-ssh-key", "client-cron", "client-network")
EXTRA_TASKS = ("client-repo", "client-script", "server-tuning", "server-swap", "server-service",
               "client-resolution", "server-selinux", *NEW_TASKS)
TASK_ROLES.update({key: key.split("-")[0] for key in EXTRA_TASKS})
# The fixed first form keeps its original order and tasks for earlier receipts.
MOCK1_TASKS = ("client-operator", "server-team-directory", "client-nfs", "client-repo", "client-script",
               "server-tuning", "server-swap", "server-service", "client-resolution", "server-selinux")
# Guest capabilities each new task needs before the clock can start (reported by probe revision 4).
TASK_NEEDS = {"server-lvm": ("lvm", "xfs", "dataDisk"), "server-swap-part": ("dataDisk", "parted"),
              "server-web-port": ("httpd", "firewalld", "semanage"), "client-ssh-key": ("ssh",),
              "client-cron": ("cron",), "client-network": ("nmcli", "spareNic")}
NEED_NAMES = {"lvm": "LVM tools", "xfs": "xfsprogs", "dataDisk": "the server data disk (prepare fresh disks)",
              "parted": "parted", "httpd": "httpd", "firewalld": "firewalld", "semanage": "policycoreutils-python-utils",
              "ssh": "openssh-clients", "cron": "cronie", "nmcli": "NetworkManager",
              "spareNic": "the client's second network interface (prepare fresh disks)"}

# Values used by fixed lessons. The randomized mock draws its own per attempt.
DEFAULT_PARAMS = {
    "teamDir": "/srv/team", "teamGroup": "labops", "opUser": "labtech", "opGroup": "labops",
    "repoId": "erudior-local", "scriptPath": "/usr/local/bin/lab-classify", "threshold": "10",
    "tunedProfile": "throughput-performance", "swapFile": "/var/lib/erudior.swap", "swapMiB": "64",
    "hostAlias": "files.lab.test", "webFile": "/var/www/html/erudior-status.txt",
    "vgName": "labvg", "lvName": "labdata", "lvMiB": "400", "lvMount": "/srv/labdata", "swapDevMiB": "256",
    "webPort": "18080", "sshUser": "labssh", "cronMinute": "15", "cronHour": "2", "cronTag": "erudior-nightly",
    "spareAddress": "10.88.10.20", "spareGateway": "10.88.10.1", "spareDns": "10.88.10.53",
    "clientHostname": "client01.lab.test"}
# One task per published objective area. Pools give the randomized mock different forms.
AREA_POOLS = (
    ("Essential tools", ("server-team-directory",)),
    ("Software management", ("client-repo",)),
    ("Shell scripts", ("client-script",)),
    ("Running systems", ("server-tuning",)),
    ("Local storage", ("server-lvm", "server-swap-part", "server-swap")),
    ("File systems", ("client-nfs",)),
    ("Deployment and maintenance", ("server-service", "client-cron")),
    ("Basic networking", ("client-network", "client-resolution")),
    ("Users and groups", ("client-operator",)),
    ("Security", ("server-web-port", "client-ssh-key", "server-selinux")),
)
WORDS = ("amber", "birch", "cedar", "delta", "ember", "fjord", "gale", "heron", "iris", "juniper", "kelp",
         "lumen", "maple", "nova", "onyx", "pine", "quill", "raven", "sage", "tern", "umber", "vale", "willow", "yarrow")
PEOPLE = ("ana", "bo", "chen", "dara", "eli", "fern", "gus", "hana", "ivo", "jai", "kim", "lena", "mo", "nia",
          "omar", "pia", "ravi", "sora", "tara", "uma", "vik", "wen", "yuki", "zane")


def draw_params(rng=None):
    rng = rng or secrets.SystemRandom()
    used = set()
    def word(pool=WORDS):
        while True:
            value = rng.choice(pool)
            if value not in used:
                used.add(value)
                return value
    def name(pool):
        return word(pool) + str(rng.randint(10, 99))
    net = rng.randint(10, 250)
    group = name(WORDS)
    p = {
        "teamDir": "/srv/" + word() + "-team", "teamGroup": group, "opUser": name(PEOPLE), "opGroup": name(WORDS),
        "repoId": "lab-" + word(), "scriptPath": "/usr/local/bin/" + word() + "-classify",
        "threshold": str(rng.randint(5, 60)),
        "tunedProfile": rng.choice(("throughput-performance", "latency-performance", "network-throughput", "balanced")),
        "swapFile": "/var/lib/" + word() + ".swap", "swapMiB": str(rng.choice((64, 96, 128))),
        "hostAlias": word() + ".lab.test", "webFile": "/var/www/html/" + word() + "-status.txt",
        "vgName": word() + "vg", "lvName": word(), "lvMiB": str(rng.choice((300, 400, 500, 600, 700))),
        "lvMount": "/srv/" + word() + "-data", "swapDevMiB": str(rng.choice((128, 256, 384))),
        "webPort": str(rng.randint(18000, 18999)), "sshUser": name(PEOPLE),
        "cronMinute": str(rng.randint(0, 59)), "cronHour": str(rng.randint(0, 23)),
        "cronTag": "erudior-" + secrets.token_hex(2),
        "spareAddress": f"10.88.{net}.{rng.randint(10, 200)}", "spareGateway": f"10.88.{net}.1",
        "spareDns": f"10.88.{net}.53", "clientHostname": name(WORDS) + ".lab.test"}
    return p


def draw_form(rng=None):
    rng = rng or secrets.SystemRandom()
    return [{"id": rng.choice(pool), "points": 30} for _, pool in AREA_POOLS]


def attempt_params(attempt):
    return dict(DEFAULT_PARAMS, **attempt.get("params", {}))


def rubric(value):
    if not isinstance(value, list) or not 1 <= len(value) <= len(TASK_ROLES):
        raise LabError("Select between one and ten practical tasks.")
    seen = set()
    for task in value:
        if not isinstance(task, dict) or task.keys() != {"id", "points"}:
            raise LabError("Each practical task needs an ID and points.")
        key, weight = task["id"], task["points"]
        if not isinstance(key, str) or key not in TASK_ROLES or key in seen:
            raise LabError("Select distinct built-in practical tasks.")
        if type(weight) is not int or not 1 <= weight <= 100:
            raise LabError("Each practical task needs 1 to 100 whole points.")
        seen.add(key)
    return value


def observation_verb(tasks):
    if tasks is None:
        return "observe"
    return "tasks-nfs" if any(t["id"] == "client-nfs" for t in tasks) else "tasks"


def task_pass(key, data, marker, attempt_id):
    if key in EXTRA_TASKS:
        result = probe(TASK_ROLES[key], "extra:" + key, attempt_id).get("passed")
        if type(result) is not bool:
            raise LabError(f"The guest could not check {key}. Verify the image tools and retry grading.")
        return result
    if key == "client-nfs":
        return all(checks(data, marker).values())
    field = "operator" if key == "client-operator" else "teamDirectory"
    result = data.get(field)
    if type(result) is not bool:
        raise LabError("Incomplete guest task observation. Retry when the guest service is ready.")
    return result


def needs_revision4(attempt, tasks):
    return "params" in attempt or any(t["id"] in NEW_TASKS for t in tasks or ())


def capture(attempt, tasks=None, *, preflight=False, persistent=False, mock_profile=False):
    verb = observation_verb(tasks)
    roles = set(ROLES) if tasks is None or preflight else {TASK_ROLES[t["id"]] for t in tasks}
    if verb == "tasks-nfs":
        roles.add("server")
    guests = {r: probe(r, verb, attempt["id"]) for r in ROLES if r in roles}
    if any(guest.get("ready") is not True for guest in guests.values()):
        raise LabError("The machines are still preparing. Wait for guest startup and retry.")
    platforms = {}
    if mock_profile:
        for role, guest in guests.items():
            release = guest.get("platform", {})
            if release.get("el10") is not True or not isinstance(release.get("name"), str) or not release["name"]:
                raise LabError(f"Prepare the {role} with RHEL 10 or a compatible Enterprise Linux 10 image before starting this mock.")
            platforms[role] = release["name"][:100]
    if verb in {"observe", "tasks-nfs"}:
        server = guests["server"]
        if not server.get("exportActive") or server.get("marker") != attempt["marker"]:
            raise LabError("The NFS server or its fixture file is unavailable.")
        if preflight and not guests["client"].get("clientToolsReady"):
            raise LabError("The client image needs autofs and nfs-utils before the clock can start.")
    if preflight:
        missing = sorted({NEED_NAMES[need] for t in tasks or () for need in TASK_NEEDS.get(t["id"], ())
                          if guests[TASK_ROLES[t["id"]]].get("capabilities", {}).get(need) is not True})
        if missing:
            raise LabError("The guest image is missing " + ", ".join(missing) + ". See the course's image requirements.")
    client = guests.get("client")
    roles_to_reboot = {TASK_ROLES[t["id"]] for t in tasks} if persistent else {"client"} & roles
    boots = {}
    for role in roles_to_reboot:
        guest = guests[role]
        boot = guest.get("boot")
        if not isinstance(boot, str) or not re.fullmatch(r"[0-9a-f-]{36}", boot):
            raise LabError(f"The {role} did not report a boot identity.")
        revisions = (4,) if needs_revision4(attempt, tasks) else (3, 4) if persistent else (2, 3, 4)
        if guest.get("probeRevision") not in revisions:
            raise LabError(f"Update the {role} guest probe or prepare fresh disks before starting this practical.")
        boots[role] = boot
    before = checks(client, attempt["marker"]) if tasks is None else {
        t["id"]: task_pass(t["id"], guests[TASK_ROLES[t["id"]]], attempt["marker"], attempt["id"]) for t in tasks}
    return {"boots": boots, "before": before, **({"platforms": platforms} if platforms else {})}


def observe_after_reboot(role, verb, attempt_id, previous_boot, fresh):
    if fresh or probe(role, verb, attempt_id).get("boot") == previous_boot:
        if probe(role, "reboot", attempt_id).get("reboot") is not True:
            raise LabError(f"The {role} did not accept the reboot request.")
    seconds = 240 if x86_kvm() else 480
    deadline = time.monotonic() + seconds
    while time.monotonic() < deadline:
        time.sleep(2)
        try:
            data = probe(role, verb, attempt_id)
        except (LabError, OSError, ValueError):
            continue
        boot = data.get("boot")
        if data.get("ready") is True and isinstance(boot, str) and re.fullmatch(r"[0-9a-f-]{36}", boot) and boot != previous_boot:
            return data
    raise LabError(f"The {role} did not finish a new boot. Retry grading.")


def grade(attempt, timed=False):
    exam = attempt.get("exam", {})
    tasks = exam.get("rubric")
    persistent = exam.get("gradingVersion") == 2
    verb = observation_verb(tasks)
    attempt_id = attempt["id"]
    first = exam.get("capture")
    fresh = first is None
    if fresh:
        first = capture(attempt, tasks, persistent=persistent)
        if timed:
            exam["capture"] = first
            save("attempt.json", attempt)
    # Old submissions recorded the client boot ID under a single key.
    boots = first.get("boots", {"client": first.get("boot")})
    after = exam.setdefault("afterReboot", {})
    for role in ROLES:  # Restore the NFS server before measuring any client mount.
        selected = [t for t in (tasks or []) if TASK_ROLES[t["id"]] == role]
        if not boots.get(role) or role in after or (tasks is not None and not selected):
            continue
        data = observe_after_reboot(role, verb, attempt_id, boots[role], fresh)
        if role == "server" and verb == "tasks-nfs" and (
                not data.get("exportActive") or data.get("marker") != attempt["marker"]):
            raise LabError("The NFS fixture did not recover on the server. Retry grading.")
        after[role] = checks(data, attempt["marker"]) if tasks is None else {
            t["id"]: task_pass(t["id"], data, attempt["marker"], attempt_id) for t in selected}
        if timed:
            save("attempt.json", attempt)
    report = {"attempt": attempt_id, "checkedAt": time.time_ns() // 1_000_000}
    if tasks is None:
        return dict(report, before=first["before"], after=after["client"])
    rows = []
    for task in tasks:
        key = task["id"]
        row = dict(task, before=first["before"][key])
        if persistent or TASK_ROLES[key] in after:
            row["after"] = after[TASK_ROLES[key]][key]
        rows.append(row)
    if persistent:
        report["gradingVersion"] = 2
    if "params" in exam:
        report["params"] = exam["params"]
    return dict(report, tasks=rows)


def boot_id():
    return Path("/proc/sys/kernel/random/boot_id").read_text().strip()


def ticks():
    return time.clock_gettime_ns(time.CLOCK_BOOTTIME) // 1_000_000


def remaining(exam):
    return max(0, exam["endTick"] - ticks()) if exam["hostBoot"] == boot_id() else 0


def child_command(*args):
    source = Path(__file__).read_text() if "__file__" in globals() else runner_source
    return [sys.executable, "-I", "-c", "import sys;runner_source=sys.argv.pop(1);exec(runner_source)",
            source, GUEST_SOURCE, *args]


def lease_path(attempt_id, generation):
    return Path(f"exam-worker-{attempt_id}-{generation}.lock")


def ensure_worker(attempt_id, generation=0):
    with lease_path(attempt_id, generation).open("a") as lease:
        try:
            fcntl.flock(lease, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            return
        subprocess.Popen(child_command("_watch", attempt_id, str(generation)), pass_fds=(lease.fileno(),),
                         start_new_session=True, stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def seal(attempt):
    exam = attempt["exam"]
    with open("exam-input.lock", "a") as gate:
        fcntl.flock(gate, fcntl.LOCK_EX)
        left = remaining(exam)
        exam.update(phase="submitted", reason="submitted" if left else "expired", submittedAt=exam["deadlineAt"]-left)
        save("attempt.json", attempt)


def advance(attempt):
    exam = (attempt or {}).get("exam", {})
    if exam.get("phase") not in {"active", "submitted", "error"}:
        return
    if exam["hostBoot"] != boot_id():
        report = load("report.json") or {}
        if report.get("attempt") == attempt["id"] and report.get("exam"):
            exam["phase"] = "complete"
            exam.pop("error", None)
        else:
            exam.update(phase="interrupted", error="The host restarted and lost the running guests. Start a new attempt.")
        save("attempt.json", attempt)
    elif exam["phase"] == "active" and not remaining(exam):
        seal(attempt)


def watch(attempt_id, generation):
    while True:
        with open("lock", "a") as lock:
            fcntl.flock(lock, fcntl.LOCK_EX)
            attempt = load("attempt.json")
            exam = (attempt or {}).get("exam", {})
            if not exam or attempt["id"] != attempt_id or exam.get("retryNumber", 0) != generation:
                return
            advance(attempt)
            if exam["phase"] == "submitted":
                try:
                    report = load("report.json") or {}
                    if report.get("attempt") != attempt_id:
                        report = grade(attempt, timed=True)
                        report["exam"] = {k: exam[k] for k in ("startedAt", "deadlineAt", "submittedAt", "reason")}
                        report["checkedAt"] = max(report["checkedAt"], exam["submittedAt"])
                        save("report.json", report)
                    exam["phase"] = "complete"
                except (OSError, ValueError, LabError, subprocess.SubprocessError) as err:
                    exam.update(phase="error", error=str(err)[:450] or "Grading interrupted. Retry grading.")
                save("attempt.json", attempt)
            if exam["phase"] != "active":
                return
            delay = min(1, remaining(exam) / 1000)
        time.sleep(delay)


def input_open(attempt_id):
    attempt = load("attempt.json") or {}
    exam = attempt.get("exam", {})
    return attempt.get("id") == attempt_id and exam.get("phase") == "active" and remaining(exam) > 0


def relay_serial(role, allowed, gate_name):
    import select
    keyboard = sys.stdin.fileno()
    with connect(role, "serial", 1) as guest, open(gate_name, "a") as gate:
        while allowed():
            ready, _, _ = select.select([keyboard, guest], [], [], .25)
            if guest in ready:
                data = guest.recv(4096)
                if not data:
                    break
                sys.stdout.buffer.write(data)
                sys.stdout.buffer.flush()
            if keyboard in ready:
                data = os.read(keyboard, 4096)
                if not data:
                    break
                try:
                    fcntl.flock(gate, fcntl.LOCK_SH | fcntl.LOCK_NB)
                except BlockingIOError:
                    break
                try:
                    if allowed():
                        guest.sendall(data)
                finally:
                    fcntl.flock(gate, fcntl.LOCK_UN)


def timed_console(role, attempt_id):
    import termios
    import tty
    if role not in ROLES or not input_open(attempt_id):
        return
    keyboard = sys.stdin.fileno()
    original = termios.tcgetattr(keyboard)
    try:
        tty.setraw(keyboard)
        relay_serial(role, lambda: input_open(attempt_id), "exam-input.lock")
    finally:
        termios.tcsetattr(keyboard, termios.TCSADRAIN, original)


def lab_root():
    data = Path(os.environ.get("XDG_DATA_HOME") or Path.home() / ".local/share")
    return data.resolve() / "erudior-vm-labs"


def lab_folder(scenario, profile, course, lesson):
    if scenario not in SCENARIOS:
        raise LabError("Unknown lab scenario.")
    if not all(re.fullmatch(r"[A-Za-z0-9_-]{1,100}", key) for key in (profile, course, lesson)):
        raise LabError("Invalid lab owner or lesson.")
    scope = hashlib.sha256(json.dumps([profile, course, lesson, scenario]).encode()).hexdigest()
    return lab_root() / "attempts" / scope


def stream_console(role, scenario, profile, course, lesson, attempt_id):
    if role not in ROLES or not re.fullmatch(r"[a-f0-9-]{36}", attempt_id):
        raise LabError("Invalid guest console.")
    os.chdir(lab_folder(scenario, profile, course, lesson))
    def allowed():
        if scenario == SCENARIO:
            return (load("attempt.json") or {}).get("id") == attempt_id and not Path("reset-pending").exists()
        return input_open(attempt_id)
    if not allowed() or not running(role):
        raise LabError("This console is closed. Refresh the lesson before reconnecting.")
    # Also prevent two app windows competing for a single QEMU serial connection.
    with open(role + ".console.lock", "a") as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            raise LabError("Close the other console for this guest first.") from None
        relay_serial(role, allowed, "lock" if scenario == SCENARIO else "exam-input.lock")


def hold_wsl():
    # A foreground wsl.exe invocation keeps background QEMU and deadline workers alive.
    root = lab_root()
    if not root.is_dir():
        return
    with (root / "wsl-keepalive.lock").open("a") as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            return
        while True:
            live = False
            for folder in (root / "attempts").glob("*"):
                if folder.is_dir():
                    os.chdir(folder)
                    if any(process_alive(role) for role in ROLES):
                        live = True
                        break
            if not live:
                return
            time.sleep(5)


def exam_status():
    state = operate("status", None)
    a = load("attempt.json") or {}
    exam = a.get("exam", {})
    phase = exam.get("phase", "prepared" if a else "new")
    visible = {k: exam[k] for k in ("startedAt", "deadlineAt", "submittedAt", "reason", "error", "rubric", "gradingVersion", "platforms", "params") if k in exam}
    left = remaining(exam) if phase == "active" else 0
    state["exam"] = dict(visible, id=a.get("id"), phase=phase, remainingMs=left)
    state["password"] = a.get("password") if left else None
    if phase != "complete" or (state["report"] or {}).get("attempt") != a.get("id"):
        state["report"] = None
    return state


def exam_action(action, base, minutes, expected, tasks, *, mock_profile=False, randomized=False):
    attempt = load("attempt.json")
    if randomized and action == "start" and not attempt:
        # Draw the form before the disks exist so each guest's seed carries its values.
        attempt = {"id": str(uuid.uuid4()), "password": secrets.token_urlsafe(10), "marker": secrets.token_hex(16),
                   "form": draw_form(), "params": draw_params()}
        save("attempt.json", attempt)
    if randomized:
        tasks = (attempt or {}).get("form")
    advance(attempt)
    exam = (attempt or {}).get("exam", {})
    phase = exam.get("phase", "prepared" if attempt else "new")
    if action not in {"start", "status"} and (not attempt or expected != attempt["id"]):
        raise LabError("The attempt changed. Refresh its status.")
    if action == "start" and phase in {"new", "prepared"}:
        operate("start", base)
    elif action == "begin" and phase == "prepared":
        prepared = capture(attempt, tasks, preflight=True, persistent=bool(tasks), mock_profile=mock_profile)
        started = time.time_ns() // 1_000_000
        exam = dict(phase="active", hostBoot=boot_id(), startedAt=started, deadlineAt=started+60000*minutes,
                    endTick=ticks()+60000*minutes)
        if tasks:
            exam["rubric"] = tasks
            exam["gradingVersion"] = 2
        if mock_profile:
            exam["platforms"] = prepared["platforms"]
        if "params" in attempt:
            exam["params"] = attempt["params"]
        attempt["exam"] = exam
        ensure_worker(expected)
        save("attempt.json", attempt)
        return exam_status()
    elif action == "submit" and phase == "active":
        seal(attempt)
    elif action == "retry" and phase == "error":
        generation = exam.get("retryNumber", 0)
        ensure_worker(expected, generation + 1)
        exam.update(phase="submitted", retryNumber=generation+1)
        exam.pop("error", None)
        save("attempt.json", attempt)
        lease_path(expected, generation).unlink(missing_ok=True)
        return exam_status()
    elif action.startswith("console-") and phase == "active" and input_open(expected):
        if not os.environ.get("DISPLAY"):
            raise LabError("Open the console from a graphical Linux desktop.")
        role = action.removeprefix("console-")
        subprocess.Popen([tool("xterm"), "-T", "Erudior exam " + role, "-e", *child_command("_console", role, expected)],
                         start_new_session=True, stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    elif action == "stop" and phase in {"prepared", "complete"}:
        operate("stop", base)
    elif action == "reset" and phase in {"prepared", "complete", "error", "interrupted"}:
        operate("reset", base)
    elif action == "status" or (action == "begin" and phase == "active") or (action == "submit" and phase in {"submitted", "complete", "error"}):
        pass
    else:
        raise LabError("This action is unavailable at this stage of the exam.")
    if exam.get("phase") in {"active", "submitted"}:
        ensure_worker(attempt["id"], exam.get("retryNumber", 0))
    return exam_status()


def operate(action, base):
    attempt = load("attempt.json")
    if Path("reset-pending").exists() and action not in {"reset", "status"}:
        raise LabError("A disk reset was interrupted. Choose Reset disks to finish.")
    if action == "start":
        if not base.is_file():
            raise LabError(f"Set up the lab base image at {base}.")
        if not attempt:
            attempt = {"id": str(uuid.uuid4()), "password": secrets.token_urlsafe(10),
                       "marker": secrets.token_hex(16)}
            save("attempt.json", attempt)
        for role in ROLES:
            if not running(role):
                launch(role, base, attempt)
    elif action in {"stop", "reset"}:
        for role in reversed(ROLES):
            if running(role):
                monitor(role, "quit" if action == "reset" else "system_powerdown")
                wait_off(role)
        if action == "reset":
            Path("reset-pending").touch()
            for role in ROLES:
                for suffix in (".qcow2", ".qcow2.tmp", "-seed.iso", "-seed.iso.tmp", ".log",
                               "-data.qcow2", "-data.qcow2.tmp", ".devices"):
                    Path(role + suffix).unlink(missing_ok=True)
                if Path(role + "-seed").exists():
                    shutil.rmtree(role + "-seed")
            if attempt and "exam" in attempt:
                lease_path(attempt["id"], attempt["exam"].get("retryNumber", 0)).unlink(missing_ok=True)
            Path("report.json").unlink(missing_ok=True)
            Path("attempt.json").unlink(missing_ok=True)
            Path("reset-pending").unlink()
            attempt = None
    elif action == "check":
        if not attempt or not all(running(role) for role in ROLES):
            raise LabError("Start both machines before checking your work.")
        save("report.json", grade(attempt))
    elif action.startswith("console-"):
        role = action.removeprefix("console-")
        if not running(role):
            raise LabError(f"Start {role} first.")
        if not os.environ.get("DISPLAY"):
            raise LabError("The serial console needs a graphical desktop with xterm.")
        subprocess.Popen([tool("xterm"), "-T", "Erudior " + role, "-e", tool("socat"),
                          "STDIO,rawer", f"UNIX-CONNECT:{role}.serial"],
                         stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
                         start_new_session=True)
    return {"running": {role: running(role) for role in ROLES},
            "password": attempt["password"] if attempt else None, "report": load("report.json"),
            "attemptId": attempt["id"] if attempt else None,
            "resetPending": Path("reset-pending").exists()}


def main(args):
    action, scenario, profile, course, lesson, *options = args
    timed = scenario in EXAMS
    if len(options) > 3:
        raise LabError("Invalid exam options.")
    minutes = int(options[0]) if options else 20
    expected = options[1] if len(options) > 1 else None
    tasks = json.loads(options[2]) if len(options) > 2 else None
    if scenario == RHCSA_MOCK:
        fixed = [{"id": key, "points": 30} for key in MOCK1_TASKS]
        if tasks is not None and rubric(tasks) != fixed:
            raise LabError("This practice exam uses a fixed objective rubric.")
        if options and minutes != 180:
            raise LabError("The RHCSA practice exam uses a 180-minute time limit.")
        tasks, minutes = fixed, 180
    elif scenario == RHCSA_MOCK2:
        if tasks is not None:
            raise LabError("This practice exam draws its own tasks.")
        if options and minutes != 180:
            raise LabError("The RHCSA practice exam uses a 180-minute time limit.")
        minutes = 180
    elif scenario == ADMIN_EXAM:
        rubric(tasks)
    elif tasks is not None:
        raise LabError("Only multi-task exams accept a rubric.")
    if not 1 <= minutes <= 240:
        raise LabError("Exam duration must be between 1 and 240 minutes.")
    permitted = ACTIONS | {"begin", "submit", "retry"} if timed else ACTIONS
    if action not in permitted or scenario not in SCENARIOS:
        raise LabError("Unknown lab action or scenario.")
    os.umask(0o077)
    root = lab_root()
    folder = lab_folder(scenario, profile, course, lesson)
    if action == "status" and not folder.exists():
        return {"running": dict.fromkeys(ROLES, False), "password": None, "report": None,
                **({"exam": {"id": None, "phase": "new"}} if timed else {})}
    folder.mkdir(mode=0o700, parents=True, exist_ok=True)
    os.chdir(folder)
    with open("lock", "a") as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            if timed and action == "status":
                return exam_status()
            raise LabError("Another operation is running for this lab. Try again shortly.") from None
        base = root / "images" / (SCENARIO + ".qcow2")
        mock = scenario in {RHCSA_MOCK, RHCSA_MOCK2}
        return (exam_action(action, base, minutes, expected, tasks, mock_profile=mock, randomized=scenario == RHCSA_MOCK2)
                if timed else operate(action, base))


if __name__ == "__main__":
    try:
        if sys.argv[1] == "_watch":
            watch(sys.argv[2], int(sys.argv[3]))
        elif sys.argv[1] == "_stream":
            stream_console(*sys.argv[2:])
        elif sys.argv[1] == "_hold_wsl":
            hold_wsl()
        elif sys.argv[1] == "_console":
            timed_console(*sys.argv[2:])
        else:
            print(json.dumps(main(sys.argv[1:])))
    except (LabError, OSError, ValueError, subprocess.SubprocessError) as error:
        print(str(error)[:700], file=sys.stderr)
        sys.exit(1)
