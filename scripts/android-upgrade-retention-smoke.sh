#!/usr/bin/env bash
set -euo pipefail
apk="${ANDROID_TEST_APK:?Signed test APK is required}"
package="com.erudior.app"
dir="/data/user/0/$package/files"
adb root
adb wait-for-device
adb shell pm path "$package" | grep -F 'package:'

# Use app-owned fixtures with recorded hashes, never root-owned files.
app_uid="$(adb shell stat -c %u "/data/user/0/$package" | tr -d '\r')"
test "$app_uid" != "0" && test -n "$app_uid"
fixture="$(mktemp -d)"
trap 'rm -rf "$fixture"' EXIT
printf 'erudior-upgrade-retention-fixture\n' > "$fixture/upgrade-retention-marker"
printf '%s' '{"lessonsDone":{"test/lesson-1":true}}' > "$fixture/progress.json"
printf '%s' '{"id":"test-course","revision":1}' > "$fixture/test-course.json"

adb shell mkdir -p "$dir/courses"
adb push "$fixture/upgrade-retention-marker" /data/local/tmp/erudior-retention-marker >/dev/null
adb push "$fixture/progress.json" /data/local/tmp/erudior-progress.json >/dev/null
adb push "$fixture/test-course.json" /data/local/tmp/erudior-course.json >/dev/null
adb shell cp /data/local/tmp/erudior-retention-marker "$dir/upgrade-retention-marker"
adb shell cp /data/local/tmp/erudior-progress.json "$dir/progress.json"
adb shell cp /data/local/tmp/erudior-course.json "$dir/courses/test-course.json"
adb shell chown -R "$app_uid:$app_uid" "$dir"
adb shell restorecon -RF "$dir" || true

before_marker="$(adb shell sha256sum "$dir/upgrade-retention-marker" | awk '{print $1}')"
before_progress="$(adb shell sha256sum "$dir/progress.json" | awk '{print $1}')"
before_course="$(adb shell sha256sum "$dir/courses/test-course.json" | awk '{print $1}')"
test "$before_marker" = "$(sha256sum "$fixture/upgrade-retention-marker" | awk '{print $1}')"
test "$before_progress" = "$(sha256sum "$fixture/progress.json" | awk '{print $1}')"
test "$before_course" = "$(sha256sum "$fixture/test-course.json" | awk '{print $1}')"

echo "Reinstalling same signed APK without clearing data..."
adb install -r "$apk"
adb shell pm path "$package" | grep -F 'package:'

check_retained() {
  local name="$1" path="$2" expected="$3" actual
  if ! adb shell test -f "$path"; then
    echo "::error::$name is missing after reinstall"
    adb shell ls -la "$dir" || true
    exit 1
  fi
  actual="$(adb shell sha256sum "$path" | awk '{print $1}')"
  if [[ "$actual" != "$expected" ]]; then
    echo "::error::$name changed after reinstall: expected $expected, got $actual"
    exit 1
  fi
}
check_retained marker "$dir/upgrade-retention-marker" "$before_marker"
check_retained progress "$dir/progress.json" "$before_progress"
check_retained downloaded-course "$dir/courses/test-course.json" "$before_course"
echo "Relaunching application after same-signature reinstall..."
adb shell am force-stop "$package"
adb shell monkey -p "$package" 1 | tee android-test-evidence/upgrade-relaunch.txt
grep -F 'Events injected: 1' android-test-evidence/upgrade-relaunch.txt
sleep 5
if adb logcat -d -s AndroidRuntime:E | grep -F 'FATAL EXCEPTION'; then
  echo "::error::AndroidRuntime crash after reinstall"
  exit 1
fi
check_retained progress "$dir/progress.json" "$before_progress"
check_retained downloaded-course "$dir/courses/test-course.json" "$before_course"
echo "Same-signature reinstall, app relaunch, and retained fixture bytes passed. Two-version upgrade and real learner-state tests still required."
