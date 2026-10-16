"""Build the bundled math and science courses.

Each course lives in content/math/<folder>/ and is written as YAML and Markdown:

  course.yaml          id, title, description, revision, changelog, modules: [{id, title}]
  lessons/*.md         one lesson per file: YAML front matter, then the Markdown body
  questions/*.yaml     a list of multiple-choice questions
  drills/*.yaml        a list of math drills (generated problems)
  cards.yaml           notecards: [{front, back, topic}]
  glossary.yaml        [{term, definition, aliases?, topic?}]
  references/*.md      quick-reference sheets: front matter (id, title), then Markdown

The builder wires lesson quizzes and module quizzes from the questions' `lesson` and
`module_quiz` fields, checks every cross-reference, and writes samples/math/<id>.json.

Run:  python3 content/math/build.py            (all courses)
      python3 content/math/build.py algebra    (one folder)
Then: npx tsx tests/check-course.mts samples/math/<id>.json
"""
import json, pathlib, re, sys

import yaml

ROOT = pathlib.Path(__file__).parent
OUT = ROOT.parent.parent / "samples" / "math"
# Unreleased drafts build here: outside the app bundle and not committed.
DRAFTS = ROOT.parent.parent / "samples" / "math-drafts"

ID = re.compile(r"^[A-Za-z0-9_-]{1,100}$")


class BuildError(Exception):
    pass


def load_yaml(path):
    try:
        return yaml.safe_load(path.read_text(encoding="utf-8"))
    except yaml.YAMLError as e:
        raise BuildError(f"{path}: YAML error: {e}")


def front_matter(path):
    text = path.read_text(encoding="utf-8")
    m = re.match(r"^---\s*\n(.*?)\n---\s*\n(.*)$", text, re.S)
    if not m:
        raise BuildError(f"{path}: must start with a --- front matter block ---")
    try:
        meta = yaml.safe_load(m.group(1)) or {}
    except yaml.YAMLError as e:
        raise BuildError(f"{path}: front matter YAML error: {e}")
    return meta, m.group(2).strip() + "\n"


def listing(folder, pattern):
    d = folder
    return sorted(d.glob(pattern)) if d.exists() else []


