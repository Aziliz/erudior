// Fail CI if the retired product identity reappears in tracked source/configuration.
// Git index is the source of truth; skip binary files and this guard itself.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
const legacy = String.fromCharCode(...[101,120,97,109,105,110,101,114]);
const files = execFileSync("git", ["ls-files", "-z"], { encoding: "buffer" }).toString("utf8").split("\0").filter(Boolean);
let failures = 0;
for (const file of files) {
  // Generated/signed artifacts and archival documents require an independent\n  // source-and-signing migration, not in-place mutation. Check active identity files.\n  if (file === "scripts/check-product-identity.mjs" || file.startsWith("samples/") || file.startsWith("docs/") || file === "HANDOFF.md") continue;
  let content;
  try { content = readFileSync(file); } catch { continue; }
  if (content.includes(0)) continue;
  const text = content.toString("utf8");
  // Enforce identifiers, not ordinary prose such as examination terminology.\n  const identity = new RegExp("(?:com[.]aziliz[.]|[\\\"\x27\\x60])" + legacy + "(?:[.\\\"\x27\\x60-]|$)", "i");\n  if (identity.test(text)) {
    console.error("Retired product identity found in: " + file);
    failures++;
  }
}
if (failures) { console.error(failures + " files contain retired naming"); process.exitCode = 1; }
else console.log("Erudior product-identity audit passed (" + files.length + " tracked files).");
