// Detect retired product identifiers in deployable source/configuration.
// Signed course packages must be regenerated and re-signed, never edited in place.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
const legacy = String.fromCharCode(101, 120, 97, 109, 105, 110, 101, 114);
const files = execFileSync("git", ["ls-files", "-z"], { encoding: "buffer" }).toString("utf8").split("\0").filter(Boolean);
const skip = (p) => p === "scripts/check-product-identity.mjs" || p.startsWith("samples/") || p.startsWith("docs/") || p === "HANDOFF.md";
const patterns = [
  new RegExp("com[.]aziliz[.]" + legacy, "i"),
  new RegExp("https?://(?:[a-z0-9.-]*[.])?" + legacy + "[.]", "i"),
];
const failures = [];
for (const file of files) {
  if (skip(file)) continue;
  let bytes;
  try { bytes = readFileSync(file); } catch { continue; }
  if (bytes.includes(0)) continue;
  if (patterns.some((p) => p.test(bytes.toString("utf8")))) failures.push(file);
}
if (failures.length) {
  for (const file of failures) console.error("Retired identifier in " + file);
  console.error(failures.length + " files failed the product identity gate");
  process.exitCode = 1;
} else {
  console.log("Erudior product identity gate passed (" + files.length + " tracked files).");
}
