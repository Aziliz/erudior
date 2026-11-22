#!/bin/sh
set -eu
. /etc/os-release
case "${VERSION_ID:-}" in ''|*[!0-9.]*) major=0 ;; *) major=${VERSION_ID%%.*} ;; esac
if [ "${ID:-}" != debian ] || [ "$major" -lt 13 ]; then
    echo 'This distribution needs Debian 13 or later. Choose Install a dedicated Debian host.' >&2
    exit 1
fi
verify_tools() {
    for tool in python3 qemu-img qemu-system-x86_64 ssh-keygen; do command -v "$tool" >/dev/null || return 1; done
    { command -v genisoimage >/dev/null && command -v isoinfo >/dev/null; } || command -v xorriso >/dev/null || return 1
    python3 -c 'import re, subprocess, sys
version = subprocess.check_output(["qemu-system-x86_64", "--version"], text=True)
match = re.search(r"version (\d+)\.(\d+)", version)
if not match or tuple(map(int, match.groups())) < (9, 2):
    sys.exit("Erudior requires QEMU 9.2 or later.")'
}
if [ "$1" = check ]; then verify_tools; exit 0; fi
export DEBIAN_FRONTEND=noninteractive
apt-get -o DPkg::Lock::Timeout=90 update -qq
apt-get -o DPkg::Lock::Timeout=90 install -y --no-install-recommends python3 qemu-system-x86 qemu-utils genisoimage openssh-client ca-certificates
verify_tools
if [ "$1" = managed ]; then
    if ! id erudior-lab >/dev/null 2>&1; then
        useradd --create-home --shell /bin/bash erudior-lab
    fi
    if getent group kvm >/dev/null; then usermod -aG kvm erudior-lab; fi
fi
exit 0
