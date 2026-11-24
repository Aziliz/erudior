"""Prepare one standalone AlmaLinux base from the course DVD and practice kit."""
import contextlib
import fcntl
import hashlib
import io
import os
from pathlib import Path
import secrets
import shutil
import subprocess
import tempfile
import urllib.error
import urllib.request
import zipfile

DVD_NAME = "AlmaLinux-10.3-x86_64-dvd.iso"
KIT_NAME = "Erudior-AlmaLinux-10.3-Practice-Kit.zip"
DVD_LABEL = "AlmaLinux-10-3-x86_64-dvd"
MEDIA = {
    "dvd": (DVD_NAME, 10824908800, "f74ae9c4a8e7e3e70147534856ea276f71649d16c70b7d3ec80d0905a7b93982",
            "https://repo.almalinux.org/almalinux/10.3/isos/x86_64/" + DVD_NAME),
    "kit": (KIT_NAME, 24703, "c4deab820476856c13cc84385ace00fb46a532eb8ea1749dbe306748321dcd64",
            "https://app.erudior.com/downloads/" + KIT_NAME),
}


@contextlib.contextmanager
def alma_lock(images):
    images.mkdir(mode=0o700, parents=True, exist_ok=True)
    with (images / "alma-setup.lock").open("a") as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            raise ValueError("AlmaLinux setup is already running. Wait for it to finish and retry.") from None
        yield


def lima_guest_clock(kvm):
    # Nested TCG can lose PIT/HPET calibration when macOS deschedules Lima.
    # The guest clocks follow emulated instructions. Exam deadlines use the provider clock.
    if not kvm and os.environ.get("ERUDIOR_VM_PROVIDER") == "lima":
        return ["-icount", "shift=3,sleep=on", "-rtc", "clock=vm"]
    return []


def alma_progress(images, message):
    temp = images / ".alma-progress.tmp"
    temp.write_text(message)
    temp.replace(images / "alma-progress")


def media_status(images):
    p = images / "alma-progress"
    return {"message": p.read_text() if p.is_file() else "",
            "dvd": (images / DVD_NAME).is_file(), "kit": (images / KIT_NAME).is_file()}


def cache_medium(images, kind, source):
    name, size, digest, _ = MEDIA[kind]
    final = images / name
    # One writer under alma_lock. Interrupted transfers cannot replace known-good media.
    temp = images / (name + ".partial")
    try:
        check = hashlib.sha256()
        total = 0
        last = -1
        with temp.open("wb") as out:
            while True:
                data = source.read(4 * 1024 * 1024)
                if not data:
                    break
                total += len(data)
                if total > size:
                    raise ValueError(f"{name} is larger than the official file.")
                check.update(data)
                out.write(data)
                percent = int(100 * total / size)
                if percent != last:
                    alma_progress(images, f"Verifying {name} · {percent}%")
                    last = percent
        if total != size or check.hexdigest() != digest:
            raise ValueError(f"{name} failed verification. Select the official file or retry the download.")
        temp.chmod(0o400)
        temp.replace(final)
    finally:
        temp.unlink(missing_ok=True)
    return final


def acquire_medium(images, kind):
    name, size, digest, url = MEDIA[kind]
    path = images / name
    if path.exists():
        if path.stat().st_size == size:
            with path.open("rb") as cached:
                check = hashlib.sha256()
                for block in iter(lambda: cached.read(4 * 1024 * 1024), b""):
                    check.update(block)
                if check.hexdigest() == digest:
                    return path
        raise ValueError(f"The cached {name} failed verification. Choose a replacement in First-time setup.")
    if kind == "kit" and globals().get("bundled_practice_kit"):
        return cache_medium(images, kind, io.BytesIO(bundled_practice_kit))
    # The website and the immutable repository copy contain identical verified kit bytes.
    sources = [url]
    if kind == "kit":
        sources.append("https://raw.githubusercontent.com/Aziliz/erudior/"
                       "12667a29d28b07b9f484d8e3e99ea8b6e112356f/public/downloads/" + KIT_NAME)
    for source in sources:
        alma_progress(images, f"Downloading {name}")
        request = urllib.request.Request(source, headers={"User-Agent": "Erudior-Desktop-Labs/1"})
        try:
            with urllib.request.urlopen(request, timeout=90) as stream:
                return cache_medium(images, kind, stream)
        except (urllib.error.URLError, TimeoutError) as error:
            if source == sources[-1]:
                raise ValueError(f"Could not download {name}. Choose a local copy or retry. {error}") from error


