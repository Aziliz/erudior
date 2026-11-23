from pathlib import Path
import subprocess
import tempfile
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / "scripts/desktop-engine-changed.py"


class DesktopEngine(unittest.TestCase):
    def test_courses_and_version_bumps_do_not_build_installers(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            def git(*args):
                subprocess.run(["git", *args], cwd=root, check=True, capture_output=True)
            def commit():
                git("add", ".")
                git("commit", "-m", "fixture")
            def changed():
                return subprocess.check_output(["python3", SCRIPT], cwd=root, text=True).strip()
            git("init", "-b", "main")
            git("config", "user.name", "Test")
            git("config", "user.email", "test@example.invalid")
            for name in ["samples", "public", "src", "src-tauri", ".github"]:
                (root / name).mkdir()
            for version in ("0.1.0", "0.1.1"):
                for name in ["src-tauri/tauri.conf.json", "package.json", "package-lock.json"]:
                    (root / name).write_text('{"version":"' + version + '"}')
                (root / "src-tauri/Cargo.toml").write_text(f'[package]\nname="erudior"\nversion="{version}"\n')
                (root / "src-tauri/Cargo.lock").write_text(f'[[package]]\nname="erudior"\nversion="{version}"\n')
                (root / ".github/desktop-release").write_text("v" + version)
                (root / "samples/course.json").write_text(version)
                (root / "public/sitemap.xml").write_text(version)
                commit()
                if version == "0.1.0":
                    git("tag", "v0.1.0")
            self.assertEqual(changed(), "changed=false")
            (root / "src/player.ts").write_text("export const schema = 2;")
            commit()
            self.assertEqual(changed(), "changed=true")


if __name__ == "__main__":
    unittest.main()
