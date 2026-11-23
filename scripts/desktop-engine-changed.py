"""Tell Actions whether the current checkout differs from a released desktop engine."""
import json
from pathlib import Path
import re
import subprocess
import sys
import tomllib


def git(*args):
    return subprocess.check_output(["git", *args], text=True)


def features(name, data):
    if name.endswith(".json"):
        obj = json.loads(data)
        obj.pop("version", None)
        if name == "package-lock.json":
            obj.get("packages", {}).get("", {}).pop("version", None)
        return obj
    obj = tomllib.loads(data)
    if name.endswith("Cargo.toml"):
        obj.get("package", {}).pop("version", None)
    else:
        for package in obj.get("package", []):
            if package["name"] == "erudior" and "source" not in package:
                package.pop("version", None)
    return obj


def changed(base):
    paths = git("diff", "--name-only", "-z", base, "HEAD", "--", "src/", "src-tauri/", "index.html", "public/",
                "vite.config.ts", "tsconfig.json", "package.json", "package-lock.json").split("\0")
    for name in filter(None, paths):
        if name == "public/sitemap.xml":
            continue
        if name in {"package.json", "package-lock.json", "src-tauri/tauri.conf.json", "src-tauri/Cargo.lock", "src-tauri/Cargo.toml"}:
            if Path(name).is_file() and subprocess.run(["git", "cat-file", "-e", f"{base}:{name}"], stderr=subprocess.DEVNULL).returncode == 0:
                if features(name, git("show", f"{base}:{name}")) == features(name, Path(name).read_text()):
                    continue
        return True
    return False


if __name__ == "__main__":
    tags = [t for t in git("tag", "--merged", "HEAD", "--sort=-version:refname").splitlines()
            if re.fullmatch(r"v\d+\.\d+\.\d+", t)]
    base = sys.argv[1] if len(sys.argv) > 1 else next(iter(tags), None)
    print("changed=" + str(base is None or changed(base)).lower())
