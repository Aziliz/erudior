#!/usr/bin/env bash
set -euo pipefail

mkdir -p android-test-evidence
apk="$(find src-tauri/gen/android/app/build/outputs/apk -type f -name '*.apk' -print -quit)"
if [[ -z "$apk" ]]; then
  echo "::error::Android APK not found"
  exit 1
fi

echo "APK: $apk"
adb devices -l
adb shell getprop ro.build.version.sdk
adb shell getprop ro.product.cpu.abi

trap 'adb logcat -d > android-test-evidence/logcat.txt 2>&1 || true; adb shell screencap -p /sdcard/erudior-smoke.png 2>/dev/null && adb pull /sdcard/erudior-smoke.png android-test-evidence/screen.png >/dev/null 2>&1 || true' EXIT

echo "Installing APK..."
adb install -r "$apk"

echo "Checking package registration..."
adb shell pm path com.erudior.app | grep -F 'package:'

echo "Launching Erudior..."
adb shell monkey -p com.erudior.app 1 | tee android-test-evidence/monkey.txt
grep -F 'Events injected: 1' android-test-evidence/monkey.txt
sleep 6

echo "Checking AndroidRuntime crash logs..."
adb logcat -d -s AndroidRuntime:E > android-test-evidence/crashes.txt
if grep -q 'FATAL EXCEPTION' android-test-evidence/crashes.txt; then
  cat android-test-evidence/crashes.txt
  exit 1
fi
echo "Android install and launch smoke passed."
