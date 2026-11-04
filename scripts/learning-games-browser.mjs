// Self-contained local browser regression. Uses synthetic test-only course data and blocks
// external traffic. Does not touch production accounts, rooms, grades or progress.
import assert from "node:assert/strict";
import {mkdir,readFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createServer} from "vite";
import react from "@vitejs/plugin-react";
const pw=await import(process.env.PLAYWRIGHT_MODULE||"playwright");
const chromium=pw.chromium||pw.default.chromium;
const root=fileURLToPath(new URL("../",import.meta.url));
const out=process.env.BROWSER_ARTIFACTS||path.join(root,"test-results","learning-games-browser");
await mkdir(out,{recursive:true});
const axe=await readFile(new URL("../node_modules/axe-core/axe.min.js",import.meta.url),"utf8");
let server,browser,page,current="startup";
const issues=[];
try {
  server=await createServer({root,configFile:false,plugins:[react()],server:{host:"127.0.0.1",port:0,strictPort:false},define:{__DEV_COURSE_KEY__:JSON.stringify("")},logLevel:"warn"});
  await server.listen();const address=server.httpServer.address();assert(address&&typeof address!=="string");const origin=`http://127.0.0.1:${address.port}`;
  browser=await chromium.launch(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{});
  const button=name=>page.getByRole("button",{name,exact:true});
  const audit=async name=>{
    current=name;await page.evaluate(()=>document.fonts.ready);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
    assert(overflow<=1,`${name}: ${overflow}px horizontal overflow`);
    await page.addScriptTag({content:axe});
    const results=await page.evaluate(()=>window.axe.run(document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]}}));
    assert.deepEqual(results.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[],`${name}: accessibility violations`);
  };
  const choose=async mode=>{await page.getByLabel("Game",{exact:true}).selectOption(mode);await button("Start activity").click();};
  const end=()=>button("End activity / choose again").click();
  for(const colorScheme of ["light","dark"])for(const width of [1280,320]){
    current=`${colorScheme}-${width}`;const context=await browser.newContext({viewport:{width,height:900},colorScheme});
    await context.route("**/*",route=>{const url=new URL(route.request().url());return url.origin===origin||url.protocol==="data:"?route.continue():route.abort();});
    page=await context.newPage();page.on("pageerror",e=>issues.push(`${current}: ${e.message}`));await page.goto(`${origin}/tests/fixtures/learning-games.html`);await page.getByRole("heading",{name:"Learning games",exact:true}).waitFor();
    await page.getByLabel("Material",{exact:true}).selectOption("cards");await audit(`${colorScheme}-${width}-setup`);
    await choose("review");const first=page.locator(".game-tile").first();await first.focus();await page.keyboard.press("Enter");await button("Reveal answer").focus();await page.keyboard.press("Space");await button("Correct — award 100").click();assert.match(await page.locator("[role=status]").first().innerText(),/100 points · 1 \/ 12/);await audit(`${colorScheme}-${width}-review`);
    await button("Restart with these pairs").click();assert.match(await page.locator("[role=status]").first().innerText(),/0 points · 0 \/ 12/);await end();
    await choose("matching");for(let i=0;i<8;i++){const p=page.locator(".games-match > div:first-child button:not(:disabled)").first();const n=(await p.innerText()).match(/\d+/)[0];await p.click();await button(`Answer ${n}`).click();}assert.match(await page.locator("[role=status]").first().innerText(),/8 \/ 8 matched.*Complete/);await audit(`${colorScheme}-${width}-matching`);await end();
    await choose("bingo");await audit(`${colorScheme}-${width}-bingo`);for(let i=0;i<9;i++){const prompt=page.locator(".panel").filter({has:page.locator(".games-bingo")}).locator("p").filter({hasText:/^Prompt \d+$/});const n=(await prompt.innerText()).match(/\d+/)[0];await button(`Answer ${n}`).click();}assert.match(await page.locator("[role=status]").first().innerText(),/Bingo! 8 completed lines/);await end();
    await choose("memory");const known=new Map(),matched=new Set();const tiles=page.locator(".game-tile");
    for(let turn=0;turn<100&&matched.size<16;turn++){
      const available=Array.from({length:16},(_,i)=>i).filter(i=>!matched.has(i));const a=available.find(i=>!known.has(i))??available[0];await tiles.nth(a).click();const ka=(await tiles.nth(a).innerText()).match(/(?:Prompt|Answer) (\d+)/)[1];known.set(a,ka);
      const b=available.find(i=>i!==a&&known.get(i)===ka)??available.find(i=>i!==a&&!known.has(i))??available.find(i=>i!==a);await tiles.nth(b).click();const kb=(await tiles.nth(b).innerText()).match(/(?:Prompt|Answer) (\d+)/)[1];known.set(b,kb);
      if(ka===kb){matched.add(a);matched.add(b);}else await button("Not a pair — hide both and continue").click();
    }
    assert.equal(matched.size,16,"Memory must be completable using visible cards only");await audit(`${colorScheme}-${width}-memory`);await end();
    await button("Large-text presenter view").click();assert.equal(await page.locator("fieldset[disabled]").count(),1);await audit(`${colorScheme}-${width}-presenter`);await button("Exit large-text presenter view").click();
    await page.getByText("Timer",{exact:true}).click();await page.getByLabel("Seconds",{exact:true}).fill("1");await button("Start / resume timer").click();await page.getByText("Time is up.",{exact:true}).waitFor();await button("Reset timer").click();await page.getByText("Timer",{exact:true}).click();
    await page.getByText("Random picker and teams",{exact:true}).click();await page.getByLabel("Nicknames, one per line (up to 200)",{exact:true}).fill("Alpha\nBeta\nGamma\nDelta");await button("Pick a nickname").click();assert.match(await page.locator("[role=status]").innerText(),/Picked:/);await button("Randomize balanced teams").click();assert.equal(await page.getByText(/^Team [12]:/).count(),2);await page.getByText("Random picker and teams",{exact:true}).click();
    await page.getByText("Local poll",{exact:true}).click();await page.getByLabel("Poll prompt",{exact:true}).fill("Ready to continue?");await button("Start / reset poll").click();await page.getByRole("button",{name:"Add vote for Yes",exact:true}).click();assert.equal(await page.getByText("Yes: 1",{exact:true}).count(),1);await page.getByRole("button",{name:"Remove vote for Yes",exact:true}).click();await button("Close poll / edit").click();await page.getByText("Local poll",{exact:true}).click();
    await page.getByText("Exit ticket",{exact:true}).click();await page.getByLabel("Class summary",{exact:true}).fill("Review practice tomorrow.");await button("Clear exit summary").click();assert.equal(await page.getByLabel("Class summary",{exact:true}).inputValue(),"");await page.getByText("Exit ticket",{exact:true}).click();
    await page.getByText("Shared writing board",{exact:true}).click();await page.getByLabel("Board",{exact:true}).fill("Step 1 → Step 2\nExplain the reasoning.");await audit(`${colorScheme}-${width}-tools`);await button("Clear board").click();assert.equal(await page.getByLabel("Board",{exact:true}).inputValue(),"");
    await page.screenshot({path:path.join(out,`${colorScheme}-${width}-passed.png`),fullPage:true});await context.close();page=null;
  }
  assert.deepEqual(issues,[],"Browser runtime errors");console.log("Learning games browser passed: four games, reset/return, keyboard, tools, presenter, 320/1280 light/dark, overflow and axe.");
}catch(error){if(page)await page.screenshot({path:path.join(out,`${current.replace(/[^a-z0-9-]/gi,"-")}-failure.png`),fullPage:true}).catch(()=>{});throw error;}finally{await browser?.close();await server?.close();}
