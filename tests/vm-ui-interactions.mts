import assert from "node:assert/strict";
import { setTimeout as wait } from "node:timers/promises";
import { act } from "react";

export async function clickVmButton(label: string, settled = () => !document.querySelector('[aria-busy="true"]')) {
  const button = [...document.querySelectorAll("button")].find(item => item.textContent === label);
  assert(button && !button.disabled, `Expected an enabled ${label} button`);
  await act(async () => { button.click(); });
  // React does not await promises returned by an event handler. Wait for the
  // native dialog and the resulting state update before interacting again.
  const deadline = Date.now() + 5000;
  while (!settled()) {
    assert(Date.now() < deadline, `Timed out waiting for ${label}`);
    await act(async () => { await wait(10); });
  }
}
