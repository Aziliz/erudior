#!/usr/bin/env bash
# Build and check one module of a math/science course on its own, while other modules are
# being written (e.g. by other writers at the same time).
#   content/math/check-module.sh biology m3
# Copies course.yaml (only that module), the module's lessons, questions/mNN.yaml, drills/mNN.yaml,
# cards-mN.yaml, every glossary file and reference sheet into a scratch folder, builds it as
# <id>-<module> into samples/math-drafts, and runs the course checker on it.
set -euo pipefail
cd "$(dirname "$0")/../.."
course=$1; mod=$2
src=content/math/$course
tmp=$(mktemp -d)/math/$course-$mod
mkdir -p "$tmp/lessons" "$tmp/questions" "$tmp/drills" "$tmp/references"
python3 - "$src" "$tmp" "$mod" <<'PY'
import sys, yaml, pathlib, re, shutil
src, tmp = map(pathlib.Path, sys.argv[1:3]); mod = sys.argv[3]
n = int(mod.lstrip("m"))
meta = yaml.safe_load((src / "course.yaml").read_text())
mid = next(m["id"] for m in meta["modules"] if m["id"].endswith("-" + mod))
meta["modules"] = [m for m in meta["modules"] if m["id"] == mid]
meta["id"] = f"{meta['id']}-{mod}"
meta["released"] = False
(tmp / "course.yaml").write_text(yaml.safe_dump(meta, allow_unicode=True, sort_keys=False))
for f in (src / "lessons").glob("*.md"):
    if re.search(rf"^module:\s*{re.escape(mid)}\s*$", f.read_text(), re.M):
        shutil.copy(f, tmp / "lessons")
for name in (f"questions/m{n:02d}.yaml", f"drills/m{n:02d}.yaml", f"cards-m{n}.yaml"):
    if (src / name).exists():
        shutil.copy(src / name, tmp / name)
for f in src.glob("glossary*.yaml"):
    shutil.copy(f, tmp)
for f in (src / "references").glob("*.md"):
    shutil.copy(f, tmp / "references")
PY
python3 content/math/build.py "$tmp"
id=$(python3 -c "import yaml;print(yaml.safe_load(open('$tmp/course.yaml'))['id'])")
npx tsx tests/check-course.mts "samples/math-drafts/$id.json"
