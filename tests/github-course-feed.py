"""Publish successive revisions to a local bare origin, then try to rewrite one."""
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

spec = importlib.util.spec_from_file_location("feed", Path(__file__).resolve().parents[1] / "scripts/github-course-feed.py")
feed = importlib.util.module_from_spec(spec)
spec.loader.exec_module(feed)


class Publication(unittest.TestCase):
    def test_atomic_append_and_rejection(self):
        with tempfile.TemporaryDirectory() as tmp:
            start = Path.cwd()
            self.addCleanup(os.chdir, start)
            os.chdir(tmp)
            feed.git("init", "--bare", "remote.git")
            feed.git("init", "-b", "main", "source")
            os.chdir("source")
            feed.git("config", "user.name", "Test")
            feed.git("config", "user.email", "test@example.invalid")
            feed.git("commit", "--allow-empty", "-m", "Engine")
            feed.git("remote", "add", "origin", "../remote.git")
            feed.git("push", "origin", "main")
            prev = Path("legacy")
            prev.mkdir()
            (prev / "catalog.json").write_text('{"courses":[]}')
            src = Path("output")
            src.mkdir()
            for revision, payload in [(1, b"first"), (2, b"second"), (2, b"rewrite")]:
                feed.prepare()
                def package(name, data):
                    (src / name).write_bytes(data)
                    return {"file": name, "sha256": hashlib.sha256(data).hexdigest(), "bytes": len(data)}
                catalog = {"courses": [package(f"lesson.r{revision}.json", payload)], "states": package("states.1.json", b"states")}
                exact = json.dumps(catalog, indent=2) + "\n"
                (src / "catalog.json").write_text(exact)
                (src / "catalog.json.sig").write_text("test-envelope-fixture\n")
                (src / "sitemap.xml").write_text("<urlset/>")
                if payload == b"rewrite":
                    before = feed.git("ls-remote", "origin", feed.BRANCH)
                    with self.assertRaisesRegex(ValueError, "Immutable"):
                        feed.publish(src, prev)
                    self.assertEqual(before, feed.git("ls-remote", "origin", feed.BRANCH))
                    break
                feed.publish(src, prev)
                head = feed.git("ls-remote", "origin", feed.BRANCH).split()[0]
                self.assertEqual(json.loads(feed.git("show", f"{head}:v1/catalog.signed.json"))["text"], exact)
                self.assertEqual(feed.git("show", f"{head}:v1/lesson.r1.json"), "first")
                self.assertTrue(all(p.startswith("v1/") for p in feed.git("ls-tree", "-r", "--name-only", head).splitlines()))
                feed.git("worktree", "remove", "--force", str(feed.WORK))
                prev = feed.WORK / "v1"


if __name__ == "__main__":
    unittest.main()