def build(folder: pathlib.Path):
    errors = []
    meta = load_yaml(folder / "course.yaml")
    cid = meta["id"]
    modules = meta["modules"]
    module_ids = [m["id"] for m in modules]

    # Lessons
    lessons = []
    for f in listing(folder / "lessons", "*.md"):
        fm, body = front_matter(f)
        for k in ("id", "module", "title"):
            if not fm.get(k):
                errors.append(f"{f.name}: front matter needs '{k}'")
        if fm.get("module") not in module_ids:
            errors.append(f"{f.name}: module '{fm.get('module')}' isn't in course.yaml")
        lessons.append({
            "id": fm.get("id"),
            "module": fm.get("module"),
            "title": fm.get("title"),
            "minutes": fm.get("minutes", 20),
            "topics": fm.get("topics", []),
            "drills": fm.get("drills") or None,
            "refs": fm.get("refs") or None,
            "body": body,
            "_file": f.name,
        })
    lesson_ids = [l["id"] for l in lessons]
    lesson_by_id = {l["id"]: l for l in lessons}

    # Questions
    questions = []
    for f in listing(folder / "questions", "*.yaml"):
        data = load_yaml(f) or []
        if not isinstance(data, list):
            errors.append(f"{f.name}: must be a YAML list of questions")
            continue
        for q in data:
            q["_file"] = f.name
            questions.append(q)
    qids = set()
    for q in questions:
        where = f"{q['_file']} {q.get('id')}"
        if not q.get("id") or not ID.match(str(q["id"])):
            errors.append(f"{where}: bad or missing id")
        if q.get("id") in qids:
            errors.append(f"{where}: duplicate question id")
        qids.add(q.get("id"))
        if q.get("lesson") not in lesson_by_id:
            errors.append(f"{where}: lesson '{q.get('lesson')}' doesn't exist")
        ch = q.get("choices") or []
        if len(ch) < 2:
            errors.append(f"{where}: needs at least 2 choices")
        if len(set(map(str, ch))) != len(ch):
            errors.append(f"{where}: duplicate choices")
        ans = q.get("answer")
        ans = ans if isinstance(ans, list) else [ans]
        if not ans or any(not isinstance(a, int) or a < 0 or a >= len(ch) for a in ans):
            errors.append(f"{where}: answer must be choice index/indices (0-based)")
        if not q.get("stem"):
            errors.append(f"{where}: missing stem")
        if not q.get("explanation"):
            errors.append(f"{where}: missing explanation")
        q["answer"] = ans

    # Drills
    drills = []
    for f in listing(folder / "drills", "*.yaml"):
        data = load_yaml(f) or []
        for d in data:
            d.setdefault("answer", "")
            d.setdefault("format", "number")
            drills.append(d)
    dids = [d.get("id") for d in drills]
    for d in drills:
        if not d.get("id") or not ID.match(str(d["id"])):
            errors.append(f"drill {d.get('title')}: bad or missing id")
        for k in ("title", "prompt", "solution"):
            if not d.get(k):
                errors.append(f"drill {d.get('id')}: missing {k}")
        if not d.get("answers") and not d.get("answer"):
            errors.append(f"drill {d.get('id')}: needs 'answers'")
    if len(set(dids)) != len(dids):
        errors.append("duplicate drill ids: " + ", ".join(sorted({x for x in dids if dids.count(x) > 1})))

    # References
    refs = []
    for f in listing(folder / "references", "*.md"):
        fm, body = front_matter(f)
        refs.append({"id": fm.get("id"), "title": fm.get("title"), "body": body})
    ref_ids = {r["id"] for r in refs}

    for l in lessons:
        for d in l["drills"] or []:
            if d not in dids:
                errors.append(f"{l['_file']}: drill '{d}' doesn't exist")
        for r in l["refs"] or []:
            if r not in ref_ids:
                errors.append(f"{l['_file']}: reference '{r}' doesn't exist")

    # Quizzes from tags
    for l in lessons:
        l["quiz"] = [q["id"] for q in questions if q.get("lesson") == l["id"]]
        if not l["quiz"]:
            errors.append(f"{l['_file']}: no questions have lesson: {l['id']}")
    for m in modules:
        mls = [l["id"] for l in lessons if l["module"] == m["id"]]
        if not mls:
            errors.append(f"module {m['id']}: has no lessons")
        m["quiz"] = [q["id"] for q in questions if q.get("lesson") in mls and q.get("module_quiz")]
        for lid in mls:
            if not any(q.get("lesson") == lid and q.get("module_quiz") for q in questions):
                errors.append(f"lesson {lid}: needs at least one question with module_quiz: true")

    if len(set(lesson_ids)) != len(lesson_ids):
        errors.append("duplicate lesson ids")

    if errors:
        raise BuildError(f"{folder.name}: {len(errors)} problem(s):\n  " + "\n  ".join(errors))

    # cards.yaml / glossary.yaml, plus any cards-*.yaml / glossary-*.yaml split files.
    cards = [c for f in sorted(folder.glob("cards*.yaml")) for c in (load_yaml(f) or [])]
    glossary = [g for f in sorted(folder.glob("glossary*.yaml")) for g in (load_yaml(f) or [])]

    # Bolded glossary terms become pop-up links: **slope** -> **[[slope]]**.
    names = {}
    for g in glossary or []:
        for n in [g["term"], *(g.get("aliases") or [])]:
            names.setdefault(str(n).strip().lower(), True)

    def link_bold(md):
        def rep(m):
            t = m.group(1)
            if "$" in t or "[[" in t or t.strip().lower() not in names:
                return m.group(0)
            return f"**[[{t}]]**"
        parts = re.split(r"(```[\s\S]*?```)", md)
        return "".join(p if p.startswith("```") else re.sub(r"\*\*([^*\n]+?)\*\*", rep, p) for p in parts)

    for l in lessons:
        l["body"] = link_bold(l["body"])

    module_of = {l["id"]: l["module"] for l in lessons}
    bank_questions = []
    for q in questions:
        out = {
            "id": q["id"],
            "section": module_of[q["lesson"]],
            "topic": q.get("topic") or lesson_by_id[q["lesson"]]["title"],
            "stem": q["stem"],
            "choices": [str(c) for c in q["choices"]],
            "answer": q["answer"],
            "explanation": q["explanation"],
        }
        bank_questions.append(out)

    for l in lessons:
        del l["_file"]
        for k in ("drills", "refs"):
            if not l[k]:
                del l[k]

    exam_n = min(50, len(bank_questions))
    course = {
        "format": "examiner-course",
        "version": 1,
        "id": cid,
        "title": meta["title"],
        "description": meta.get("description", ""),
        "author": "Examiner",
        "revision": meta.get("revision", 1),
        "changelog": meta.get("changelog"),
        "modules": modules,
        "lessons": lessons,
        "banks": [{
            "id": f"{cid}-bank",
            "title": f"{meta['title']} questions",
            "sections": [{"id": m["id"], "name": m["title"]} for m in modules],
            "exam": {"questionCount": exam_n, "timeLimitMinutes": max(30, round(exam_n * 1.8)), "passingPercent": 70},
            "questions": bank_questions,
        }],
        "decks": [{"id": f"{cid}-cards", "title": f"{meta['title']} notecards",
                   "cards": [{"id": f"c{i + 1}", **c} for i, c in enumerate(cards or [])]}],
        "glossary": glossary or [],
        "references": refs,
        "drills": drills,
    }
    if not course["changelog"]:
        del course["changelog"]
    dest = OUT if meta.get("released") else DRAFTS
    dest.mkdir(parents=True, exist_ok=True)
    path = dest / f"{cid}.json"
    (DRAFTS if dest is OUT else OUT).joinpath(f"{cid}.json").unlink(missing_ok=True)
    path.write_text(json.dumps(course, indent=1, ensure_ascii=False), encoding="utf-8")
    return path, {"lessons": len(lessons), "questions": len(bank_questions), "drills": len(drills),
                  "cards": len(cards or []), "terms": len(glossary or []), "refs": len(refs)}


