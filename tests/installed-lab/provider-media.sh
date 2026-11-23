#!/bin/sh
set -eu
dest="$HOME/.local/share/erudior-vm-labs/images"
mkdir -p "$dest"
name=AlmaLinux-10-GenericCloud-10.3-20261116.0.x86_64.qcow2
python3 - "$name" "$dest/cloud.tmp" <<'DOWNLOAD'
import shutil
import sys
import urllib.request
url = "https://repo.almalinux.org/almalinux/10.3/cloud/x86_64/images/" + sys.argv[1]
with urllib.request.urlopen(url, timeout=120) as source, open(sys.argv[2], "wb") as output:
    shutil.copyfileobj(source, output)
DOWNLOAD
echo "845d3a4e41fde973bdbf9763b62a88538c1a1fadc2332a89f6ea01e2c17c78ee  $dest/cloud.tmp" | sha256sum -c -
chmod 444 "$dest/cloud.tmp"
mv "$dest/cloud.tmp" "$dest/linux-nfs-autofs-v1.qcow2"
