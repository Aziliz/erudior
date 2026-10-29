#!/usr/bin/env bash
set -euo pipefail
apk="${ANDROID_TEST_APK:?Signed test APK is required}"
package="com.erudior.app"

# Emulator only: adb root provides controlled access to test data, never a phone.
adb root
adb wait-for-device
adb shell pm path "$package" | grep -F 'package:'
adb shell mkdir -p "/data/user/0/$package/files"
marker="erudior-upgrade-test-$(date +%s)"
adb shell sh -c "echo '$marker' > '/data/user/0/$package/files/upgrade-retention-marker'"
# Representative learner data and downloaded-course cache entries remain byte-for-byte intact.
adb shell mkdir -p "/data/user/0/$package/files/courses"
adb shell sh -c "printf '%s' '{\\\"lessonsDone\\\":{\\\"test/lesson-1\\\":true}}' > '/data/user/0/$package/files/progress.json'"
adb shell sh -c "printf '%s' '{\\\"id\\\":\\\"test-course\\\",\\\"revision\\\":1}' > '/data/user/0/$package/files/courses/test-course.json'"
progress_before="$(adb shell sha256sum "/data/user/0/$package/files/progress.json" | awk '{print $1}')"
course_before="$(adb shell sha256sum "/data/user/0/$package/files/courses/test-course.json" | awk '{print $1}')"
echo "Reinstalling an APK signed with the same CI test certificate..."
adb install -r "$apk"
actual="$(adb shell cat "/data/user/0/$package/files/upgrade-retention-marker" | tr -d '\r')"
test "$actual" = "$marker" || { echo "::error::Private app files lost after upgrade-style reinstall"; exit 1; }
test "$(adb shell sha256sum "/data/user/0/$package/files/progress.json" | awk '{print $1}')" = "$progress_before"
test "$(adb shell sha256sum "/data/user/0/$package/files/courses/test-course.json" | awk '{print $1}')" = "$course_before"
adb shell pm path "$package" | grep -F 'package:'
echo "Same-signature reinstall preserved private app files. Version-to-version migration still requires a two-version test."
