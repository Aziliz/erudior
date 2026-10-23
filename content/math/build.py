"""Build the bundled courses (math and science in content/math, languages in content/languages).

Each course lives in content/<area>/<folder>/ and is written as YAML and Markdown:

  course.yaml          id, title, description, revision, changelog, modules: [{id, title}]
  lessons/*.md         one lesson per file: YAML front matter, then the Markdown body
  questions/*.yaml     a list of multiple-choice questions
  drills/*.yaml        a list of math drills (generated problems)
  cards.yaml           notecards: [{front, back, topic}]
  glossary.yaml        [{term, definition, aliases?, topic?}]
  references/*.md      quick-reference sheets: front matter (id, title), then Markdown

Language courses add:
  course.yaml language: {code, name, tts, keys, ime?, level, vocabTarget, vocabSource}
  vocab*.yaml          [{id, lesson, term, meanings, pos?, plural?, alt?, example?, exampleEn?, note?, kind?, reading?}]
  reading.yaml         [{title, author?, publisher?, level?, url?, isbn?, free?, note?}]

The builder wires lesson quizzes and module quizzes from the questions' `lesson` and
`module_quiz` fields, checks every cross-reference, and writes samples/math/<id>.json.

Run:  python3 content/math/build.py            (all courses)
      python3 content/math/build.py algebra    (one folder)
Then: npx tsx tests/check-course.mts samples/math/<id>.json
"""
import json, pathlib, re, sys

import yaml

ROOT = pathlib.Path(__file__).parent
# Course areas: content/<area>/ builds to samples/<area>/.
AREAS = [ROOT, ROOT.parent / "languages"]
SAMPLES = ROOT.parent.parent / "samples"
OUT = SAMPLES / "math"
# Unreleased drafts build to samples/<area>-drafts: outside the app bundle and not committed.
DRAFTS = SAMPLES / "math-drafts"


def folder_for_id(cid):
    return next((f for f in course_folders() if (load_yaml(f / "course.yaml") or {}).get("id") == cid), None)


def course_vocab(folder):
    """A course's full word list: words carried from the courses it requires, then its own."""
    meta = load_yaml(folder / "course.yaml") or {}
    out = []
    for rid in meta.get("requires") or []:
        rf = folder_for_id(rid)
        if rf:
            out += [{**v, "from": v.get("from") or rid} for v in course_vocab(rf)]
    return out + [v for f in sorted(folder.glob("vocab*.yaml")) for v in (load_yaml(f) or [])]


def out_dirs(folder: pathlib.Path):
    area = folder.parent.name
    return SAMPLES / area, SAMPLES / f"{area}-drafts"


def course_folders():
    return [p for a in AREAS if a.exists() for p in sorted(a.iterdir()) if (p / "course.yaml").exists()]

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


LIST_START = re.compile(r"^\s*(?:[-*•]|\d+[.)]|Step\s+\d|\(?[a-d]\)\s)")


