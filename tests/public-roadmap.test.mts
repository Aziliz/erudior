import assert from "node:assert/strict";
import { readFile, unlink } from "node:fs/promises";
import { build } from "esbuild";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { ROADMAP, PUBLIC_ROADMAP, ELECTIVES, UPDATES, ENGINE, ENGINE_PLANNED } from "../src/lib/roadmap.ts";

assert(ROADMAP.some(g => g.id.startsWith("jd-")), "internal professional roadmap remains");
assert(ROADMAP.some(g => g.id === "professional-real-estate"));
assert(ELECTIVES.includes("University Physics I"));
assert.deepEqual(PUBLIC_ROADMAP.filter(g => g.id.startsWith("language-")), ROADMAP.filter(g => g.id.startsWith("language-")));
assert.deepEqual(PUBLIC_ROADMAP.filter(g => !g.id.startsWith("language-")).map(g => g.id), ROADMAP.filter(g => g.id === "prek" || g.id.startsWith("k8-") || g.id.startsWith("hs-") || g.id.startsWith("college-")).map(g => g.id));

const outfile = "tests/.public-roadmap-bundle.mjs";
await build({ entryPoints: ["src/pages/Roadmap.tsx"], outfile, bundle: true, platform: "node", format: "esm", packages: "external", define: { "import.meta.env": "{}" } });
try {
  const { default: Roadmap } = await import("./.public-roadmap-bundle.mjs");
  const doc = new JSDOM(renderToStaticMarkup(React.createElement(Roadmap))).window.document;
  const course = doc.querySelector("#course-updates")!;
  for (const group of PUBLIC_ROADMAP) assert(course.querySelector("#" + group.id), group.id);
  assert.equal(course.querySelectorAll("li").length, PUBLIC_ROADMAP.reduce((n, g) => n + g.courses.length, 0));
  assert(!course.textContent!.includes("J.D. preparation"));
  assert(!course.textContent!.includes("Professional education"));
  assert(!course.textContent!.includes("Advanced college electives"));
  for (const area of UPDATES.filter(a => ["web-app-updates", "application-updates"].includes(a.id))) {
    const section = doc.querySelector("#" + area.id)!;
    assert.equal(section.querySelectorAll("li").length, area.items.length);
    for (const item of area.items) assert(section.textContent!.includes(item.title));
  }
  assert.equal(doc.querySelectorAll("#engine li").length, ENGINE.length + ENGINE_PLANNED.length);
  for (const title of [...ENGINE.map(e => e.title), ...ENGINE_PLANNED]) assert(doc.querySelector("#engine")!.textContent!.includes(title));
  assert((await readFile("src/pages/Roadmap.tsx", "utf8")).includes("const all = rows.flatMap"), "counts use displayed scope");
} finally { await unlink(outfile); }
console.log("Public roadmap scope and preserved sections passed.");
