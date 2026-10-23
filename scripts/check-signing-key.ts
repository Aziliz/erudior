// CI guard: the signing key in COURSE_SIGNING_KEY must match a public key the app trusts,
// or every published catalog would be rejected by the apps already installed.
import { COURSE_PUBLIC_KEYS } from "../src/lib/courseKeys";
import { publicKeyOf } from "../src/lib/courseSign";

const secret = process.env.COURSE_SIGNING_KEY?.trim();
if (!secret) {
  console.error("COURSE_SIGNING_KEY is not set (GitHub: Settings > Secrets and variables > Actions).");
  process.exit(1);
}
const pub = publicKeyOf(secret);
if (!COURSE_PUBLIC_KEYS.includes(pub)) {
  console.error(`The signing key's public key ${pub} isn't in src/lib/courseKeys.ts. Run \`npm run course-keys\` and commit courseKeys.ts.`);
  process.exit(1);
}
console.log("Signing key matches courseKeys.ts.");
