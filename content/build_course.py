"""Assemble the Colorado broker course pack from the reviewed parts."""
import json, glob, re, collections, pathlib

ROOT = pathlib.Path(__file__).parent
OUT = ROOT.parent / "samples" / "colorado-broker-course.json"

MODULES = [
    ("m1-property", "Real property, land use and title", "n1", "Property, ownership and title"),
    ("m2-money", "Valuation, financing and math", "n2", "Valuation, financing and math"),
    ("m3-contracts", "Contracts and property disclosures", "n3", "Contracts and disclosures"),
    ("m4-practice", "Agency, practice and property management", "n4", "Agency, fair housing and management"),
    ("m5-co-license", "Colorado license law and the Commission", "s1", "Colorado license law"),
    ("m6-co-relationships", "Colorado brokerage relationships and trust accounts", "s2", "Colorado relationships and trust accounts"),
    ("m7-co-contracts", "Colorado contracts and forms", "s3", "Colorado contracts and forms"),
    ("m8-co-closing", "Colorado closings and special topics", "s4", "Colorado closings and special topics"),
]

REFS = [
    ("exam", "The exam at a glance", "01-exam.md"),
    ("math", "Math formulas", "02-math.md"),
    ("co-numbers", "Colorado numbers and deadlines", "03-co-numbers.md"),
    ("relationships", "Brokerage relationships", "04-relationships.md"),
    ("forms", "Colorado forms map", "05-forms.md"),
    ("federal", "Federal laws and fair housing", "06-federal.md"),
    ("property", "Ownership, estates and deeds", "07-property.md"),
]

# Gap-fill parts (added after comparing against the Van Ed 168-hour course). Each part's
# lessons carry their own module id; cards go to the deck of the base part named here,
# except g5, whose cards split by topic between the s1 and s2 decks.
GAPS = {"g1": "n2", "g2": "n4", "g3": "s4", "g4": "s3", "g5": "s1"}
GAP_DRILLS = ["g3-drills.json"]
# Extra question parts. f1-f4 were written to pad lesson quizzes (their "quiz" maps are
# no longer used); h1-h8 were written to cover lesson points no other question covered.
FILLS = ["f1", "f2", "f3", "f4"]
COVER = ["h1", "h2", "h3", "h4", "h5", "h6", "h7", "h8"]

parts = {p.stem: json.loads(p.read_text()) for p in sorted((ROOT / "parts").glob("*.json")) if p.stem in {m[2] for m in MODULES} | set(GAPS) | set(FILLS) | set(COVER)}

modules, lessons, questions, decks = [], [], [], []
glossary: dict[str, dict] = {}
def merge_glossary(part, state):
    for g in part["glossary"]:
        k = g["term"].strip().lower()
        if k in glossary:
            old = glossary[k]
            # Prefer the Colorado writer's definition (Colorado-accurate), else keep the first.
            if state and not old.get("_state"):
                merged = {**g, "_state": True}
            else:
                merged = dict(old)
            merged["aliases"] = sorted({*old.get("aliases", []), *g.get("aliases", [])} - {merged["term"]})
            glossary[k] = merged
        else:
            glossary[k] = {**g, "_state": state}

deck_of = {}
for mid, mtitle, key, deck_title in MODULES:
    part = parts[key]
    modules.append({"id": mid, "title": mtitle})
    for l in part["lessons"]:
        lessons.append({**l, "module": mid})
    questions += part["questions"]
    deck = {
        "id": f"deck-{key}",
        "title": deck_title,
        "description": "National portion" if key.startswith("n") else "Colorado state portion",
        "cards": list(part["cards"]),
    }
    decks.append(deck)
    deck_of[key] = deck
    merge_glossary(part, key.startswith("s"))

for key, base in GAPS.items():
    part = parts[key]
    state = base.startswith("s")
    module_ids = {m["id"] for m in modules}
    for l in part["lessons"]:
        assert l["module"] in module_ids, (key, l["id"], l["module"])
    # Put each gap lesson right after the last existing lesson of its module.
    for l in part["lessons"]:
        idx = max(i for i, x in enumerate(lessons) if x["module"] == l["module"])
        lessons.insert(idx + 1, l)
    questions += part["questions"]
    for c in part["cards"]:
        target = "s2" if key == "g5" and c.get("topic") == "Trust accounts and records" else base
        deck_of[target]["cards"].append(c)
    merge_glossary(part, state)

