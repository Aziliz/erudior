"""Prepare or publish the signed course channel in an isolated Git worktree."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import shutil
import subprocess

BRANCH = "refs/heads/published-courses"
WORK = Path(".github-course-channel")


def git(*args, cwd=None):
    return subprocess.check_output(["git", *args], cwd=cwd, text=True).strip()


def prepare():
    remote = git("ls-remote", "origin", BRANCH)
    if remote:
        git("fetch", "--no-tags", "origin", BRANCH)
        git("worktree", "add", "--detach", str(WORK), "FETCH_HEAD")
    else:
        git("worktree", "add", "--detach", "--no-checkout", str(WORK), "HEAD")
        git("read-tree", "--empty", cwd=WORK)
    print("existing=true" if remote else "existing=false")


def assemble(source, dest, previous):
    text = (source / "catalog.json").read_bytes()
    sig = (source / "catalog.json.sig").read_text().strip()
    catalog = json.loads(text)
    packages = [*catalog["courses"], catalog["states"]]
    prior_state = json.loads((previous / "catalog.json").read_bytes()).get("states")
    dest.mkdir(parents=True, exist_ok=True)
    for entry in packages:
        name = entry["file"]
        if not re.fullmatch(r"[A-Za-z0-9_-]+\.r[1-9][0-9]*\.json|states\.[A-Za-z0-9._-]+\.json", name):
            raise ValueError(f"Invalid package name: {name}")
        if prior_state and name == prior_state["file"] and entry["sha256"] != prior_state["sha256"]:
            raise ValueError(f"State package changed without a version bump: {name}")
        payload = (source / name).read_bytes()
        if len(payload) != entry["bytes"] or hashlib.sha256(payload).hexdigest() != entry["sha256"]:
            raise ValueError(f"Package disagrees with signed catalog: {name}")
        target = dest / name
        if target.exists() and target.read_bytes() != payload:
            raise ValueError(f"Immutable package changed: {name}")
        if not target.exists():
            target.write_bytes(payload)
    for name in ("catalog.json", "catalog.json.sig", "sitemap.xml"):
        shutil.copyfile(source / name, dest / name)
    (dest / "catalog.signed.json").write_text(json.dumps({"text": text.decode(), "sig": sig}, ensure_ascii=False))


def publish(source, previous):
    parent = git("rev-parse", "HEAD", cwd=WORK) if previous.resolve() == (WORK / "v1").resolve() else None
    assemble(source, WORK / "v1", previous)
    git("fetch", "--no-tags", "origin", "refs/heads/main")
    if git("diff", "--name-only", "HEAD", "FETCH_HEAD", "--", "samples", "scripts/publish-courses.ts",
           "scripts/github-course-feed.py", "scripts/sitemap.mjs", ".github/workflows/github-courses.yml"):
        print("Newer publication inputs are already on main. Leaving the feed for their run.")
        return
    git("add", "--", "v1", cwd=WORK)
    tree = git("write-tree", cwd=WORK)
    commit = git("-c", "user.name=github-actions[bot]", "-c", "user.email=41898282+github-actions[bot]@users.noreply.github.com",
                 "commit-tree", tree, *(["-p", parent] if parent else []),
                 "-m", "Publish verified courses from " + git("rev-parse", "HEAD"), cwd=WORK)
    # An independent writer changing the ref causes the normal fast-forward push to fail.
    git("push", "origin", f"{commit}:{BRANCH}")
    if git("ls-remote", "origin", BRANCH).split()[0] != commit:
        raise RuntimeError("Published feed ref did not match the signed release commit.")
    print("Published " + commit)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=("prepare", "publish"))
    parser.add_argument("--source", type=Path, default=Path("dist-courses/v1"))
    parser.add_argument("--previous", type=Path)
    args = parser.parse_args()
    if args.action == "prepare":
        prepare()
    elif args.previous:
        publish(args.source, args.previous)
    else:
        parser.error("publish requires --previous")
