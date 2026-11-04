"""Exercise the actual hosted-runner cleanup shell in disposable local fixtures."""
import os
from pathlib import Path
import subprocess
import tempfile
import textwrap
import unittest

ROOT = Path(__file__).resolve().parents[1]

class EmulatorCleanupTests(unittest.TestCase):
    def script(self):
        source = (ROOT / '.github/workflows/android.yml').read_text()
        start = source.index('      - name: Reclaim disposable build space after signed APK verification')
        end = source.index('      - name: Install on Android emulator and launch', start)
        self.assertLess(source.index('      - name: Sign optimized emulator APK with disposable test certificate'), start)
        self.assertIn('run: python3 tests/android-emulator-cleanup.py -v', source[:start])
        for command in ['android-install-smoke.sh', 'android-installer-preflight-smoke.sh', 'android-upgrade-retention-smoke.sh', 'android-installer-launch-smoke.sh']:
            self.assertIn('ANDROID_TEST_APK=ci-signed-optimized.apk bash scripts/' + command, source[end:])
        return textwrap.dedent(source[start:end].split('        run: |\n', 1)[1])

    def fixture(self, root):
        disposable = ['src-tauri/target', 'src-tauri/gen/android/app/build', 'src-tauri/gen/android/.gradle', 'home/.gradle/caches', 'home/.gradle/wrapper/dists']
        files = {d + '/generated.bin': b'build output' for d in disposable}
        files.update({
            'ci-signed-optimized.apk': b'signed fixture',
            'src/main.tsx': b'source',
            'src-tauri/android-installer/plugin.kt': b'installer',
            'node_modules/playwright/keep.js': b'runtime dependency',
            'android-test-evidence/result.json': b'evidence',
            'home/.gradle/gradle.properties': b'configuration',
            'home/.android/avd/keep.ini': b'emulator',
            'sdk/ndk/keep': b'ndk',
            'sdk/build-tools/35.0.0/apksigner': b'#!/bin/sh\n[ "$1" = verify ] && [ "$2" = --verbose ] && [ "$3" = ci-signed-optimized.apk ]\n',
        })
        for name, data in files.items():
            p = root / name
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_bytes(data)
        (root / 'sdk/build-tools/35.0.0/apksigner').chmod(0o700)
        (root / 'tmp').mkdir()
        env = {**os.environ, 'GITHUB_ACTIONS': 'true', 'RUNNER_ENVIRONMENT': 'github-hosted', 'HOME': str(root / 'home'), 'ANDROID_HOME': str(root / 'sdk'), 'RUNNER_TEMP': str(root / 'tmp')}
        return files, disposable, env

    def test_preserves_signed_apk_sdk_runtime_and_evidence(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            files, disposable, env = self.fixture(root)
            subprocess.run(['bash', '-c', self.script()], cwd=root, env=env, check=True, capture_output=True)
            for name, data in files.items():
                if any(name.startswith(d + '/') for d in disposable):
                    self.assertFalse((root / name).exists())
                else:
                    self.assertEqual((root / name).read_bytes(), data)
            self.assertIn('ci-signed-optimized.apk', (root / 'tmp/android-emulator-fixture.sha256').read_text())

    def test_refuses_invalid_context_or_fixture_before_cleanup(self):
        for invalid in ['non-ci', 'self-hosted', 'missing', 'symlink', 'invalid-signature']:
            with self.subTest(invalid=invalid), tempfile.TemporaryDirectory() as tmp:
                root = Path(tmp)
                files, disposable, env = self.fixture(root)
                if invalid == 'non-ci': env['GITHUB_ACTIONS'] = 'false'
                if invalid == 'self-hosted': env['RUNNER_ENVIRONMENT'] = 'self-hosted'
                if invalid in ['missing', 'symlink']:
                    (root / 'ci-signed-optimized.apk').unlink()
                    if invalid == 'symlink': (root / 'ci-signed-optimized.apk').symlink_to('src/main.tsx')
                if invalid == 'invalid-signature':
                    (root / 'sdk/build-tools/35.0.0/apksigner').write_text('#!/bin/sh\nexit 1\n')
                result = subprocess.run(['bash', '-c', self.script()], cwd=root, env=env, capture_output=True)
                self.assertNotEqual(result.returncode, 0)
                for directory in disposable:
                    self.assertEqual((root / directory / 'generated.bin').read_bytes(), b'build output')

if __name__ == '__main__': unittest.main()