for key in FILLS + COVER:
    if key in parts:
        questions += parts[key]["questions"]
qids = {q["id"] for q in questions}

# Lesson and module quizzes come from the coverage maps in content/quizzes/<module>.json:
# each lesson's teaching points mapped to questions answerable from that lesson alone
# (any size, just enough to cover every point), and a module quiz spanning every point.
# Study links per lesson (math drills and quick-reference sheets), shown in the
# lesson's study box: content/lesson-links.json.
LINKS = json.loads((ROOT / "lesson-links.json").read_text())
assert set(LINKS) == {l["id"] for l in lessons}, set(LINKS) ^ {l["id"] for l in lessons}

QUIZZES = {p.stem: json.loads(p.read_text()) for p in sorted((ROOT / "quizzes").glob("*.json"))}
lesson_ids = {l["id"] for l in lessons}
for m in modules:
    qz = QUIZZES.get(m["id"])
    assert qz, f"no quiz map for {m['id']}"
    for lid, entry in qz["lessons"].items():
        assert lid in lesson_ids, (m["id"], lid)
        for pt in entry["points"]:
            assert pt["questions"], (lid, pt["point"])
    for l in lessons:
        if l["module"] != m["id"]:
            continue
        quiz = qz["lessons"][l["id"]]["quiz"]
        missing = [i for i in quiz if i not in qids]
        assert not missing and len(set(quiz)) == len(quiz), (l["id"], missing)
        l["quiz"] = quiz
    mquiz = qz["moduleQuiz"]["quiz"]
    missing = [i for i in mquiz if i not in qids]
    assert not missing and len(set(mquiz)) == len(mquiz), (m["id"], missing)
    m["quiz"] = mquiz

# Abbreviations: each gets its own glossary entry ("CFPB" -> "Consumer Financial
# Protection Bureau. ..."). The abbreviation is removed from other entries' aliases
# so [[CFPB]] always opens the abbreviation entry.
ABBR = json.loads((ROOT / "abbreviations.json").read_text()) if (ROOT / "abbreviations.json").exists() else {}
for ab, info in ABBR.items():
    k = ab.lower()
    for key, g in list(glossary.items()):
        if g.get("aliases"):
            g["aliases"] = [x for x in g["aliases"] if x.lower() != k]
    old = glossary.get(k, {})
    glossary[k] = {
        "term": ab,
        "definition": f"{info['meaning']}. {info['description']}".strip(),
        "aliases": sorted(set(old.get("aliases", [])) | set(info.get("aliases", []))),
        "_state": old.get("_state", False),
    }

gl = []
for g in glossary.values():
    g = {k: v for k, v in g.items() if k != "_state"}
    if not g.get("aliases"):
        g.pop("aliases", None)
    gl.append(g)
gl.sort(key=lambda g: g["term"].lower())
# One name, one entry: drop aliases that repeat the entry's own term, another entry's
# term, or an alias already claimed by an earlier entry.
terms = {g["term"].lower() for g in gl}
claimed = set()
for g in gl:
    keep = []
    for x in g.get("aliases", []):
        k = x.lower()
        if k == g["term"].lower() or k in terms or k in claimed:
            continue
        claimed.add(k)
        keep.append(x)
    if keep:
        g["aliases"] = keep
    else:
        g.pop("aliases", None)

sec = collections.Counter(q["section"] for q in questions)
assert set(sec) == {"national", "state"}, sec
ids = [q["id"] for q in questions] + [c["id"] for d in decks for c in d["cards"]] + [l["id"] for l in lessons]
dupes = [i for i, n in collections.Counter(ids).items() if n > 1]
assert not dupes, dupes

for l in lessons:
    for k in ("drills", "refs"):
        if LINKS[l["id"]].get(k):
            l[k] = LINKS[l["id"]][k]
references = [{"id": rid, "title": t, "body": (ROOT / "refs" / f).read_text().strip()} for rid, t, f in REFS]
drills = json.loads((ROOT / "drills.json").read_text())
for f in GAP_DRILLS:
    drills += json.loads((ROOT / "parts" / f).read_text())
