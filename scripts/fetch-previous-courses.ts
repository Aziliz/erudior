// Download a previous course release for revision checks. Never trusts the network
// without verifying the detached catalog signature against pinned app public keys.
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { transientReleaseTransport } from "./lib/releaseTransport";
import { COURSE_PUBLIC_KEYS } from "../src/lib/courseKeys";
import { sha256Hex, verifySignature, publicKeyOf, signBytes, b64 } from "../src/lib/courseSign";

const base = process.env.COURSE_PREVIOUS_URL?.trim();
if (!base || !/^https:\/\//.test(base)) throw new Error("COURSE_PREVIOUS_URL must be HTTPS.");
const target = path.resolve(process.env.COURSE_PREVIOUS_RELEASE_DIR || ".course-previous");
const originBucket = process.env.COURSE_PREVIOUS_R2_BUCKET?.trim();
if (originBucket && !/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/.test(originBucket)) throw Error("Invalid previous-release R2 bucket.");
const fetchBytes = async (file: string): Promise<Uint8Array> => {
  const url = new URL(file, base.endsWith("/") ? base : base + "/");
  if (url.origin !== new URL(base).origin) throw new Error("Cross-origin course URL rejected.");
  let lastError: unknown;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`Fetching ${file}: public attempt ${attempt}/3`);
      const response = await fetch(url, {
        cache: "no-store", redirect: "error", signal: AbortSignal.timeout(30000),
      });
      if (response.status === 404) throw new Error(`Previous release artifact missing: ${file} (HTTP 404).`);
      if (!response.ok) {
        if (response.status >= 500 || response.status === 429) throw new Error(`Temporary HTTP ${response.status}`);
        throw new Error(`Cannot retrieve previous release: ${file} (HTTP ${response.status}).`);
      }
      const bytes = new Uint8Array(await response.arrayBuffer());
      console.log(`Verified download candidate ${file}: ${bytes.length} bytes`);
      return bytes;
    } catch (error) {
      lastError = error;
      if (String(error).includes("missing:") || /HTTP 4(?!29)/.test(String(error))) break;
      console.warn(`Public transfer failed for ${file}: ${String(error)}`);
      if (originBucket && transientReleaseTransport(error)) {
        // Transport fallback only. The caller still verifies catalog signature and
        // every course digest. HTTP 404/other permanent 4xx never reach this path.
        const directory = fs.mkdtempSync(path.join(os.tmpdir(), "erudior-origin-"));
        const destination = path.join(directory, "artifact");
        try {
          execFileSync("npx", ["--yes", "wrangler@3.114.0", "r2", "object", "get", `${originBucket}/v1/${file}`, "--file", destination], { stdio: "inherit", timeout: 90000 });
          const bytes = new Uint8Array(fs.readFileSync(destination));
          console.log(`Authoritative origin candidate ${file}: ${bytes.length} bytes; authentication still required`);
          return bytes;
        } catch (originError) {
          console.warn(`Origin transfer failed for ${file}: ${String(originError)}`);
          lastError = originError;
        } finally { fs.rmSync(directory, { recursive: true, force: true }); }
      }
      if (attempt < 3) await new Promise(resolve => setTimeout(resolve, attempt * 2000));
    }
  }
  throw new Error(`Failed retrieving ${file} after bounded retries: ${String(lastError)}`);
};
// First publication is an explicit, auditable operation, never an automatic 404 fallback.
const bootstrap = process.env.COURSE_BOOTSTRAP_FIRST_RELEASE === "true";
if (bootstrap) {
  const secret = process.env.COURSE_SIGNING_KEY?.trim();
  if (!secret || !COURSE_PUBLIC_KEYS.includes(publicKeyOf(secret)))
    throw new Error("First-release bootstrap requires the trusted production signing key.");
  const response = await fetch(new URL("catalog.json", base.endsWith("/") ? base : base + "/"), {
    method: "GET", redirect: "error", signal: AbortSignal.timeout(30000),
  });
  if (response.status !== 404)
    throw new Error(`First-release bootstrap refused: catalog returned ${response.status}, expected 404.`);
  const bytes = Buffer.from(JSON.stringify({format:"examiner-catalog",version:1,courses:[]}));
  const signature = signBytes(new Uint8Array(bytes), b64.decode(secret));
  fs.mkdirSync(target, {recursive:true});
  fs.writeFileSync(path.join(target,"catalog.json"), bytes);
  fs.writeFileSync(path.join(target,"catalog.json.sig"), signature+"\n");
  console.log("Explicitly initialized signed empty first-release baseline.");
  process.exit(0);
}
const catalogBytes = await fetchBytes("catalog.json");
const sig = new TextDecoder().decode(await fetchBytes("catalog.json.sig")).trim();
if (!verifySignature(catalogBytes, sig, COURSE_PUBLIC_KEYS))
  throw new Error("Previous catalog signature invalid against pinned Erudior keys.");
const catalog: unknown = JSON.parse(new TextDecoder().decode(catalogBytes));
if (!catalog || typeof catalog !== "object" || !("courses" in catalog) || !Array.isArray(catalog.courses) ||
    !("format" in catalog) || catalog.format !== "examiner-catalog" || !("version" in catalog) || catalog.version !== 1)
  throw new Error("Previous catalog format invalid.");
const courses = catalog.courses as Array<{id:string;file:string;sha256:string}>;
const files = new Map<string, Uint8Array>();
const seenIds = new Set<string>();
for (const course of courses) {
  if (!/^[A-Za-z0-9_-]{1,100}$/.test(course.id) ||
      !course.file.startsWith(course.id + ".r") || seenIds.has(course.id) ||
      !/^[A-Za-z0-9_-]+\.r[1-9][0-9]*\.json$/.test(course.file) ||
      !/^[a-f0-9]{64}$/i.test(course.sha256) ||
      files.has(course.file)) throw new Error("Invalid or duplicate previous course entry.");
  const bytes = await fetchBytes(course.file);
  const actual = await sha256Hex(bytes);
  if (actual !== course.sha256.toLowerCase()) {
    // Never accept mismatched content. Report both digests to make R2/CDN
    // investigation possible without weakening the signed catalog checks.
    throw new Error(`Previous course hash mismatch: ${course.file}; expected ${course.sha256.toLowerCase()}; downloaded ${actual}; bytes ${bytes.length}. Verify the authoritative R2 object against the signed catalog and inspect CDN caching.`);
  }
  seenIds.add(course.id);
  files.set(course.file, bytes);
}
// Write only after every downloaded artifact has passed verification.
fs.mkdirSync(target, { recursive: true });
fs.writeFileSync(path.join(target, "catalog.json"), catalogBytes);
fs.writeFileSync(path.join(target, "catalog.json.sig"), sig + "\n");
for (const [file, bytes] of files) fs.writeFileSync(path.join(target, file), bytes);
console.log(`Verified previous release: ${files.size} courses`);
