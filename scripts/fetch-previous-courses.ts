// Download a previous course release for revision checks. Never trusts the network
// without verifying the detached catalog signature against pinned app public keys.
import fs from "node:fs";
import path from "node:path";
import { COURSE_PUBLIC_KEYS } from "../src/lib/courseKeys";
import { sha256Hex, verifySignature } from "../src/lib/courseSign";

const base = process.env.COURSE_PREVIOUS_URL?.trim();
if (!base || !/^https:\/\//.test(base)) throw new Error("COURSE_PREVIOUS_URL must be HTTPS.");
const target = path.resolve(process.env.COURSE_PREVIOUS_RELEASE_DIR || ".course-previous");
const fetchBytes = async (file: string): Promise<Uint8Array> => {
  const url = new URL(file, base.endsWith("/") ? base : base + "/");
  if (url.origin !== new URL(base).origin) throw new Error("Cross-origin course URL rejected.");
  const response = await fetch(url, { redirect: "error", signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`Cannot retrieve previous release: ${file} (${response.status}). First release requires a separately approved bootstrap.`);
  return new Uint8Array(await response.arrayBuffer());
};
const catalogBytes = await fetchBytes("catalog.json");
const sig = new TextDecoder().decode(await fetchBytes("catalog.json.sig")).trim();
if (!verifySignature(catalogBytes, sig, COURSE_PUBLIC_KEYS))
  throw new Error("Previous catalog signature invalid against pinned Erudior keys.");
const catalog: unknown = JSON.parse(new TextDecoder().decode(catalogBytes));
if (!catalog || typeof catalog !== "object" || !("courses" in catalog) || !Array.isArray(catalog.courses))
  throw new Error("Previous catalog format invalid.");
const courses = catalog.courses as Array<{id:string;file:string;sha256:string}>;
const files = new Map<string, Uint8Array>();
for (const course of courses) {
  if (!/^[A-Za-z0-9_-]+\.r[1-9][0-9]*\.json$/.test(course.file) ||
      !/^[a-f0-9]{64}$/i.test(course.sha256) ||
      files.has(course.file)) throw new Error("Invalid or duplicate previous course entry.");
  const bytes = await fetchBytes(course.file);
  if ((await sha256Hex(bytes)) !== course.sha256.toLowerCase())
    throw new Error(`Previous course hash mismatch: ${course.file}`);
  files.set(course.file, bytes);
}
// Write only after every downloaded artifact has passed verification.
fs.mkdirSync(target, { recursive: true });
fs.writeFileSync(path.join(target, "catalog.json"), catalogBytes);
fs.writeFileSync(path.join(target, "catalog.json.sig"), sig + "\n");
for (const [file, bytes] of files) fs.writeFileSync(path.join(target, file), bytes);
console.log(`Verified previous release: ${files.size} courses`);
