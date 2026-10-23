// Make the production key pair that signs course catalogs.
//   npm run course-keys
// Writes the secret key to .keys/course-signing.key (git-ignored) and adds the public key
// to src/lib/courseKeys.ts. Then: add the secret key's contents as the GitHub Actions secret
// COURSE_SIGNING_KEY, commit courseKeys.ts, and keep a backup of the secret key somewhere safe
// (losing it means shipping an app update with a new public key).
import fs from "node:fs";
import path from "node:path";
import { newKeyPair } from "../src/lib/courseSign";

const root = path.resolve(import.meta.dirname, "..");
const keyFile = path.join(root, ".keys", "course-signing.key");
const keysTs = path.join(root, "src", "lib", "courseKeys.ts");

if (fs.existsSync(keyFile) && !process.argv.includes("--force")) {
  console.error(`${keyFile} already exists. Use --force to replace it (old key stays trusted in courseKeys.ts).`);
  process.exit(1);
}
const { publicKey, secretKey } = newKeyPair();
fs.mkdirSync(path.dirname(keyFile), { recursive: true });
fs.writeFileSync(keyFile, secretKey + "\n", { mode: 0o600 });

const src = fs.readFileSync(keysTs, "utf8");
const m = /COURSE_PUBLIC_KEYS: string\[\] = \[([\s\S]*?)\];/.exec(src);
if (!m) throw new Error("couldn't find COURSE_PUBLIC_KEYS in courseKeys.ts");
const existing = m[1].split(",").map((s) => s.trim()).filter(Boolean);
const list = [...existing, JSON.stringify(publicKey)].join(",\n  ");
fs.writeFileSync(keysTs, src.replace(m[0], `COURSE_PUBLIC_KEYS: string[] = [\n  ${list},\n];`));

console.log(`Secret key: ${keyFile}`);
console.log(`Public key added to src/lib/courseKeys.ts: ${publicKey}`);
console.log("Next: copy the secret key file's contents into the GitHub secret COURSE_SIGNING_KEY, and commit courseKeys.ts.");
