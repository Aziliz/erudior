"""Build the bundled courses (math and science in content/math, languages in content/languages).

Each course lives in content/<area>/<folder>/ and is written as YAML and Markdown:

  course.yaml          id, title, description, revision, changelog, modules: [{id, title}]
  lessons/*.md         one lesson per file: YAML front matter, then the Markdown body
  questions/*.yaml     a list of questions (choice, text, match, label, order; see AUTHORING.md)
  images/*             pictures for lessons and questions, embedded in the course file
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
import base64, json, pathlib, re, sys

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


IMAGE_TYPES = {".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif"}
MAX_IMAGE = 400_000


def embed_image(folder, src, errors, where):
    """A course image (path relative to the course folder, e.g. images/cell.svg) as a data: URL."""
    if str(src).startswith("data:"):
        return src
    if re.match(r"^[a-z]+:", str(src)):
        errors.append(f"{where}: image '{src}' must be a file in the course's images/ folder (web images don't load in the app)")
        return src
    f = (folder / str(src)).resolve()
    if folder.resolve() not in f.parents or not f.exists():
        errors.append(f"{where}: image file '{src}' not found")
        return src
    kind = IMAGE_TYPES.get(f.suffix.lower())
    if not kind:
        errors.append(f"{where}: image '{src}' must be .svg, .png, .jpg, .webp or .gif")
        return src
    data = f.read_bytes()
    if len(data) > MAX_IMAGE:
        errors.append(f"{where}: image '{src}' is {len(data) // 1000} KB; keep images under {MAX_IMAGE // 1000} KB")
    if kind == "image/svg+xml" and re.search(rb"<script|\son[a-z]+\s*=|<foreignObject|href=\"(?!#)", data):
        errors.append(f"{where}: SVG '{src}' has scripts, event handlers, foreignObject or outside links")
    return f"data:{kind};base64,{base64.b64encode(data).decode()}"


# The alt text runs to the first "](": it may hold brackets ("domain [−2, 4)", "E[Y given X]").
MD_IMAGE = re.compile(r"!\[([^\n]*?)\]\(([^)\s]+)((?:\s+\"[^\"]*\")?)\)")


def embed_md_images(folder, md, errors, where):
    def rep(m):
        if not m.group(1).strip():
            errors.append(f"{where}: image '{m.group(2)}' needs alt text: ![what it shows](...)")
        # Brackets become HTML entities so Markdown keeps the whole alt text, even an unbalanced
        # "[−2, 4)" (a backslash escape would read as TeX \[ … \] display math).
        alt = m.group(1).replace("[", "&#91;").replace("]", "&#93;")
        return f"![{alt}]({embed_image(folder, m.group(2), errors, where)}{m.group(3)})"
    return MD_IMAGE.sub(rep, md)


BLANK = re.compile(r"_{3,}")
MERMAID = re.compile(r"```mermaid[ \t]*\n([\s\S]*?)```")


def uniq(xs):
    seen = []
    for x in xs:
        if x not in seen:
            seen.append(x)
    return seen


def question_kind(folder, q, where, errors):
    """Check a question's type-specific fields; return the fields for the course JSON."""
    t = q.get("type", "choice")
    out = {}
    img = q.get("image")
    if img is not None:
        if isinstance(img, str):
            img = {"src": img}
        if not isinstance(img, dict) or not img.get("src"):
            errors.append(f"{where}: image needs a src")
        else:
            if not str(img.get("alt") or "").strip():
                errors.append(f"{where}: image needs alt text (describe what it shows)")
            out["image"] = {"src": embed_image(folder, img["src"], errors, where), "alt": unwrap(str(img.get("alt") or "")),
                            **({"caption": unwrap(str(img["caption"]))} if img.get("caption") else {})}
    if t == "choice":
        ch = q.get("choices") or []
        if len(ch) < 2:
            errors.append(f"{where}: needs at least 2 choices")
        if len(set(map(str, ch))) != len(ch):
            errors.append(f"{where}: duplicate choices")
        ans = q.get("answer")
        ans = ans if isinstance(ans, list) else [ans]
        if not ans or any(not isinstance(a, int) or a < 0 or a >= len(ch) for a in ans):
            errors.append(f"{where}: answer must be choice index/indices (0-based)")
        elif len(set(ans)) != len(ans):
            errors.append(f"{where}: answer lists the same choice twice")
        return {**out, "choices": [unwrap(str(c)) for c in ch], "answer": sorted(a for a in ans if isinstance(a, int))}
    if t == "text":
        acc = q.get("accept")
        blanks = len(BLANK.findall(str(q.get("stem", ""))))
        if isinstance(acc, list) and acc and all(not isinstance(a, list) for a in acc):
            acc = [acc] if blanks <= 1 else [[a] for a in acc]
        if not isinstance(acc, list) or not acc or any(not isinstance(a, list) or not a for a in acc):
            errors.append(f"{where}: text questions need accept: a list of accepted answers (a list per blank)")
            acc = [["?"]]
        acc = [[str(x) for x in a] for a in acc]
        if blanks > 1 and blanks != len(acc):
            errors.append(f"{where}: {blanks} blanks (___) but {len(acc)} accept lists")
        if blanks <= 1 and len(acc) > 1:
            errors.append(f"{where}: {len(acc)} accept lists but one blank; mark each blank with ___")
        return {**out, "type": "text", "choices": [], "answer": [], "accept": acc, **({"caseSensitive": True} if q.get("caseSensitive") else {}), **({"lowestTerms": True} if q.get("lowestTerms") else {})}
    if t == "match":
        pairs = q.get("pairs") or []
        if len(pairs) < 2 or any(not isinstance(p, list) or len(p) != 2 for p in pairs):
            errors.append(f"{where}: match questions need pairs: [[left, right], ...] (at least 2)")
            pairs = [["?", "?"], ["?!", "?!"]]
        left = [unwrap(str(p[0])) for p in pairs]
        if len(set(left)) != len(left):
            errors.append(f"{where}: the same left item twice")
        choices = uniq([unwrap(str(p[1])) for p in pairs] + [unwrap(str(d)) for d in q.get("distractors") or []])
        if len(choices) < 2:
            errors.append(f"{where}: needs at least 2 different answers to choose from")
        return {**out, "type": "match", "left": left, "choices": choices, "answer": [choices.index(unwrap(str(p[1]))) for p in pairs]}
    if t == "label":
        labels = q.get("labels") or []
        if "image" not in out:
            errors.append(f"{where}: label questions need an image")
        if len(labels) < 2 or any(not isinstance(l, dict) or "text" not in l for l in labels):
            errors.append(f"{where}: label questions need labels: [{{x, y, text}}, ...] (at least 2)")
            labels = [{"x": 0, "y": 0, "text": "?"}, {"x": 0, "y": 0, "text": "?!"}]
        for l in labels:
            if not all(isinstance(l.get(k), (int, float)) and 0 <= l.get(k) <= 100 for k in ("x", "y")):
                errors.append(f"{where}: label '{l.get('text')}' needs x and y in percent (0-100)")
        choices = uniq([unwrap(str(l["text"])) for l in labels] + [unwrap(str(d)) for d in q.get("distractors") or []])
        return {**out, "type": "label", "markers": [{"x": l.get("x", 0), "y": l.get("y", 0)} for l in labels],
                "choices": choices, "answer": [choices.index(unwrap(str(l["text"]))) for l in labels]}
    if t == "order":
        items = [unwrap(str(i)) for i in q.get("items") or []]
        if len(items) < 3:
            errors.append(f"{where}: order questions need items: at least 3, listed in the correct order")
        if len(set(items)) != len(items):
            errors.append(f"{where}: the same item twice")
        return {**out, "type": "order", "choices": items, "answer": []}
    errors.append(f"{where}: unknown type '{t}' (choice, text, match, label or order)")
    return {**out, "choices": [], "answer": []}


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


