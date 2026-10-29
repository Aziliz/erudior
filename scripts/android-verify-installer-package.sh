#!/usr/bin/env bash
set -euo pipefail
apk="${1:?APK path required}"
build_tools="${ANDROID_HOME:?}/build-tools/35.0.0"
test -f "$apk"
# Check the *compiled APK*, not just source files: a missing provider can
# compile but fail with IllegalArgumentException when the installer is opened.
manifest="$("$build_tools/aapt" dump xmltree "$apk" AndroidManifest.xml)"
printf '%s\n' "$manifest" | grep -F 'android.permission.REQUEST_INSTALL_PACKAGES' >/dev/null
printf '%s\n' "$manifest" | grep -F 'androidx.core.content.FileProvider' >/dev/null
printf '%s\n' "$manifest" | grep -F 'com.erudior.app.erudior-updates' >/dev/null
printf '%s\n' "$manifest" | grep -F 'android.support.FILE_PROVIDER_PATHS' >/dev/null
unzip -Z1 "$apk" | grep -Fx 'res/xml/erudior_update_paths.xml' >/dev/null || {
  # Android's resource packager may rename the compiled XML resource;
  # the manifest + source checks are still required but cannot prove packaging.
  echo "::error::Compiled FileProvider paths XML missing from APK"
  exit 1
}
echo "Installer FileProvider and install permission packaged in APK"
