#!/usr/bin/env bash
set -euo pipefail
apk="${1:?APK path required}"
test -f "$apk"
# Optimized Android release builds may rename res/xml/*.xml ZIP members.
# Follow the compiled manifest's unique provider and referenced XML resource,
# then inspect the actual binary XML for the private updates/ cache-path.
python3 scripts/android-apk-fileprovider-check.py "$apk"
echo "Distinct scoped Erudior update FileProvider and install permission packaged in APK"
