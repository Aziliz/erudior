#!/usr/bin/env bash
set -euo pipefail
apk="${ANDROID_TEST_APK:?Set ANDROID_TEST_APK}"
package=com.erudior.app
mkdir -p android-test-evidence
ready=0
for attempt in $(seq 1 12); do
  if adb get-state 2>/dev/null | grep -qx device && adb shell true >/dev/null 2>&1; then
    ready=1
    break
  fi
  echo "Waiting for Android emulator ADB transport ($attempt/12)"
  sleep 5
done
if [[ "$ready" -ne 1 ]]; then
  echo "::error::Android emulator did not become available for installer preflight"
  adb devices -l || true
  exit 1
fi
adb shell pm path "$package" | grep -F 'package:'
# ADB launches the application, then asks Android to resolve the same ACTION_VIEW
# used by Erudior's Kotlin bridge. This checks the platform installer path,
# not the Tauri command invocation or user approval.
adb shell dumpsys package "$package" > android-test-evidence/installed-package.txt
if ! grep -F 'android.permission.REQUEST_INSTALL_PACKAGES' android-test-evidence/installed-package.txt >/dev/null; then
  echo "::error::APK missing installation request permission"
  exit 1
fi
adb shell pm resolve-activity -a android.intent.action.VIEW -t application/vnd.android.package-archive > android-test-evidence/installer-resolution.txt
if grep -F 'No activity found' android-test-evidence/installer-resolution.txt; then
  echo "::error::No Android APK installer activity"
  exit 1
fi
# Android's installed PackageManager state must contain our non-exported provider.
adb shell dumpsys package "$package" > android-test-evidence/installed-package.txt
grep -F 'com.erudior.app.erudior-updates' android-test-evidence/installed-package.txt >/dev/null || {
  echo "::error::Installer FileProvider authority absent from installed app"; exit 1;
}
echo "APK install handler and Erudior FileProvider authority are registered."

