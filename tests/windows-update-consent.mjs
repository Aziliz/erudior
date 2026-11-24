// Included only in the disposable Windows acceptance installer. Drive the visible controls
// in its real WebView and report readiness to the host before it closes the first process.
import { invoke } from "@tauri-apps/api/core";

const receipt = (phase, detail = "") => invoke("save_item", {
  kind: "documents", id: "update-acceptance", content: JSON.stringify({ phase, detail }),
});

async function button(label) {
  const deadline = Date.now() + 120_000;
  let banner;
  do {
    banner = document.querySelector('[aria-label="App update"]');
    const found = [...(banner?.querySelectorAll("button") ?? [])].find(b => b.textContent.trim() === label);
    if (found && found.getClientRects().length && !found.disabled) return found;
    if (banner?.textContent.includes("Update failed")) break;
    await new Promise(resolve => setTimeout(resolve, 250));
  } while (Date.now() < deadline);
  throw Error("Expected " + label + ". " + (banner?.innerText || "No update banner."));
}

async function exercise() {
  const marker = "erudior.test.downloaded";
  if (localStorage.getItem(marker)) {
    const install = await button("Install and restart now");
    await receipt("installing");
    install.click();
    return;
  }
  (await button("Download update")).click();
  await button("Install and restart now");
  localStorage.setItem(marker, "yes");
  await receipt("downloaded");
}

exercise().catch(error => receipt("failed", String(error)));