def unwrap(text):
    """Join hard-wrapped lines in plain-text fields (questions render line breaks as-is).

    A line break is a soft wrap when the line before it is long (>= 60 chars) and the
    next line doesn't start a list item or step; short lines and blank lines are kept.
    """
    if "\n" not in text:
        return text
    out = []
    for line in text.split("\n"):
        if out and out[-1].strip() and line.strip() and len(out[-1]) >= 60 and not LIST_START.match(line):
            out[-1] = out[-1].rstrip() + " " + line.lstrip()
        else:
            out.append(line)
    return "\n".join(out)


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

    # Language courses: vocabulary and reading list.
    language = meta.get("language")
    vocab = [v for f in sorted(folder.glob("vocab*.yaml")) for v in (load_yaml(f) or [])]
    # Words from the courses this one requires (e.g. A1 inside A2) come first, tagged `from`.
    carried = []
    for rid in meta.get("requires") or []:
        rf = folder_for_id(rid)
        if not rf:
            errors.append(f"requires: no course with id {rid}")
            continue
        carried += [{**v, "from": v.get("from") or rid} for v in course_vocab(rf)]
    vocab = carried + vocab
    reading = load_yaml(folder / "reading.yaml") if (folder / "reading.yaml").exists() else []
    vids, terms, prompts = set(), {}, {}
    for v in vocab:
        where = f"vocab {v.get('id') or v.get('term')}"
        if not ID.match(str(v.get("id", ""))):
            errors.append(f"{where}: bad or missing id")
        elif v["id"] in vids:
            errors.append(f"{where}: duplicate id" + (" (already in an earlier course: reuse it, don't re-add it)" if any(c["id"] == v["id"] for c in carried) else ""))
        vids.add(v.get("id"))
        if not v.get("from") and v.get("lesson") not in lesson_by_id:
            errors.append(f"{where}: lesson '{v.get('lesson')}' doesn't exist")
        if not v.get("term") or not v.get("meanings"):
            errors.append(f"{where}: needs term and meanings")
        if v.get("pos") == "noun" and language and language.get("code") == "de" and not re.match(r"^(der|die|das) ", v.get("term", "")):
            errors.append(f"{where}: German nouns need der/die/das in the term")
        key = (v.get("term"), v.get("pos"))
        if key in terms:
            errors.append(f"{where}: same term and part of speech as {terms[key]}" + (" (from an earlier course)" if any(c["id"] == terms[key] for c in carried) else ""))
        terms[key] = v.get("id")
        first = str((v.get("meanings") or [""])[0]).strip().lower()
        if first in prompts:
            errors.append(f"{where}: first meaning '{first}' is also {prompts[first]}'s; add a note in parentheses so the English prompt has one answer")
        prompts[first] = v.get("id")
        if not isinstance(v.get("meanings"), list):
            errors.append(f"{where}: meanings must be a list")
        elif any(not isinstance(m, str) for m in v["meanings"]):
            errors.append(f"{where}: every meaning must be text (quote it: 'true', 'blanket (also: ceiling)')")
        for k in ("term", "plural", "example", "exampleEn", "note"):
            if k in v and v[k] is not None and not isinstance(v[k], str):
                errors.append(f"{where}: {k} must be text (quote it)")
    if vocab and not language:
        errors.append("vocab*.yaml needs a language: block in course.yaml")
    for r in reading or []:
        if not r.get("title"):
            errors.append(f"reading.yaml: entry without a title")

    if errors:
        raise BuildError(f"{folder.name}: {len(errors)} problem(s):\n  " + "\n  ".join(errors))

    # cards.yaml / glossary.yaml, plus any cards-*.yaml / glossary-*.yaml split files.
    cards = [c for f in sorted(folder.glob("cards*.yaml")) for c in (load_yaml(f) or [])]
    glossary = [g for f in sorted(folder.glob("glossary*.yaml")) for g in (load_yaml(f) or [])]
    names = {}
    # Language courses are written by several writers per module, so catch repeated terms
    # (math courses deliberately share symbol aliases such as Ω for ohm and ω).
    for g in glossary if meta.get("language") else []:
        for n in {str(x).strip().lower() for x in [g.get("term", "")] + list(g.get("aliases") or [])}:
            if n in names and names[n] != g.get("term"):
                raise BuildError(f"{folder.name}: glossary term or alias '{n}' is defined twice ({names[n]} / {g.get('term')})")
            names[n] = g.get("term")

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
            "stem": unwrap(q["stem"]),
            "choices": [unwrap(str(c)) for c in q["choices"]],
            "answer": q["answer"],
            "explanation": unwrap(q["explanation"]),
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
        "author": "Erudior",
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
                   "cards": [{"id": f"c{i + 1}", **c} for i, c in enumerate(cards)]}] if cards else [],
        "glossary": glossary or [],
        "references": refs,
        "drills": drills,
    }
    if not course["changelog"]:
        del course["changelog"]
    if language:
        course["language"] = language
    if meta.get("requires"):
        course["requires"] = meta["requires"]
    if vocab:
        course["vocab"] = [{k: unwrap(x) if isinstance(x, str) and k in ("note",) else x for k, x in v.items()} for v in vocab]
    if reading:
        course["readingList"] = reading
    out, drafts = out_dirs(folder)
    dest = out if meta.get("released") else drafts
    dest.mkdir(parents=True, exist_ok=True)
    path = dest / f"{cid}.json"
    (drafts if dest is out else out).joinpath(f"{cid}.json").unlink(missing_ok=True)
    path.write_text(json.dumps(course, indent=1, ensure_ascii=False), encoding="utf-8")
    return path, {"lessons": len(lessons), "questions": len(bank_questions), "drills": len(drills),
                  "cards": len(cards or []), "terms": len(glossary or []), "refs": len(refs),
                  **({"words": len(vocab) - len(carried), "carried words": len(carried), "readings": len(reading or [])} if vocab else {})}


