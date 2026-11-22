import assert from "node:assert/strict";
import { chromium } from "playwright";
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH});
const page=await browser.newPage();
const failures=[];
page.on("pageerror",e=>failures.push(e.message));
try {
  await page.goto("https://app.erudior.com/zero-to-rhcsa-on-rhel-10",{waitUntil:"domcontentloaded"});
  const open=page.getByRole("button",{name:/^(Open course|Start course)$/});
  await open.first().click({timeout:60000});
  await page.getByRole("button",{name:"Lessons",exact:true}).click({timeout:60000});
  const modules=page.locator("section.module");
  await page.locator(".lesson-title").filter({hasText:"Predict what Bash will pass"}).first().waitFor({timeout:30000});
  const outline=page.locator(".lesson-title");
  assert.equal(await outline.count(),73);
  assert.equal(await modules.count(),15);
  for (const name of [
    "Meet Linux and install your first practice machine",
    "Predict what Bash will pass to a command",
    "Independent shift: restore an operator's handoff",
    "Install from a signed Flatpak remote without Internet access",
    "Independent shift: diagnose a service that missed its schedule",
    "Final • RHCSA practice exam for RHEL 10",
    "Optional workshop: keep data when a container is replaced"
  ]) {
    await outline.filter({hasText:name}).first().click();
    await page.getByRole("heading",{name,exact:true}).waitFor();
    const content=await page.locator("article.lesson-body").innerText();
    assert(content.length>400,name);
    await page.getByRole("button",{name:"← Zero to RHCSA on RHEL 10",exact:true}).click();
  }
  assert.deepEqual(failures,[]);
  console.log("Public website opened the signed RHCSA course through its normal catalog entry, displayed 15 modules and 73 lessons, and rendered the reviewed sample lessons from first login through the practical.");
} catch(e) {
 console.error("URL",page.url(),"page",(await page.locator("body").innerText()).slice(0,2500));
 throw e;
} finally {await browser.close();}
