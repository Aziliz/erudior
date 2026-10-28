// Build the course packages the website serves.
//   npm run courses:publish            (signs with COURSE_SIGNING_KEY or .keys/course-signing.key)
//   npm run courses:publish -- --dev   (signs with a local dev key, for `npm run dev`)
// Output: dist-courses/v1/catalog.json, catalog.json.sig and one immutable file per course
// revision (<id>.r<revision>.json). Upload the whole folder; course files never change in place.
import fs from "node:fs";
import path from "node:path";
import { newKeyPair, publicKeyOf, sha256Hex, signBytes, b64 } from "../src/lib/courseSign";
import { importValidatedCourseSnapshot } from "../src/lib/courseIntegrity";

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
// Validate every source before touching the output directory or loading a signing key.
for (const entry of entries) {
  const source = fs.readFileSync(path.join(root, "samples", entry.file), "utf8");
  const course = importValidatedCourseSnapshot(source);
  if (course.id !== entry.id || (course.revision ?? 1) !== entry.revision)
    throw new Error(`Catalog identity/revision mismatch for ${entry.file}: expected ${entry.id} r${entry.revision}`);
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
