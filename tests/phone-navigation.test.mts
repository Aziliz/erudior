import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import type { View } from "../src/App";

const dom = new JSDOM('<!doctype html><div id="root"></div>');
Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, IS_REACT_ACT_ENVIRONMENT: true });
const { createElement, act } = await import("react");
const { createRoot } = await import("react-dom/client");
const { default: PhoneNavigation } = await import("../src/components/PhoneNavigation");
const root = createRoot(document.getElementById("root")!);
const destinations: View[] = [];

for (const showCommunity of [false, true]) {
  for (const managementLabel of [null, "Family", "Classroom"] as const) {
    const props = { current: "progress" as const, currentView: "progress" as const, showCommunity, managementLabel, go: (view: View) => destinations.push(view) };
    await act(async () => root.render(createElement(PhoneNavigation, props)));
    const nav = document.querySelector('nav[aria-label="Phone navigation"]')!;
    const buttons = [...nav.querySelectorAll<HTMLButtonElement>("button")];
    const labels = buttons.map(button => button.querySelector("span:last-child")?.textContent);
    assert.deepEqual(labels, ["Library", ...(showCommunity ? ["Community"] : []), "Courses", ...(managementLabel ? [managementLabel] : []), "Search"]);
    assert.equal(nav.querySelectorAll('[aria-current="page"]').length, 1);
    assert.equal(nav.querySelector('[aria-current="page"] span:last-child')?.textContent, "Courses");
    assert(!labels.includes("Progress"), "Progress is reserved for a course tab");
    if (!managementLabel) assert(!labels.includes("Family") && !labels.includes("Classroom"), "Independent learners have no management destination");
    for (const button of buttons) {
      assert.equal(button.type, "button");
      assert.equal(button.querySelector("span:first-child")?.getAttribute("aria-hidden"), "true");
      await act(async () => button.click());
    }
    assert.deepEqual(destinations.splice(0), [
      { name: "library" }, ...(showCommunity ? [{ name: "community" }] : []), { name: "progress" },
      ...(managementLabel ? [{ name: "parent" }] : []), { name: "search", q: "" },
    ], "Phone controls retain existing routes; management opens the existing adult gate rather than setup or new authority");
    if (managementLabel) {
      await act(async () => root.render(createElement(PhoneNavigation, { ...props, current: null, currentView: "parent" })));
      assert.equal(nav.querySelector('[aria-current="page"] span:last-child')?.textContent, managementLabel);
    }
  }
}

await act(async () => root.unmount());
dom.window.close();
console.log("Phone navigation: independent/family/classroom labels, optional Community, current destination and existing route callbacks passed (frontend rendering; not native Android execution).");