def previous_cards(folder, cid):
    """Cards in the last build of this course (released or draft), to keep their ids stable."""
    for d in out_dirs(folder):
        f = d / f"{cid}.json"
        if f.exists():
            try:
                return [c for deck in json.loads(f.read_text(encoding="utf-8")).get("decks", []) for c in deck.get("cards", [])]
            except (ValueError, OSError):
                pass
    return []


def card_ids(cards, previous):
    """Give each card the id it had last build (matched by front, then back), so learners' card
    progress survives new cards being added anywhere; new cards get the next free numbers."""
    by_front, by_back = {}, {}
    for c in previous:
        by_front.setdefault(str(c.get("front")), []).append(c["id"])
        by_back.setdefault(str(c.get("back")), []).append(c["id"])
    used = set()
    nums = [int(i[1:]) for i in (c["id"] for c in previous) if i[1:].isdigit()]
    nxt = max(nums, default=0) + 1
    out = []
    for c in cards:
        cid = next((i for i in by_front.get(str(c.get("front")), []) + by_back.get(str(c.get("back")), []) if i not in used), None)
        if cid is None:
            cid = f"c{nxt}"
            nxt += 1
        used.add(cid)
        out.append({"id": cid, **c})
    return out


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
        honors = bool(fm.get("honors")) or any(m["id"] == fm.get("module") and m.get("honors") for m in modules)
        body = embed_md_images(folder, body, errors, f.name)
        for d in MERMAID.findall(body):
            if not re.search(r"^\s*accTitle\s*:", d, re.M) or not re.search(r"^\s*accDescr\s*[:{]", d, re.M):
                errors.append(f"{f.name}: mermaid diagram needs accTitle: and accDescr: lines")
        lessons.append({
            "id": fm.get("id"),
            "module": fm.get("module"),
            "title": fm.get("title"),
            **({"honors": True} if honors else {}),
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
        if not q.get("stem"):
            errors.append(f"{where}: missing stem")
        if not q.get("explanation"):
            errors.append(f"{where}: missing explanation")
        q["_kind"] = question_kind(folder, q, where, errors)

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
        refs.append({"id": fm.get("id"), "title": fm.get("title"), "body": embed_md_images(folder, body, errors, f.name)})
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
        # Honors lessons are optional, so a core module's quiz leaves them out.
        core = mls if m.get("honors") else [l["id"] for l in lessons if l["module"] == m["id"] and not l.get("honors")]
        if mls and not core:
            errors.append(f"module {m['id']}: only honors lessons; mark the module honors: true in course.yaml")
        m["quiz"] = [q["id"] for q in questions if q.get("lesson") in core and q.get("module_quiz")]
        for lid in core:
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
            **q["_kind"],
            "explanation": unwrap(q["explanation"]),
            **({"honors": True} if lesson_by_id[q["lesson"]].get("honors") else {}),
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
        **({"disclaimer": meta["disclaimer"]} if meta.get("disclaimer") else {}),
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
                   "cards": card_ids(cards, previous_cards(folder, cid))}] if cards else [],
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
            **({"disclaimer": c["disclaimer"]} if c.get("disclaimer") else {}),
            "subject": subject, "level": level, "type": kind,
            # Core lessons; honors lessons (optional) are counted separately.
            "lessons": sum(1 for l in c.get("lessons", []) if not l.get("honors")),
            **({"honors": sum(1 for l in c.get("lessons", []) if l.get("honors"))} if any(l.get("honors") for l in c.get("lessons", [])) else {}),
            "questions": sum(len(b.get("questions", [])) for b in c.get("banks", [])),
            "cards": sum(len(d.get("cards", [])) for d in c.get("decks", [])),
            "drills": len(c.get("drills", [])),
            **({"words": len(c["vocab"])} if c.get("vocab") else {}),
            **({"carried": sum(1 for v in c["vocab"] if v.get("from"))} if any(v.get("from") for v in c.get("vocab", [])) else {}),
            **({"requires": c["requires"]} if c.get("requires") else {}),
            # Core lessons (finishing them finishes the course); honors lessons are optional.
            "lessonIds": [l.get("id") for l in c.get("lessons", []) if not l.get("honors")],
            **({"honorsLessonIds": [l["id"] for l in c.get("lessons", []) if l.get("honors")],
                "honorsModuleIds": [m["id"] for m in c.get("modules", []) if m.get("honors")]}
               if any(l.get("honors") for l in c.get("lessons", [])) else {}),
            # Lesson plan for the catalog's Overview page (titles only).
            "outline": [
                {"title": m.get("title", ""),
                 "lessons": [l.get("title", "") for l in c.get("lessons", []) if l.get("module") == m.get("id") and not l.get("honors")],
                 **({"honors": [l.get("title", "") for l in c.get("lessons", []) if l.get("module") == m.get("id") and l.get("honors")]}
                    if any(l.get("module") == m.get("id") and l.get("honors") for l in c.get("lessons", [])) else {}),
                 **({"isHonors": True} if m.get("honors") else {})}
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
    write_sitemap(items)


def write_sitemap(items):
    """public/sitemap.xml for search engines: the site's pages and each course's overview on
    app.erudior.com (same slugs as lib/util.ts slugify; one Search Console domain property covers both)."""
    def slug(t):
        s = re.sub(r"[^a-z0-9]+", "-", t.lower()).strip("-")[:60]
        return s or "bank"
    urls = [f"https://erudior.com{p}" for p in ("/", "/roadmap", "/download", "/terms", "/privacy")]
    urls += [f"https://app.erudior.com/{slug(e['title'])}" for e in items]
    body = "".join(f"  <url><loc>{u}</loc></url>\n" for u in urls)
    (ROOT.parent.parent / "public" / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + body + "</urlset>\n",
        encoding="utf-8")


if __name__ == "__main__":
    main()
