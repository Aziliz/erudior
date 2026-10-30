#!/usr/bin/env bash
set -euo pipefail
apk="${1:?APK path required}"
build_tools="${ANDROID_HOME:?}/build-tools/35.0.0"
test -f "$apk"
# Inspect the compiled APK, not only source files. The updater must have a
# distinct component identity from Tauri's general-purpose FileProvider.
manifest="$("$build_tools/aapt" dump xmltree "$apk" AndroidManifest.xml)"
printf '%s\n' "$manifest" | grep -F 'android.permission.REQUEST_INSTALL_PACKAGES' >/dev/null
printf '%s\n' "$manifest" | grep -F 'com.erudior.updates.ErudiorUpdateFileProvider' >/dev/null
printf '%s\n' "$manifest" | grep -F 'com.erudior.app.erudior-updates' >/dev/null
printf '%s\n' "$manifest" | grep -F 'android.support.FILE_PROVIDER_PATHS' >/dev/null
unzip -Z1 "$apk" | grep -Fx 'res/xml/erudior_update_paths.xml' >/dev/null || {
  echo "::error::Compiled FileProvider paths XML missing from APK"
  exit 1
}
echo "Distinct installer FileProvider and install permission packaged in APK"
