"""Static integration guards, not a substitute for emulator acceptance/compilation."""
from pathlib import Path
import unittest
ROOT = Path(__file__).resolve().parents[1]

class PortableNativeContract(unittest.TestCase):
    def test_picker_owns_uri_and_does_not_expand_permissions(self):
        kotlin = (ROOT / 'src-tauri/android-portable-files/src/main/java/com/erudior/files/PortableFilesPlugin.kt').read_text()
        for expected in ['Intent.ACTION_OPEN_DOCUMENT', 'Intent.ACTION_CREATE_DOCUMENT', 'result.data?.data',
                         'contentResolver.openInputStream(uri)', 'contentResolver.openOutputStream(uri, "wt")',
                         'maxBytes + 1 - output.size()', 'readBounded(it)', 'CodingErrorAction.REPORT', 'AtomicBoolean(false)',
                         'Activity.RESULT_CANCELED']:
            self.assertIn(expected, kotlin)
        for forbidden in ['takePersistableUriPermission', 'Uri.parse(', 'READ_EXTERNAL_STORAGE',
                          'MANAGE_EXTERNAL_STORAGE', 'HttpURLConnection', 'java.io.File']:
            self.assertNotIn(forbidden, kotlin)

    def test_bridge_has_no_path_or_uri_arguments(self):
        rust = (ROOT / 'src-tauri/src/portable_files.rs').read_text()
        self.assertIn('fn pick_portable_course(app: AppHandle)', rust)
        self.assertIn('fn export_portable_course(app: AppHandle, content: String, name: String)', rust)
        self.assertEqual(rust.count('#[tauri::command(async)]'), 2)
        self.assertIn('.take((MAX_BYTES + 1) as u64)', rust)
        self.assertIn('24 * 1024 * 1024', rust)

    def test_real_emulator_proof_remains_wired(self):
        runner = (ROOT / 'scripts/android-upgrade/run.mjs').read_text()
        self.assertIn('await verifyPortableFiles(', runner)
        proof = (ROOT / 'scripts/android-upgrade/portable-files.mjs').read_text()
        for expected in ['KEYCODE_BACK', 'erudior-offline-proof-repeat.json', 'erudior-too-large.json',
                         'erudior-invalid-utf8.json', 'erudior-empty.json', 'Saved course document']:
            self.assertIn(expected, proof)

if __name__ == '__main__': unittest.main()
