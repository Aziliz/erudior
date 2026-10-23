// Signed course catalogs: publish with the dev key, then check the app accepts it and
// rejects tampering or a wrong key.
import fs from "node:fs";
import { execSync } from "node:child_process";
import { openCatalog } from "../src/lib/courseSource.ts";
import { newKeyPair, publicKeyOf, sha256Hex } from "../src/lib/courseSign.ts";

let fails = 0;
const ok = (name: string, cond: boolean) => {
  if (!cond) { fails++; console.log("FAIL", name); }
};
const throws = (fn: () => unknown) => { try { fn(); return false; } catch { return true; } };

execSync("npx tsx scripts/publish-courses.ts --dev", { stdio: "pipe" });
const dir = "dist-courses/v1";
const bytes = new Uint8Array(fs.readFileSync(`${dir}/catalog.json`));
const sig = fs.readFileSync(`${dir}/catalog.json.sig`, "utf8").trim();
const devKey = publicKeyOf(fs.readFileSync(".keys/dev.key", "utf8").trim());

const entries = openCatalog(bytes, sig, [devKey]);
const snapshot = JSON.parse(fs.readFileSync("samples/catalog.json", "utf8"));
ok("all courses published", entries.length === snapshot.length);
ok("files named by revision", entries.every((e) => e.file === `${e.id}.r${e.revision}.json`));
const first = entries[0];
ok("hash matches file", (await sha256Hex(new Uint8Array(fs.readFileSync(`${dir}/${first.file}`)))) === first.sha256);
ok("trusts any listed key", openCatalog(bytes, sig, [newKeyPair().publicKey, devKey]).length === entries.length);
ok("rejects a wrong key", throws(() => openCatalog(bytes, sig, [newKeyPair().publicKey])));
ok("rejects no keys", throws(() => openCatalog(bytes, sig, [])));
const tampered = bytes.slice(); tampered[40] ^= 1;
ok("rejects a changed catalog", throws(() => openCatalog(tampered, sig, [devKey])));
ok("rejects a garbage signature", throws(() => openCatalog(bytes, "nope", [devKey])));

console.log(fails ? `${fails} FAILURES` : "course signing tests passed");
if (fails) process.exit(1);