def main():
    names = sys.argv[1:]
    folders = [ROOT / n for n in names] if names else sorted(p for p in ROOT.iterdir() if (p / "course.yaml").exists())
    failed = False
    for f in folders:
        try:
            path, counts = build(f)
            print(f"{f.name}: " + ", ".join(f"{v} {k}" for k, v in counts.items()) + f" -> {path.relative_to(ROOT.parent.parent)}")
        except BuildError as e:
            failed = True
            print(e, file=sys.stderr)
    write_manifest()
    sys.exit(1 if failed else 0)


def write_manifest():
    """samples/math-index.json lists the bundled courses (id, title, revision) for the app.

    Only courses marked `released: true` in course.yaml ship; drafts are built but not bundled.
    They're listed in `order` (course.yaml), then by folder name.
    """
    items = []
    for folder in sorted(p for p in ROOT.iterdir() if (p / "course.yaml").exists()):
        meta = load_yaml(folder / "course.yaml")
        if not meta.get("released"):
            continue
        out = OUT / f"{meta['id']}.json"
        if not out.exists():
            continue
        c = json.loads(out.read_text(encoding="utf-8"))
        items.append((meta.get("order", 999), folder.name, {"id": c["id"], "title": c["title"], "revision": c.get("revision", 1)}))
    items.sort(key=lambda t: (t[0], t[1]))
    (OUT.parent / "math-index.json").write_text(json.dumps([t[2] for t in items], indent=1, ensure_ascii=False) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
