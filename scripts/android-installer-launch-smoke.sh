#!/usr/bin/env bash
# Smoke-test Android's actual install UI with the exact FileProvider URI used
# by Erudior. This is a platform-side test, not proof of the Tauri button.
set -euo pipefail
apk="${ANDROID_TEST_APK:?Signed APK required}"
pkg=com.erudior.app
cache="/data/user/0/$pkg/cache/updates"
mkdir -p android-test-evidence

adb root >/dev/null
adb wait-for-device
adb shell mkdir -p "$cache"
adb push "$apk" /data/local/tmp/erudior-installer-smoke.apk >/dev/null
adb shell cp /data/local/tmp/erudior-installer-smoke.apk "$cache/verified-update.apk"
uid="$(adb shell stat -c %u "/data/user/0/$pkg" | tr -d '\r')"
adb shell chown "$uid:$uid" "$cache/verified-update.apk"
adb shell restorecon -RF "$cache" || true

# The same content URI returned by FileProvider for the scoped cache-path.
uri="content://$pkg.erudior-updates/verified-update/verified-update.apk"
adb shell am start -a android.intent.action.VIEW -d "$uri" \
  -t application/vnd.android.package-archive --grant-read-uri-permission \
  > android-test-evidence/installer-launch.txt 2>&1 || {
    cat android-test-evidence/installer-launch.txt
    echo "::error::Android failed to launch APK installer with Erudior FileProvider URI"
    exit 1
  }
sleep 2
adb shell dumpsys activity activities > android-test-evidence/installer-foreground.txt
if ! grep -Eiq 'packageinstaller|installstart|packageinstalleractivity|installing' android-test-evidence/installer-foreground.txt; then
  cat android-test-evidence/installer-launch.txt
  echo "::warning::ADB-shell request did not display installer. This does not test an Erudior-origin FileProvider grant"
  exit 1
fi
# Do not consent to installation or clear the existing application.
adb shell input keyevent KEYCODE_BACK || true
echo "System APK installer activity launched from Erudior content URI (approval not exercised)."
