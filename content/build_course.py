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
# Quiz-fill parts: questions written so every lesson quiz reaches 10. Shape:
# {"questions": [...], "quiz": {lessonId: [ids]}}; quiz ids are appended to that lesson's quiz.
FILLS = ["f1", "f2", "f3", "f4"]

parts = {p.stem: json.loads(p.read_text()) for p in sorted((ROOT / "parts").glob("*.json")) if p.stem in {m[2] for m in MODULES} | set(GAPS) | set(FILLS)}

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

# End-of-lesson quizzes: bank question ids per lesson, picked so each is answerable
# from that lesson alone (content/lesson-quizzes.json).
QUIZ = json.loads((ROOT / "lesson-quizzes.json").read_text())
for key in FILLS:
    questions += parts[key]["questions"]
    for lid, ids in parts[key]["quiz"].items():
        QUIZ[lid] = QUIZ.get(lid, []) + ids
qids = {q["id"] for q in questions}
for l in lessons:
    quiz = QUIZ.get(l["id"], [])
    missing = [i for i in quiz if i not in qids]
    assert not missing, (l["id"], missing)
    if quiz:
        l["quiz"] = quiz
assert not set(QUIZ) - {l["id"] for l in lessons}, set(QUIZ) - {l["id"] for l in lessons}

gl = []
for g in glossary.values():
    g = {k: v for k, v in g.items() if k != "_state"}
    if not g.get("aliases"):
        g.pop("aliases", None)
    gl.append(g)
gl.sort(key=lambda g: g["term"].lower())

sec = collections.Counter(q["section"] for q in questions)
assert set(sec) == {"national", "state"}, sec
ids = [q["id"] for q in questions] + [c["id"] for d in decks for c in d["cards"]] + [l["id"] for l in lessons]
dupes = [i for i, n in collections.Counter(ids).items() if n > 1]
assert not dupes, dupes

references = [{"id": rid, "title": t, "body": (ROOT / "refs" / f).read_text().strip()} for rid, t, f in REFS]
drills = json.loads((ROOT / "drills.json").read_text())
for f in GAP_DRILLS:
    drills += json.loads((ROOT / "parts" / f).read_text())

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
    "author": "Examiner",
    "revision": 9,
    "changelog": "Checked the Colorado half against the 2026 Colorado Real Estate Manual and current statutes: updates the security-deposit return rule (30 days since 2026), trust-account interest, duties after a relationship ends, renewal and CE details, contract and form details, and the reference sheets. Adds REITs and real-estate securities. Adds Colorado's three principal meridians and a few survey facts. Adds a note on fixture tests: Van Ed's quizzes key method of attachment as most important, while courts treat intention as controlling. Every lesson quiz now has 10 questions: 107 new questions written from the lessons themselves fill the gaps. Earlier in this series: end-of-lesson quizzes (pass with 70% to complete a lesson), a corrected seller-disclosure answer key, and ten new lessons covering federal tax and 1031s, commercial leasing, MLS/IDX and wire fraud, the Colorado closing worksheet, other Commission forms and HOAs, and Commission rules, audits and complaints.",
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
print("answer positions:", collections.Counter(q["answer"][0] for q in questions))
print("lesson quizzes:", collections.Counter(len(l.get("quiz", [])) for l in lessons))
print("size KB:", OUT.stat().st_size // 1024)
