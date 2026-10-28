import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { transientReleaseTransport } from "../scripts/lib/releaseTransport.ts";
assert.equal(transientReleaseTransport(new Error("Temporary HTTP 503")),true);
assert.equal(transientReleaseTransport(new Error("Temporary HTTP 429")),true);
assert.equal(transientReleaseTransport(new Error("fetch failed", { cause: { code: "ECONNRESET" } })),true);
assert.equal(transientReleaseTransport(new Error("fetch failed", { cause: { code: "CERT_HAS_EXPIRED" } })),false);
assert.equal(transientReleaseTransport(new Error("Previous course hash mismatch")),false);
assert.equal(transientReleaseTransport(new Error("Cannot retrieve previous release (HTTP 403)")),false);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "erudior-transfer-test-"));
try {
  const bin=path.join(tmp,"bin");fs.mkdirSync(bin);
  fs.writeFileSync(path.join(tmp,"sample.r1.json"),"expected bytes");
  fs.writeFileSync(path.join(bin,"curl"),`#!/usr/bin/env bash
while [ "$#" -gt 0 ]; do if [ "$1" = --output ]; then out=$2; shift 2; else shift; fi; done
printf '%s' "$FAKE_PUBLIC_BYTES" > "$out"
printf '%s' "$FAKE_STATUS"
exit "$FAKE_CURL_EXIT"
`,{mode:0o755});
  fs.writeFileSync(path.join(bin,"npx"),`#!/usr/bin/env bash
printf 'origin requested\\n' >> "$TRACE"
while [ "$#" -gt 0 ]; do if [ "$1" = --file ]; then out=$2; shift 2; else shift; fi; done
if [ "$FAKE_ORIGIN_EXIT" != 0 ]; then exit "$FAKE_ORIGIN_EXIT"; fi
printf '%s' "$FAKE_ORIGIN_BYTES" > "$out"
`,{mode:0o755});
  const run=(extra:Record<string,string>={})=>{
    const trace=path.join(tmp,"trace");fs.writeFileSync(trace,"");
    const result=spawnSync("bash",["scripts/verify-immutable-release.sh",path.join(tmp,"sample.r1.json"),"erudior-courses","https://example.test/v1/"],{
      encoding:"utf8",env:{...process.env,PATH:bin+path.delimiter+process.env.PATH,TRACE:trace,
        FAKE_PUBLIC_BYTES:"expected bytes",FAKE_STATUS:"200",FAKE_CURL_EXIT:"0",FAKE_ORIGIN_EXIT:"0",FAKE_ORIGIN_BYTES:"expected bytes",...extra}});
    return {...result,origin:fs.readFileSync(trace,"utf8")};
  };
  assert.equal(run().status,0);
  assert.equal(run({FAKE_STATUS:"404"}).status,10);
  const mismatch=run({FAKE_PUBLIC_BYTES:"wrong bytes"});assert.equal(mismatch.status,2);assert.equal(mismatch.origin,"");
  const fallback=run({FAKE_CURL_EXIT:"28",FAKE_PUBLIC_BYTES:"partial",FAKE_STATUS:"200"});assert.equal(fallback.status,0);assert(fallback.origin);
  assert.equal(run({FAKE_CURL_EXIT:"28",FAKE_ORIGIN_BYTES:"different"}).status,2);
  assert.notEqual(run({FAKE_CURL_EXIT:"28",FAKE_ORIGIN_EXIT:"1"}).status,10,"uncertain origin is never treated as absence");
  assert.equal(run({FAKE_CURL_EXIT:"28",FAKE_ORIGIN_EXIT:"10"}).status,2,"origin error 10 must not masquerade as confirmed404");
  const tls=run({FAKE_CURL_EXIT:"60"});assert.equal(tls.status,2);assert.equal(tls.origin,"");
  const redirect=run({FAKE_CURL_EXIT:"47"});assert.equal(redirect.status,2);assert.equal(redirect.origin,"");
  assert.equal(run({FAKE_STATUS:"403"}).status,2);
  assert.equal(run({FAKE_STATUS:"503"}).status,2);
  console.log("release transfer: 11 exact-byte, missing, transient-origin and fail-closed checks passed");
}finally{fs.rmSync(tmp,{recursive:true,force:true});}
