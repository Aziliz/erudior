#!/usr/bin/env python3
"""Check content/states/states.yaml and write samples/states.json (the app's state-rules package)."""
import json, re, sys, pathlib, yaml

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent.parent
TEXT = ["name", "ages", "notice", "time", "subjects", "assessment", "records", "teacher", "routes"]
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
        if not MMDD.match(str(x.get("due", ""))) or not x.get("what"):
            fail(f"{c}: reports")
    unknown = set(r) - {"notice", "days", "hoursPerDay", "hours", "either", "guidance", "testGrades", "annualAssessment", "reports"}
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