ref_ids = {r["id"] for r in references}
drill_ids = {d["id"] for d in drills}
for l in lessons:
    assert set(l.get("drills", [])) <= drill_ids, (l["id"], set(l.get("drills", [])) - drill_ids)
    assert set(l.get("refs", [])) <= ref_ids, (l["id"], set(l.get("refs", [])) - ref_ids)

course = {
    "format": "examiner-course",
    "version": 1,
    "id": "colorado-broker",
    "title": "Colorado Real Estate Broker",
    "description": (
        "Prep for the PSI Colorado broker exam: lessons for the national and Colorado state portions, "
        f"a {len(questions)}-question bank with timed exams scored like the real thing, notecards, math drills, a glossary "
        "and quick-reference sheets. Independent study material, not affiliated with PSI, the Division of Real "
        "Estate or any school. Laws and Commission forms change; check current sources."
    ),
    "author": "Erudior",
    "revision": 14,
    "changelog": "Adds a disclaimer: this course is for education only and doesn't replace professional advice.",
    "disclaimer": (
        "The information in this course is for educational and informational purposes only and should not be used to "
        "replace professional advice, including legal, tax, financial or real estate brokerage advice. It is independent "
        "study material, not affiliated with PSI, the Colorado Division of Real Estate or any school, and laws, rules and "
        "Commission forms change. Students are responsible for how they choose to use this content, and Erudior assumes "
        "no liability for the use or misuse of the information in it."
    ),
    "modules": modules,
    "lessons": lessons,
    "banks": [{
        "id": "exam-bank",
        "title": "Colorado broker exam bank",
        "description": f"{sec['national']} national and {sec['state']} Colorado questions. Timed exams draw 80 national and 74 state questions and score each portion on its own, like PSI.",
        "sections": [
            {"id": "national", "name": "National portion"},
            {"id": "state", "name": "Colorado state portion"},
        ],
        "exam": {
            "questionCount": 154,
            "timeLimitMinutes": 230,
            "passingPercent": 75,
            "sectionQuotas": {"national": 80, "state": 74},
            # PSI: 60 of 80 national (75%), 53 of 74 state (71.62%).
            "sectionPassing": {"national": 75, "state": 71.6},
            "sectionTimeLimits": {"national": 120, "state": 110},
        },
        "questions": questions,
    }],
    "decks": decks,
    "glossary": gl,
    "references": references,
    "drills": drills,
}

OUT.write_text(json.dumps(course, indent=1, ensure_ascii=False))

# Sanity report
links = set()
for l in lessons:
    links |= {m.strip().lower() for m in re.findall(r"\[\[([^\]|]+)", l["body"])}
for c in (c for d in decks for c in d["cards"]):
    links |= {m.strip().lower() for m in re.findall(r"\[\[([^\]|]+)", c["front"] + c["back"])}
names = {g["term"].lower() for g in gl} | {a.lower() for g in gl for a in g.get("aliases", [])}
print(f"modules {len(modules)} lessons {len(lessons)} questions {len(questions)} {dict(sec)}")
print(f"cards {sum(len(d['cards']) for d in decks)} in {len(decks)} decks; glossary {len(gl)}; refs {len(references)}; drills {len(drills)}")
print("unresolved glossary links:", sorted(links - names))
seen = {}
for g in gl:
    for n in [g["term"], *g.get("aliases", [])]:
        seen.setdefault(n.lower(), []).append(g["term"])
print("glossary name collisions:", {k: v for k, v in seen.items() if len(v) > 1})
bold = [seg for l in lessons for seg in l["body"].split("**")[1::2]]
print(f"bold phrases: {len(bold)}, linked to the glossary: {sum('[[' in b for b in bold)} (the rest are emphasis)")
print("answer positions:", collections.Counter(q["answer"][0] for q in questions))
print("lesson quiz sizes:", sorted(len(l.get("quiz", [])) for l in lessons))
print("module quiz sizes:", {m["id"]: len(m.get("quiz", [])) for m in modules})
print("size KB:", OUT.stat().st_size // 1024)

# Refresh the course catalog (title, description and counts shown before a course is added).
import importlib.util as _u
_spec = _u.spec_from_file_location("mathbuild", ROOT / "math" / "build.py")
_mb = _u.module_from_spec(_spec)
_spec.loader.exec_module(_mb)
_mb.write_manifest()
print("catalog refreshed")
