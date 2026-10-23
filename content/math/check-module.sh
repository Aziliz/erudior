#!/usr/bin/env bash
# Build and check one module of a course on its own, while other modules are being written
# (e.g. by other writers at the same time).
#   content/math/check-module.sh biology m3        (module id, or the part after the last "-")
#   content/math/check-module.sh algebra1 alg-m2
#   content/math/check-module.sh german-a1 h1
# Works for any course folder in content/math or content/languages. It copies course.yaml (only
# that module), the module's lessons, the questions/vocab whose `lesson` is one of them (from
# every file), the drills those lessons list, the cards on their topics plus any cards file named
# for the module, every glossary file, reference sheet, reading list and image, builds it as
# <id>-<module> into samples/<area>-drafts, and runs the course checker on it. Files other
# writers are halfway through (YAML errors) are skipped with a warning.
set -euo pipefail
cd "$(dirname "$0")/../.."
course=$1; mod=$2
src=""
for area in content/math content/languages; do [ -f "$area/$course/course.yaml" ] && src="$area/$course"; done
[ -n "$src" ] || { echo "no course folder named $course" >&2; exit 1; }
area=$(basename "$(dirname "$src")")
tmp=$(mktemp -d)/$area/$course-$mod
mkdir -p "$tmp/lessons" "$tmp/questions" "$tmp/drills" "$tmp/references"
python3 - "$src" "$tmp" "$mod" <<'PY'
import sys, yaml, pathlib, re, shutil
src, tmp = map(pathlib.Path, sys.argv[1:3]); mod = sys.argv[3]
meta = yaml.safe_load((src / "course.yaml").read_text())
mods = [m for m in meta["modules"] if m["id"] == mod or m["id"].endswith("-" + mod)]
if len(mods) != 1:
    sys.exit(f"module {mod}: matches {[m['id'] for m in mods] or 'nothing'} in {[m['id'] for m in meta['modules']]}")
mid = mods[0]["id"]
meta["modules"] = mods
meta["id"] = f"{meta['id']}-{mod}"
meta["released"] = False
(tmp / "course.yaml").write_text(yaml.safe_dump(meta, allow_unicode=True, sort_keys=False))

def load(f):
    try:
        return yaml.safe_load(f.read_text()) or []
    except yaml.YAMLError as e:
        if mid in f.name or f"-{mod}" in f.name:
            sys.exit(f"{f}: YAML error: {e}")
        print(f"warning: skipped {f.relative_to(src)} (YAML error; another writer's file?)", file=sys.stderr)
        return None

lessons, topics, drill_ids = set(), set(), set()
for f in (src / "lessons").glob("*.md"):
    t = f.read_text()
    if re.search(rf"^module:\s*{re.escape(mid)}\s*$", t, re.M):
        shutil.copy(f, tmp / "lessons")
        fm = yaml.safe_load(t.split("---")[1]) or {}
        lessons.add(fm.get("id"))
        topics.update(fm.get("topics") or [])
        drill_ids.update(fm.get("drills") or [])

qs = [q for f in sorted((src / "questions").glob("*.yaml")) for q in (load(f) or []) if isinstance(q, dict) and q.get("lesson") in lessons]
(tmp / "questions" / "module.yaml").write_text(yaml.safe_dump(qs, allow_unicode=True, sort_keys=False))
ds = [d for f in sorted((src / "drills").glob("*.yaml")) if (src / "drills").exists() for d in (load(f) or []) if isinstance(d, dict) and d.get("id") in drill_ids]
(tmp / "drills" / "module.yaml").write_text(yaml.safe_dump(ds, allow_unicode=True, sort_keys=False))
cards = []
for f in sorted(src.glob("cards*.yaml")):
    mine = mid in f.name or f.name.startswith(f"cards-{mod}.") or f"-{mod}." in f.name
    cards += [c for c in (load(f) or []) if isinstance(c, dict) and (mine or c.get("topic") in topics)]
if cards:
    (tmp / "cards.yaml").write_text(yaml.safe_dump(cards, allow_unicode=True, sort_keys=False))
vocab = [v for f in sorted(src.glob("vocab*.yaml")) for v in (load(f) or []) if isinstance(v, dict) and v.get("lesson") in lessons]
if vocab:
    (tmp / "vocab.yaml").write_text(yaml.safe_dump(vocab, allow_unicode=True, sort_keys=False))
for f in src.glob("glossary*.yaml"):
    if load(f) is not None:
        shutil.copy(f, tmp)
for name in ("reading.yaml",):
    if (src / name).exists():
        shutil.copy(src / name, tmp)
for f in (src / "references").glob("*.md") if (src / "references").exists() else []:
    shutil.copy(f, tmp / "references")
if (src / "images").exists():
    shutil.copytree(src / "images", tmp / "images")
PY
python3 content/math/build.py "$tmp"
id=$(python3 -c "import yaml;print(yaml.safe_load(open('$tmp/course.yaml'))['id'])")
npx tsx tests/check-course.mts "samples/$area-drafts/$id.json"
