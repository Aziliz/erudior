#!/usr/bin/env python3
"""Check content/states/states.yaml and write samples/states.json (the app's state-rules package)."""
import json, re, sys, pathlib, yaml

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent.parent
TEXT = ["name", "ages", "notice", "time", "subjects", "assessment", "records", "teacher", "routes"]
# The app's subject areas (src/lib/family.ts SUBJECTS).
AREAS = {"Math", "English language arts", "Science", "Social studies", "World languages", "Arts", "Health and PE", "Other"}
MMDD = re.compile(r"^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$")


def fail(msg):
    sys.exit(f"states.yaml: {msg}")


def check(e):
    c = e.get("code", "?")
    for k in TEXT:
        if not isinstance(e.get(k), str) or not e[k].strip():
            fail(f"{c}: '{k}' must be text")
    if not re.fullmatch(r"[A-Z]{2}", c):
        fail(f"bad code {c!r}")
    if not e.get("sources") or not all(isinstance(u, str) and u.startswith("http") for u in e["sources"]):
        fail(f"{c}: needs source links")
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", str(e.get("checked", ""))):
        fail(f"{c}: 'checked' must be YYYY-MM-DD")
    r = e.get("rules")
    if not isinstance(r, dict):
        fail(f"{c}: missing rules")
    n = r.get("notice", {})
    if n.get("kind") not in ("none", "once", "annual", "approval"):
        fail(f"{c}: notice.kind")
    for k in ("due", "opens"):
        if k in n and not MMDD.match(str(n[k])):
            fail(f"{c}: notice.{k} must be MM-DD")
    for k in ("beforeStart", "afterStart"):
        if k in n and not (isinstance(n[k], int) and 0 <= n[k] <= 120):
            fail(f"{c}: notice.{k}")
    for k in ("days", "hoursPerDay"):
        if k in r and not (isinstance(r[k], (int, float)) and 0 < r[k] <= 366):
            fail(f"{c}: {k}")
    bands = r.get("hours", [])
    for b in bands:
        if not (0 <= b["from"] <= b["to"] <= 12 and 0 < b["hours"] < 2000):
            fail(f"{c}: hours band {b}")
    for g in r.get("testGrades", []):
        if not (isinstance(g, int) and 0 <= g <= 12):
            fail(f"{c}: testGrades")
    for x in r.get("reports", []):
        when = [k for k in ("due", "midYear", "yearEnd") if k in x]
        if len(when) != 1 or not x.get("what") or set(x) - {"due", "midYear", "yearEnd", "what"}:
            fail(f"{c}: reports need `what` and one of due / midYear / yearEnd")
        if "due" in x and not MMDD.match(str(x["due"])):
            fail(f"{c}: reports.due must be MM-DD")
        if "midYear" in x and x["midYear"] is not True or "yearEnd" in x and x["yearEnd"] is not True:
            fail(f"{c}: reports.midYear / yearEnd must be true")
    for k in ("evaluationFromNotice", "qualification", "either", "guidance", "annualAssessment"):
        if k in r and not isinstance(r[k], bool):
            fail(f"{c}: {k} must be true or false")
    if r.get("qualification") and e["teacher"] == "None":
        fail(f"{c}: qualification needs a `teacher` requirement")
    for a in r.get("subjectAreas", []):
        if a not in AREAS:
            fail(f"{c}: subjectAreas: unknown area {a!r}")
    ch = r.get("coreHours")
    if ch is not None:
        if not (isinstance(ch.get("hours"), int) and 0 < ch["hours"] < 2000) or not ch.get("areas") or any(a not in AREAS for a in ch["areas"]):
            fail(f"{c}: coreHours")
    ls = r.get("lowScore")
    if ls is not None:
        kinds = [k for k in ("percentileAtMost", "percentileBelow", "stanineBelow") if k in ls]
        if len(kinds) != 1 or not ls.get("then"):
            fail(f"{c}: lowScore needs `then` and one of percentileAtMost / percentileBelow / stanineBelow")
        v = ls[kinds[0]]
        if not isinstance(v, int) or not (1 <= v <= (9 if kinds[0] == "stanineBelow" else 99)):
            fail(f"{c}: lowScore value")
    if "plan" in r and r["plan"] not in ("ihip", "objectives", "education"):
        fail(f"{c}: plan must be ihip, objectives or education")
    unknown = set(r) - {"notice", "days", "hoursPerDay", "hours", "either", "guidance", "testGrades", "annualAssessment", "reports",
                        "evaluationFromNotice", "qualification", "subjectAreas", "coreHours", "lowScore", "plan"}
    if unknown:
        fail(f"{c}: unknown rules {sorted(unknown)}")


def main():
    data = yaml.safe_load((HERE / "states.yaml").read_text())
    codes = [e["code"] for e in data]
    if len(set(codes)) != len(codes):
        fail("duplicate state code")
    if len(codes) != 51:
        fail(f"expected 50 states + DC, found {len(codes)}")
    for e in data:
        e["checked"] = str(e["checked"])
        check(e)
    version = max(e["checked"] for e in data)
    out = {"format": "examiner-states", "version": version, "states": data}
    (ROOT / "samples" / "states.json").write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")))
    print(f"states.json: {len(data)} jurisdictions, checked through {version}")


main()