def install_kickstart(token):
    # Install only on the blank system disk. The kit runs after reboot, when enforcing
    # SELinux and systemd are live. A dedicated serial port acknowledges full success.
    return """text --non-interactive
cdrom
lang en_US.UTF-8
keyboard us
timezone Etc/UTC --utc
rootpw --lock
firstboot --disable
services --disabled=kdump
selinux --enforcing
firewall --enabled --service=ssh
ignoredisk --only-use=vda
zerombr
clearpart --all --initlabel --drives=vda
autopart --type=lvm
bootloader --location=mbr --append="console=tty0 console=ttyS0,115200n8"
poweroff
%packages
@core
cloud-init
%end
%post --erroronfail
touch /etc/cloud/cloud-init.disabled
cat > /etc/systemd/system/erudior-prepare.service <<'UNIT'
[Unit]
Description=Prepare Erudior AlmaLinux template
After=local-fs.target systemd-udev-trigger.service
[Service]
Type=oneshot
ExecStart=/usr/local/sbin/erudior-prepare
StandardOutput=journal+console
StandardError=journal+console
TimeoutStartSec=infinity
[Install]
WantedBy=multi-user.target
UNIT
cat > /usr/local/sbin/erudior-prepare <<'SCRIPT'
#!/bin/bash
set -euo pipefail
trap 'echo FAILED > /dev/ttyS1; systemctl --no-block poweroff' ERR
udevadm settle
mkdir -p /mnt/erudior-tools
mount -o ro /dev/disk/by-label/ERUDIORLAB /mnt/erudior-tools
bash /mnt/erudior-tools/prepare-guest.sh desktop-template
# Start each clone with its own cloud-init, SSH host keys and machine identity.
systemctl disable erudior-prepare.service
rm -f /etc/systemd/system/erudior-prepare.service /usr/local/sbin/erudior-prepare
rm -f /etc/cloud/cloud-init.disabled /etc/ssh/ssh_host_* /root/anaconda-ks.cfg /root/original-ks.cfg
cloud-init clean --logs --machine-id
sync
echo TOKEN > /dev/ttyS1
systemctl --no-block poweroff
SCRIPT
chmod 0700 /usr/local/sbin/erudior-prepare
restorecon /usr/local/sbin/erudior-prepare /etc/systemd/system/erudior-prepare.service
systemctl enable erudior-prepare.service
echo INSTALL-TOKEN > /dev/ttyS1
%end
""".replace("TOKEN", token)


