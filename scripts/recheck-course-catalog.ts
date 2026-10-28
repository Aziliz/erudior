// Guard against a catalog changing between revision validation and publishing.
// This is an optimistic preflight, not an atomic compare-and-swap; other writers
// must also respect the deployment lock.
import fs from "node:fs";
import path from "node:path";
import { COURSE_PUBLIC_KEYS } from "../src/lib/courseKeys";
import { verifySignature } from "../src/lib/courseSign";

const raw = process.env.COURSE_PREVIOUS_URL;
const baseline = path.resolve(process.env.COURSE_PREVIOUS_RELEASE_DIR || ".course-previous");
if (!raw || !/^https:\/\//.test(raw)) throw new Error("COURSE_PREVIOUS_URL must be HTTPS.");
const base = raw.endsWith("/") ? raw : raw + "/";
async function get(name: string) {
  const url = new URL(name, base);
  url.searchParams.set("fresh", String(Date.now()));
  const response = await fetch(url, { cache: "no-store", redirect: "error", signal: AbortSignal.timeout(30000) });
  return response;
}
const catalog = await get("catalog.json");
if (process.env.COURSE_BOOTSTRAP_FIRST_RELEASE === "true") {
  if (catalog.status !== 404) throw new Error("First-release baseline changed: a remote catalog now exists.");
  console.log("Confirmed no remote catalog has appeared since authorized bootstrap.");
  process.exit(0);
}
if (catalog.status !== 200) throw new Error(`Catalog changed or became unavailable before commit (HTTP ${catalog.status}).`);
const bytes = new Uint8Array(await catalog.arrayBuffer());
const signatureResponse = await get("catalog.json.sig");
if (signatureResponse.status !== 200) throw new Error("Published catalog signature unavailable before commit.");
const signature = (await signatureResponse.text()).trim();
if (!verifySignature(bytes, signature, COURSE_PUBLIC_KEYS))
  throw new Error("Published catalog signature no longer validates.");
const expected = fs.readFileSync(path.join(baseline, "catalog.json"));
const expectedSignature = fs.readFileSync(path.join(baseline, "catalog.json.sig"), "utf8").trim();
if (!Buffer.from(bytes).equals(expected) || signature !== expectedSignature)
  throw new Error("Published catalog changed after baseline verification. Restart the release.");
console.log("Confirmed remote catalog matches previously authenticated baseline.");