def main():
    names = sys.argv[1:]
    def find(n):
        if (pathlib.Path(n) / "course.yaml").exists():
            return pathlib.Path(n).resolve()
        hits = [a / n for a in AREAS if (a / n / "course.yaml").exists()]
        if not hits:
            sys.exit(f"no course folder named {n}")
        return hits[0]
    folders = [find(n) for n in names] if names else course_folders()
    failed = False
    for f in folders:
        try:
            path, counts = build(f)
            print(f"{f.name}: " + ", ".join(f"{v} {k}" for k, v in counts.items()) + f" -> {path.relative_to(SAMPLES.parent)}")
        except BuildError as e:
            failed = True
            print(e, file=sys.stderr)
    write_manifest()
    sys.exit(1 if failed else 0)


def write_manifest():
    """samples/catalog.json lists every course that ships with the app, for the course catalog.

    Math/science courses marked `released: true` in course.yaml are listed by `order`; other
    bundled courses (e.g. the real estate course) come from content/catalog-extra.json.
    Each entry has what the catalog shows without loading the course: title, description,
    subject, level, type and counts. `file` is the course JSON, relative to samples/.
    """
    def entry(c, file, order, subject, level, kind):
        return {
            "id": c["id"], "file": file, "order": order, "title": c["title"],
            "description": c.get("description", ""), "revision": c.get("revision", 1),
            "subject": subject, "level": level, "type": kind,
            "lessons": len(c.get("lessons", [])),
            "questions": sum(len(b.get("questions", [])) for b in c.get("banks", [])),
            "cards": sum(len(d.get("cards", [])) for d in c.get("decks", [])),
            "drills": len(c.get("drills", [])),
            **({"words": len(c["vocab"])} if c.get("vocab") else {}),
            **({"carried": sum(1 for v in c["vocab"] if v.get("from"))} if any(v.get("from") for v in c.get("vocab", [])) else {}),
            **({"requires": c["requires"]} if c.get("requires") else {}),
            "lessonIds": [l.get("id") for l in c.get("lessons", [])],
            # Lesson plan for the catalog's Overview page (titles only).
            "outline": [
                {"title": m.get("title", ""), "lessons": [l.get("title", "") for l in c.get("lessons", []) if l.get("module") == m.get("id")]}
                for m in c.get("modules", [])
            ],
        }

    items = []
    for folder in course_folders():
        meta = load_yaml(folder / "course.yaml")
        if not meta.get("released"):
            continue
        out = out_dirs(folder)[0] / f"{meta['id']}.json"
        if not out.exists():
            continue
        c = json.loads(out.read_text(encoding="utf-8"))
        items.append(entry(c, f"{folder.parent.name}/{out.name}", meta.get("order", 999), meta.get("subject", "Math"),
                           meta.get("level") or [], meta.get("type") or ["Course"]))
    extra = ROOT.parent / "catalog-extra.json"
    for x in json.loads(extra.read_text(encoding="utf-8")) if extra.exists() else []:
        c = json.loads((OUT.parent / x["file"]).read_text(encoding="utf-8"))
        items.append(entry(c, x["file"], x.get("order", 999), x["subject"], x["level"], x["type"]))
    items.sort(key=lambda e: (e["order"], e["title"]))
    (OUT.parent / "catalog.json").write_text(json.dumps(items, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    (OUT.parent / "math-index.json").unlink(missing_ok=True)


if __name__ == "__main__":
    main()
