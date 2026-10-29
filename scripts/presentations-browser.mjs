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
const out=process.env.BROWSER_ARTIFACTS||path.join(root,"test-results","presentations-browser");
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
  for(const colorScheme of ["light","dark"])for(const width of [1280,320]){
    current=`${colorScheme}-${width}`;const context=await browser.newContext({viewport:{width,height:900},colorScheme});
    await context.route("**/*",route=>{const url=new URL(route.request().url());return url.origin===origin||url.protocol==="data:"?route.continue():route.abort();});
    page=await context.newPage();page.on("pageerror",e=>issues.push(`${current}: ${e.message}`));await page.goto(`${origin}/tests/fixtures/presentations.html`);
    await button("New presentation").click();await page.getByLabel("Presentation title",{exact:true}).fill("");await page.getByLabel("Presentation title",{exact:true}).fill("Reusable lesson");
    await page.getByLabel("Presentation resource",{exact:true}).selectOption({index:1});await button("Add selected slide").click();
    await page.getByLabel("Presentation resource",{exact:true}).selectOption({index:2});await button("Add selected slide").click();
    await button("Move slide 2 up").click();await button("Move slide 1 down").click();
    await button("Save presentation").focus();await page.keyboard.press("Enter");await page.getByText("Presentation saved.",{exact:true}).waitFor();await audit(`${current}-authoring`);
    await button("Student-paced preview").click();await button("Next slide").click();await page.getByLabel("First",{exact:true}).check();await button("Submit response").click();await page.getByText("Correct choices:",{exact:true}).waitFor();await audit(`${current}-student`);await button("Next slide").click();await button("Restart presentation").click();await button("Exit local presentation").click();
    await button("Teacher-paced preview").click();await button("Next slide").click();await button("Reveal answer").click();await audit(`${current}-teacher`);await button("Previous slide").click();await button("Exit local presentation").click();
    await button("Video settings for slide 2").click();await page.getByLabel("Video URL",{exact:true}).fill("https://media.erudior.com/demo.mp4");await page.getByLabel("Video transcript",{exact:true}).fill("The transcript explains why the first option is correct.");await page.getByLabel("Video pause seconds",{exact:true}).fill("12");await page.getByLabel("I reviewed this video and transcript for accuracy, accessibility and permission to share.",{exact:true}).check();await button("Apply video question").click();await button("Save presentation").click();await button("Student-paced preview").click();await button("Next slide").click();await audit(`${current}-video-transcript`);assert.equal(await page.locator("video").count(),0,"No video fetch before consent");await button("Use transcript and answer question").click();await page.getByLabel("First",{exact:true}).check();await button("Submit response").click();await button("Next slide").click();await button("Back to presentations").click();
    await button("Duplicate presentation").click();await button("Discard unsaved changes").click();await button("Reusable lesson · 2 slides · revision 2").click();await audit(`${current}-reopened`);
    await page.screenshot({path:path.join(out,`${colorScheme}-${width}-passed.png`),fullPage:true});await context.close();page=null;
  }
  assert.deepEqual(issues,[],"Browser runtime errors");console.log("Presentations browser passed: reusable authoring/reorder/save/reopen/duplicate/discard, both pacing modes, transcript video question, keyboard, 320/1280 light/dark, overflow and axe.");
}catch(error){if(page)await page.screenshot({path:path.join(out,`${current.replace(/[^a-z0-9-]/gi,"-")}-failure.png`),fullPage:true}).catch(()=>{});throw error;}finally{await browser?.close();await server?.close();}