def provision_disk(images, dvd, kit, destination, kvm):
    iso_writer = shutil.which("genisoimage")
    extractor = shutil.which("xorriso")
    if not extractor and not shutil.which("isoinfo"):
        raise ValueError("Install xorriso or genisoimage (including isoinfo) in the Linux provider.")
    writer = [iso_writer] if iso_writer else ["xorriso", "-as", "mkisofs"]
    setup_disc = images / "Erudior-setup.iso"
    with tempfile.TemporaryDirectory(dir=images, prefix=".alma-install-") as folder:
        work = Path(folder)

        def execute(args, **options):
            result = subprocess.run(args, cwd=work, stderr=subprocess.PIPE, timeout=options.pop("timeout", 120),
                                    stdout=options.pop("stdout", subprocess.DEVNULL), **options)
            if result.returncode:
                raise ValueError(f"{Path(args[0]).name} exited with status {result.returncode}. "
                                 f"{result.stderr.decode(errors='replace')[-420:]}")

        with zipfile.ZipFile(kit) as archive:
            (work / "setup.iso").write_bytes(archive.read("Erudior-setup.iso"))
        for name in ("vmlinuz", "initrd.img"):
            if extractor:
                execute([extractor, "-osirrox", "on", "-indev", str(dvd), "-extract",
                         "/images/pxeboot/" + name, name])
            else:
                with (work / name).open("wb") as output:
                    execute(["isoinfo", "-R", "-i", str(dvd), "-x", "/images/pxeboot/" + name], stdout=output)
            if (work / name).stat().st_size == 0:
                raise ValueError(f"The installer DVD is missing {name}.")
        token = secrets.token_hex(24)
        (work / "ks.cfg").write_text(install_kickstart(token))
        execute([*writer, "-quiet", "-V", "OEMDRV", "-J", "-R", "-o", "config.iso", "ks.cfg"])
        execute(["qemu-img", "create", "-q", "-f", "qcow2", "base.qcow2", "30G"])
        # All drive arguments below are fixed, relative names (paths may contain commas).
        (work / "dvd.iso").symlink_to(dvd)
        qemu = ["qemu-system-x86_64", "-machine", "q35,accel=" + ("kvm" if kvm else "tcg"),
                *lima_guest_clock(kvm), "-cpu", "host" if kvm else "max", "-smp", "2" if kvm else "1", "-m", "3072", "-display", "none",
                "-monitor", "none", "-nic", "none", "-no-reboot",
                "-drive", "file=base.qcow2,format=qcow2,if=virtio",
                "-drive", "file=dvd.iso,media=cdrom,readonly=on,format=raw"]
        boot = ["-kernel", "vmlinuz", "-initrd", "initrd.img", "-append",
                f"inst.stage2=hd:LABEL={DVD_LABEL} inst.ks=hd:LABEL=OEMDRV:/ks.cfg "
                "inst.text inst.noninteractive inst.notmux inst.nosave=all panic=10 console=ttyS0,115200n8",
                "-drive", "file=config.iso,media=cdrom,readonly=on,format=raw"]
        alma_progress(images, "Installing AlmaLinux from the DVD")
        log = images / "alma-installer.log"
        execute([*qemu, "-serial", "file:" + str(log), "-serial", "file:installed", *boot], timeout=7200)
        if (work / "installed").read_text().strip() != "INSTALL-" + token:
            raise ValueError(f"AlmaLinux installation did not complete. Check {log}.")
        alma_progress(images, "Applying the Erudior practice kit")
        execute([*qemu, "-boot", "c", "-serial", "file:" + str(images / "alma-kit.log"),
                 "-serial", "file:receipt", "-drive", "file=setup.iso,media=cdrom,readonly=on,format=raw"], timeout=3600)
        if (work / "receipt").read_text().strip() != token:
            raise ValueError(f"The guest did not confirm setup. Check alma-installer.log and alma-kit.log in {images}.")
        execute(["qemu-img", "check", "-q", "-f", "qcow2", "base.qcow2"])
        (work / "setup.iso").replace(setup_disc)
        disk = work / "base.qcow2"
        disk.chmod(0o400)
        # Never replace a base that existing overlays might reference.
        os.link(disk, destination)


def prepare_alma_base(base, kvm):
    images = base.parent
    with alma_lock(images):
        if base.is_file():
            return
        for name in ("qemu-system-x86_64", "qemu-img"):
            if not shutil.which(name):
                raise ValueError(f"Install {name} in the Linux lab provider before preparing the machines.")
        if not any(shutil.which(name) for name in ("genisoimage", "xorriso")):
            raise ValueError("Install genisoimage or xorriso in the Linux lab provider.")
        try:
            needed = 8 * 1024**3 + (0 if (images / DVD_NAME).exists() else MEDIA["dvd"][1])
            if shutil.disk_usage(images).free < needed:
                raise ValueError("Free at least 8 GiB for the base disk plus space for the 10.1 GiB AlmaLinux DVD.")
            kit = acquire_medium(images, "kit")
            dvd = acquire_medium(images, "dvd")
            provision_disk(images, dvd, kit, base, kvm)
            alma_progress(images, "AlmaLinux base ready")
        except Exception:
            alma_progress(images, "AlmaLinux setup did not finish. Retry after resolving the error.")
            raise
