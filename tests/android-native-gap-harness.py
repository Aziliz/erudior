"""CI-only missing-native-pause fixture contracts; no Android runtime emulation."""
import importlib.util
from pathlib import Path
import os
import subprocess
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("upgrade_harness", ROOT / "tests/android-upgrade-harness.py")
harness = importlib.util.module_from_spec(spec)
spec.loader.exec_module(harness)
module = harness.module

class NativeGapHarnessTests(unittest.TestCase):
    fixture = harness.UpgradeHarnessTests.fixture

    def test_unknown_native_pause_anchor_fails_without_mutation(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);self.fixture(root)
            plugin=root/'src-tauri/gen/android/app/src/main/java/com/erudior/updates/InstallerPlugin.kt'
            plugin.write_text(plugin.read_text().replace('override fun onPause(activity:', 'override fun unexpectedPause(activity:'))
            before=plugin.read_bytes()
            with patch.dict(os.environ, {'GITHUB_ACTIONS':'true','ERUDIOR_UPGRADE_E2E':'1'}):
                with self.assertRaisesRegex(RuntimeError, 'Unknown native pause callback'):module.prepare(root)
            self.assertEqual(plugin.read_bytes(),before)

    def test_missing_native_pause_is_generated_only_and_does_not_supply_a_lock(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);files=self.fixture(root)
            production='src-tauri/android-installer/src/main/java/com/erudior/updates/InstallerPlugin.kt'
            with patch.dict(os.environ, {'GITHUB_ACTIONS':'true','ERUDIOR_UPGRADE_E2E':'1'}):module.prepare(root)
            self.assertEqual((root/production).read_text(),files[production])
            generated=(root/'src-tauri/gen/android/app/src/main/java/com/erudior/updates/InstallerPlugin.kt').read_text()
            start=generated.index('        if (lifecycleLongResumes == 2 && lifecyclePauseDropDone && lifecycleDropDone && !lifecycleNativePauseDropDone) {')
            end=generated.index('\n        }',start)
            fault=generated[start:end]
            self.assertEqual(generated.count('drop-native-pause sequence='),1)
            self.assertIn('lifecycleNativePauseDropDone = true',fault)
            self.assertIn('lifecycleState.revocation() == 0L',fault)
            self.assertIn('            return',fault)
            self.assertNotIn('lifecycleState.pause(',fault)
            self.assertNotIn('lifecycleState.resume(',fault)
            self.assertNotIn('evaluateJavascript',fault)
            self.assertNotIn('visibility =',fault)
            self.assertNotIn('drop-native-pause',files[production])
            self.assertIn('revocation=${lifecycleState.revocation()}',generated)
            shared=(ROOT/'scripts/android-upgrade/shared-device.mjs').read_text()
            self.assertEqual(shared.count('await sleep(32000)'),3)
            self.assertIn('await waitForNativeReveal(false)',shared)
            self.assertIn('await waitForNativeReveal(true)',shared)
            self.assertIn('same version-B process before missing-pause case',shared)
            self.assertIn('missing-pause result cannot be supplied by a restarted process',shared)
            self.assertNotIn('dispatchEvent',shared)
            self.assertNotIn('Date.now =',shared)

    def test_unknown_native_resume_evidence_parser(self):
        subprocess.run(['node','--test','tests/android-native-gap-evidence.test.mjs'],cwd=ROOT,check=True)

if __name__ == '__main__':
    unittest.main()
