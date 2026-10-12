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

# Trim to exactly 250: drop one state question (s1 has 29 after review added none; s2 gained one).
DROP = {"s1-029"}

parts = {p.stem: json.loads(p.read_text()) for p in sorted((ROOT / "parts").glob("*.json"))}

modules, lessons, questions, decks = [], [], [], []
glossary: dict[str, dict] = {}
for mid, mtitle, key, deck_title in MODULES:
    part = parts[key]
    modules.append({"id": mid, "title": mtitle})
    for l in part["lessons"]:
        lessons.append({**l, "module": mid})
    questions += [q for q in part["questions"] if q["id"] not in DROP]
    decks.append({
        "id": f"deck-{key}",
        "title": deck_title,
        "description": "National portion" if key.startswith("n") else "Colorado state portion",
        "cards": part["cards"],
    })
    state = key.startswith("s")
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

gl = []
for g in glossary.values():
    g = {k: v for k, v in g.items() if k != "_state"}
    if not g.get("aliases"):
        g.pop("aliases", None)
    gl.append(g)
gl.sort(key=lambda g: g["term"].lower())

assert len(questions) == 250, len(questions)
sec = collections.Counter(q["section"] for q in questions)
assert sec == {"national": 130, "state": 120}, sec

references = [{"id": rid, "title": t, "body": (ROOT / "refs" / f).read_text().strip()} for rid, t, f in REFS]
drills = json.loads((ROOT / "drills.json").read_text())

course = {
    "format": "examiner-course",
    "version": 1,
    "id": "colorado-broker",
    "title": "Colorado Real Estate Broker",
    "description": (
        "Prep for the PSI Colorado broker exam: lessons for the national and Colorado state portions, "
        "a 250-question bank with timed exams scored like the real thing, notecards, math drills, a glossary "
        "and quick-reference sheets. Independent study material, not affiliated with PSI, the Division of Real "
        "Estate or any school. Laws and Commission forms change; check current sources."
    ),
    "author": "Examiner",
    "modules": modules,
    "lessons": lessons,
    "banks": [{
        "id": "exam-bank",
        "title": "Colorado broker exam bank",
        "description": "130 national and 120 Colorado questions. Timed exams draw 80 national and 74 state questions and score each portion on its own, like PSI.",
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
print("size KB:", OUT.stat().st_size // 1024)
