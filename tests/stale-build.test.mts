import assert from "node:assert/strict";
import { isStaleChunkError, reloadForNewBuild } from "../src/lib/staleBuild.ts";

for (const message of [
  "TypeError: Failed to fetch dynamically imported module: https://app.erudior.com/assets/bundledCourses-CRD9muoc.js",
  "TypeError: error loading dynamically imported module: https://app.erudior.com/assets/x.js",
  "TypeError: Importing a module script failed.",
  "Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of \"text/html\". Strict MIME type checking is enforced for module scripts per HTML spec. is not a valid JavaScript MIME type",
]) assert(isStaleChunkError(new TypeError(message)), message);
assert(!isStaleChunkError(new Error("Family assignments changed. Reopen the course.")));
assert(!isStaleChunkError(undefined));

const store = new Map<string, string>();
const storage = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v) };
let reloads = 0;
assert.equal(reloadForNewBuild(storage, 1_000_000, () => reloads++), true);
assert.equal(reloadForNewBuild(storage, 1_010_000, () => reloads++), false); // No loop when the new build also fails.
assert.equal(reloadForNewBuild(storage, 1_040_000, () => reloads++), true);
assert.equal(reloads, 2);
const refusing = { getItem: () => { throw Error("denied"); }, setItem: () => { throw Error("denied"); } };
assert.equal(reloadForNewBuild(refusing, 0, () => reloads++), true);
console.log("Stale build detection and one-time reload passed.");
