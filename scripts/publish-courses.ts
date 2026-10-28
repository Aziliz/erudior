// Build the course packages the website serves.
//   npm run courses:publish            (signs with COURSE_SIGNING_KEY or .keys/course-signing.key)
//   npm run courses:publish -- --dev   (signs with a local dev key, for `npm run dev`)
// Output: dist-courses/v1/catalog.json, catalog.json.sig and one immutable file per course
// revision (<id>.r<revision>.json). Upload the whole folder; course files never change in place.
import fs from "node:fs";
import path from "node:path";
import { newKeyPair, publicKeyOf, sha256Hex, signBytes, verifySignature, b64 } from "../src/lib/courseSign";
import { importValidatedCourseSnapshot } from "../src/lib/courseIntegrity";
import { compareCourseRevisions } from "../src/lib/courseRevision";
import { COURSE_PUBLIC_KEYS } from "../src/lib/courseKeys";

const root = path.resolve(import.meta.dirname, "..");
const dev = process.argv.includes("--dev");
const out = path.join(root, "dist-courses", "v1");

function secretKey(): string {
  if (dev) {
    const f = path.join(root, ".keys", "dev.key");
    if (!fs.existsSync(f)) {
      fs.mkdirSync(path.dirname(f), { recursive: true });
      fs.writeFileSync(f, newKeyPair().secretKey + "\n", { mode: 0o600 });
    }
    return fs.readFileSync(f, "utf8").trim();
  }
  if (process.env.COURSE_SIGNING_KEY) return process.env.COURSE_SIGNING_KEY.trim();
  const f = path.join(root, ".keys", "course-signing.key");
  if (fs.existsSync(f)) return fs.readFileSync(f, "utf8").trim();
  throw new Error("No signing key: set COURSE_SIGNING_KEY or run `npm run course-keys` (or use --dev).");
}

const entries = JSON.parse(fs.readFileSync(path.join(root, "samples", "catalog.json"), "utf8")) as { id: string; revision: number; file: string }[];
/** Optional previous-release directory: --previous-dir PATH.
 * The directory must contain catalog.json and the immutable course files named by its entries.
 * A supplied baseline is mandatory to validate a change in previously published identities;
 * without one, this script cannot assert revision compatibility.
 */
const previousArg = process.argv.indexOf("--previous-dir");
if (previousArg >= 0 && !process.argv[previousArg + 1]) throw new Error("--previous-dir requires a directory.");
const baselinePath = previousArg >= 0 ? process.argv[previousArg + 1] : process.env.COURSE_PREVIOUS_RELEASE_DIR;
const previousDir = baselinePath ? path.resolve(baselinePath) : undefined;
if (!dev && !previousDir) throw new Error("Production publishing requires --previous-dir PATH or COURSE_PREVIOUS_RELEASE_DIR. Supply an authenticated prior release (or an empty baseline catalog for first publication).");
const previousCatalogBytes = previousDir ? fs.readFileSync(path.join(previousDir, "catalog.json")) : undefined;
const trustedPreviousKey = process.env.COURSE_PREVIOUS_PUBLIC_KEY?.trim();
if (trustedPreviousKey && !COURSE_PUBLIC_KEYS.includes(trustedPreviousKey))
  throw new Error("Previous-release key must match an application-pinned public key.");
if (previousDir && !dev && !COURSE_PUBLIC_KEYS.length)
  throw new Error("No pinned public keys available to verify the prior catalog.");
if (previousCatalogBytes) {
  const signature = fs.readFileSync(path.join(previousDir!, "catalog.json.sig"), "utf8").trim();
  if (!verifySignature(new Uint8Array(previousCatalogBytes), signature, trustedPreviousKey ? [trustedPreviousKey] : COURSE_PUBLIC_KEYS))
    throw new Error("Previous catalog signature verification failed.");
}
const previousCatalog = previousCatalogBytes
  ? JSON.parse(previousCatalogBytes.toString("utf8")) as { courses: { id: string; revision: number; file: string; sha256: string }[] }
  : undefined;
