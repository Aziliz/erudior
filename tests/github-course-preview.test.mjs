import assert from "node:assert/strict";
import test from "node:test";
import { coursePreview } from "../functions/_middleware.js";

test("the shell exposes the signed course overview as ordinary HTML before JavaScript", () => {
  const handlers = new Map();
  const original = globalThis.HTMLRewriter;
  globalThis.HTMLRewriter = class {
    on(selector, handler) { handlers.set(selector, handler); return this; }
    transform(shell) { return shell; }
  };
  try {
    const course = { title: "C & Bash", description: "Treat <commands> as text.", outline: [{ title: "<img src=x>" }] };
    const response = coursePreview(new Request("https://app.erudior.com/c-bash"), new Response("<html/>"), course);
    assert.equal(response.status, 200);
    let body;
    handlers.get("#root").element({ setInnerContent(value, options) {
      assert.equal(options.html, true);
      body = value;
    } });
    assert.match(body, /<main><h1>C &amp; Bash<\/h1>/);
    assert.match(body, /Treat &lt;commands&gt; as text/);
    assert.match(body, /<li>&lt;img src=x&gt;<\/li>/);
    assert.doesNotMatch(body, /<img/);
    assert.ok(handlers.has("noscript"));
  } finally {
    if (original) globalThis.HTMLRewriter = original;
    else delete globalThis.HTMLRewriter;
  }
});
