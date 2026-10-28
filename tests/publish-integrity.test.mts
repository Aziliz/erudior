import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { newKeyPair, signBytes, sha256Hex, b64 } from "../src/lib/courseSign.ts";

const root = path.resolve(import.meta.dirname, "..");
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "erudior-publish-"));
try {
  const previous = path.join(temp, "previous");
  fs.mkdirSync(previous);
  const sample = JSON.parse(fs.readFileSync(path.join(root, "samples/catalog.json"), "utf8")) as Array<{id:string;revision:number;file:string}>;
  const first = sample[0];
  assert(first, "Need a sample course for release test");
  const bytes = fs.readFileSync(path.join(root, "samples", first.file));
  const entry = {id:first.id,revision:first.revision,file:`${first.id}.r${first.revision}.json`,sha256:await sha256Hex(new Uint8Array(bytes))};
  fs.writeFileSync(path.join(previous, entry.file), bytes);
  const catalog = Buffer.from(JSON.stringify({format:"examiner-catalog",version:1,courses:[entry]}));
  fs.writeFileSync(path.join(previous,"catalog.json"),catalog);
  const keys = newKeyPair();
  fs.writeFileSync(path.join(previous,"catalog.json.sig"),signBytes(new Uint8Array(catalog),b64.decode(keys.secretKey)));
  const run = (env:Record<string,string>) => spawnSync(process.execPath, ["--import","tsx", "scripts/publish-courses.ts","--previous-dir",previous],{
    cwd:root,encoding:"utf8",env:{...process.env,...env,COURSE_SIGNING_KEY:keys.secretKey}
  });
  // An untrusted baseline must not be accepted by an otherwise valid production publisher.
  const untrusted = run({COURSE_PREVIOUS_PUBLIC_KEY:keys.publicKey});
  assert.notEqual(untrusted.status,0,"Unpinned previous key must fail");
  assert.match(untrusted.stderr+untrusted.stdout,/pinned public key|application-pinned/);
  // A corrupt signature must fail even when the supplied public key is syntactically valid.
  fs.writeFileSync(path.join(previous,"catalog.json.sig"),"bad-signature");
  const corrupt = run({COURSE_PREVIOUS_PUBLIC_KEY:keys.publicKey});
  assert.notEqual(corrupt.status,0,"Corrupted signature must fail");
  assert.match(corrupt.stderr+corrupt.stdout,/pinned public key|signature/);
  console.log("PASS production rejects untrusted and corrupted previous baselines");
} finally {
  fs.rmSync(temp,{recursive:true,force:true});
}
