import importlib.util
from pathlib import Path
import tempfile
import unittest
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("installer_integration", ROOT / "scripts/android-integrate-installer.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
NS = "{" + module.ANDROID + "}"
BASE_PROVIDER = "androidx.core.content.FileProvider"
BASE_AUTHORITY = "${applicationId}.fileprovider"

class InstallerIntegrationTests(unittest.TestCase):
    def project(self, root):
        generated = root / "src-tauri/gen/android/app/src/main"
        activity = generated / "java/com/erudior/app/MainActivity.kt"
        activity.parent.mkdir(parents=True)
        activity.write_text("// Keep this generated activity byte-identical.\n")
        generated.joinpath("AndroidManifest.xml").write_text('''<manifest xmlns:android="http://schemas.android.com/apk/res/android"><application>
<provider android:name="androidx.core.content.FileProvider" android:authorities="${applicationId}.fileprovider" android:exported="false" android:grantUriPermissions="true"><meta-data android:name="android.support.FILE_PROVIDER_PATHS" android:resource="@xml/file_paths" /></provider>
</application></manifest>''')
        source = root / "src-tauri/android-installer/src/main"
        for path, content in {
            "java/com/erudior/updates/InstallerPlugin.kt": "// fixture plugin\n",
            "java/com/erudior/updates/ErudiorUpdateFileProvider.kt": "class ErudiorUpdateFileProvider : FileProvider()\n",
            "res/xml/erudior_update_paths.xml": '<paths><cache-path name="verified-update" path="updates/" /></paths>',
        }.items():
            p=source/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(content)
        return generated, activity

    def test_provider_identity_is_distinct_and_integration_idempotent(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);generated,activity=self.project(root);original=activity.read_bytes()
            module.integrate(root)
            manifest=generated/"AndroidManifest.xml";first=manifest.read_bytes()
            module.integrate(root)
            self.assertEqual(manifest.read_bytes(),first)
            self.assertEqual(activity.read_bytes(),original)
            doc=ET.parse(manifest);providers=doc.findall("application/provider")
            self.assertEqual(len(providers),2)
            by_name={n.get(NS+'name'):n for n in providers}
            self.assertEqual(set(by_name),{BASE_PROVIDER,module.PROVIDER})
            self.assertEqual(by_name[BASE_PROVIDER].get(NS+'authorities'),BASE_AUTHORITY)
            self.assertEqual(by_name[BASE_PROVIDER].find('meta-data').get(NS+'resource'),'@xml/file_paths')
            update=by_name[module.PROVIDER]
            self.assertEqual(update.get(NS+'authorities'),module.AUTHORITY)
            self.assertEqual(update.get(NS+'exported'),'false')
            self.assertEqual(update.get(NS+'grantUriPermissions'),'true')
            self.assertEqual(update.find('meta-data').get(NS+'resource'),'@xml/erudior_update_paths')
            self.assertEqual(len(doc.findall('uses-permission')),1)
            self.assertTrue((generated/'java/com/erudior/updates/ErudiorUpdateFileProvider.kt').is_file())

    def test_legacy_duplicate_class_is_migrated_without_touching_tauri(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);generated,_=self.project(root);manifest=generated/'AndroidManifest.xml'
            doc=ET.parse(manifest)
            ET.SubElement(doc.getroot().find('application'),'provider',{NS+'name':BASE_PROVIDER,NS+'authorities':module.AUTHORITY})
            doc.write(manifest)
            module.integrate(root)
            names=[n.get(NS+'name') for n in ET.parse(manifest).findall('application/provider')]
            self.assertEqual(names,[BASE_PROVIDER,module.PROVIDER])

    def test_ambiguous_update_authority_fails(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);generated,_=self.project(root);manifest=generated/'AndroidManifest.xml'
            doc=ET.parse(manifest)
            for _ in range(2): ET.SubElement(doc.getroot().find('application'),'provider',{NS+'name':BASE_PROVIDER,NS+'authorities':module.AUTHORITY})
            doc.write(manifest);before=manifest.read_bytes()
            with self.assertRaises(RuntimeError):module.integrate(root)
            self.assertEqual(manifest.read_bytes(),before)

if __name__=='__main__':unittest.main()