if (previousCatalog && !Array.isArray(previousCatalog.courses)) throw new Error("Previous catalog has no courses array.");
// An empty catalog is permitted only for an explicitly authenticated first release.
// The caller is responsible for fetching/verifying the prior signed catalog.

// Never silently remove a previously issued course from the published catalog.
for (const prior of previousCatalog?.courses ?? [])
  if (!entries.some((entry) => entry.id === prior.id))
    throw new Error(`Previous course ${prior.id} is missing from the new catalog.`);

// Validate every source before touching the output directory or loading a signing key.
for (const entry of entries) {
  const source = fs.readFileSync(path.join(root, "samples", entry.file), "utf8");
  const course = importValidatedCourseSnapshot(source);
  if (course.id !== entry.id || (course.revision ?? 1) !== entry.revision)
    throw new Error(`Catalog identity/revision mismatch for ${entry.file}: expected ${entry.id} r${entry.revision}`);
  const previousEntry = previousCatalog?.courses.find((c) => c.id === entry.id);
  if (previousCatalog && !previousEntry && entry.revision !== 1)
    throw new Error(`New course ${entry.id} must start at revision 1 (got ${entry.revision}).`);
  if (previousDir && previousEntry) {
    const previousFile = path.resolve(previousDir, previousEntry.file);
    if (!previousFile.startsWith(previousDir + path.sep))
      throw new Error(`Unsafe previous course file path: ${previousEntry.file}`);
    const previousBytes = fs.readFileSync(previousFile);
    const digest = await sha256Hex(new Uint8Array(previousBytes));
    if (digest.toLowerCase() !== previousEntry.sha256?.toLowerCase())
      throw new Error(`Previous course ${previousEntry.id} SHA-256 mismatch.`);
    const previous = importValidatedCourseSnapshot(previousBytes.toString("utf8"));
    if (previous.id !== previousEntry.id || (previous.revision ?? 1) !== previousEntry.revision)
      throw new Error(`Previous catalog mismatch for ${previousEntry.id}`);
    if (entry.revision === previousEntry.revision) {
      if (source !== fs.readFileSync(previousFile, "utf8"))
        throw new Error(`Course ${entry.id} changed without incrementing revision ${entry.revision}.`);
      continue;
    }
    const issues = compareCourseRevisions(previous, course);
    if (issues.length) throw new Error(`Revision compatibility issue in ${entry.id}: ${issues.map((i) => `${i.severity} ${i.path}: ${i.message}`).join("; ")}`);
  }
}
const key = secretKey();
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const published = [];
for (const e of entries) {
  const bytes = fs.readFileSync(path.join(root, "samples", e.file));
  const file = `${e.id}.r${e.revision}.json`;
  fs.writeFileSync(path.join(out, file), bytes);
  published.push({ ...e, file, bytes: bytes.length, sha256: await sha256Hex(new Uint8Array(bytes)) });
}
// State homeschool rules (content/states), published the same way: immutable file named by version.
const statesBytes = fs.readFileSync(path.join(root, "samples", "states.json"));
const statesVersion = JSON.parse(statesBytes.toString("utf8")).version as string;
const statesFile = `states.${statesVersion}.json`;
fs.writeFileSync(path.join(out, statesFile), statesBytes);
const states = { file: statesFile, version: statesVersion, bytes: statesBytes.length, sha256: await sha256Hex(new Uint8Array(statesBytes)) };
const catalog = new TextEncoder().encode(
  JSON.stringify({ format: "examiner-catalog", version: 1, published: new Date().toISOString(), courses: published, states }),
);
fs.writeFileSync(path.join(out, "catalog.json"), catalog);
fs.writeFileSync(path.join(out, "catalog.json.sig"), signBytes(catalog, b64.decode(key)) + "\n");
if (dev) fs.writeFileSync(path.join(root, "dist-courses", "dev-public-key.txt"), publicKeyOf(key));

const total = published.reduce((s, e) => s + e.bytes, 0);
console.log(`${published.length} courses, ${(total / 1e6).toFixed(1)} MB -> ${path.relative(root, out)}${dev ? " (dev key)" : ""}`);
