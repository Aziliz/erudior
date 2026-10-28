// Restore only the three known stale German artifacts to the exact bytes already
// authorized by the production signed catalog. Does not sign or change a catalog.
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { COURSE_PUBLIC_KEYS } from "../src/lib/courseKeys";
import { GERMAN_RECOVERY, digest, recoveryDecision } from "./lib/courseArtifactRecovery";

function requireCurrentMain() {
  const sha = process.env.GITHUB_SHA;
  if (!sha || !/^[a-f0-9]{40}$/.test(sha)) throw Error("Recovery requires a GitHub Actions commit identity.");
  const current = execFileSync("git", ["ls-remote", "origin", "refs/heads/main"], { encoding: "utf8" }).split(/\s+/)[0];
  if (sha !== current) throw Error("Recovery refused: this run is not current main.");
}
requireCurrentMain();
const bucket = process.env.R2_BUCKET?.trim();
if (!bucket || !/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/.test(bucket)) throw Error("A valid R2_BUCKET is required.");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "erudior-artifact-recovery-"));
const run = (...args: string[]) => execFileSync("npx", ["--yes", "wrangler@3.114.0", "r2", "object", ...args], { stdio: "inherit" });
const get = (key: string, name: string) => {
  const file = path.join(tmp, name);
  run("get", `${bucket}/${key}`, "--file", file);
  return fs.readFileSync(file);
};
const catalog = get("v1/catalog.json", "catalog.json");
const signatureBytes = get("v1/catalog.json.sig", "catalog.json.sig");
const signature = signatureBytes.toString("utf8").trim();
// Plan and validate the whole incident before any write.
const plan = GERMAN_RECOVERY.map(incident => {
  const source = fs.readFileSync(path.resolve("samples", incident.source));
  const remote = get(`v1/${incident.file}`, incident.file);
  const decision = recoveryDecision(catalog, signature, COURSE_PUBLIC_KEYS, incident, source, remote);
  console.log(`${incident.file}: ${decision}; origin SHA-256 ${digest(remote)}`);
  return { incident, source, remote, decision };
});
for (const { incident, source, remote, decision } of plan) {
  if (decision === "unchanged") continue;
  // Recheck signed authority and known old bytes immediately before each restoration.
  requireCurrentMain();
  const latestCatalog = get("v1/catalog.json", "catalog-recheck.json");
  const latestSignature = get("v1/catalog.json.sig", "signature-recheck.txt");
  if (!catalog.equals(latestCatalog) || !signatureBytes.equals(latestSignature)) throw Error("Catalog changed during recovery; stopping.");
  const latest = get(`v1/${incident.file}`, "origin-recheck.json");
  if (recoveryDecision(catalog, signature, COURSE_PUBLIC_KEYS, incident, source, latest) === "unchanged") continue;
  // Retain the old public bytes under their content hash; never purge them.
  const backupKey = `recovery/2026-10-28/${incident.file}.${digest(remote)}.json`;
  const backupFile = path.join(tmp, `backup-${incident.file}`);
  fs.writeFileSync(backupFile, remote);
  run("put", `${bucket}/${backupKey}`, "--file", backupFile, "--content-type", "application/json");
  if (digest(get(backupKey, "backup-readback.json")) !== incident.previous) throw Error("Backup read-back failed; not restoring.");
  const sourceFile = path.join(tmp, `restore-${incident.file}`);
  fs.writeFileSync(sourceFile, source);
  requireCurrentMain();
  run("put", `${bucket}/v1/${incident.file}`, "--file", sourceFile, "--content-type", "application/json", "--cache-control", "public, max-age=31536000, immutable");
  if (digest(get(`v1/${incident.file}`, "restored-readback.json")) !== incident.expected) throw Error("Restored origin digest mismatch.");
  console.log(`Restored ${incident.file} to signed SHA-256 ${incident.expected}; previous bytes preserved at ${backupKey}`);
}
console.log("Incident recovery verified. Normal signature/hash/revision publication gates remain required.");
