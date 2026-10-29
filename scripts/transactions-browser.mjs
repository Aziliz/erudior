// Isolated synthetic learning-support regression. No production learner data or network access.
import assert from 'node:assert/strict';
import {mkdir,readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createServer} from 'vite';
import react from '@vitejs/plugin-react';
const pw=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const chromium=pw.chromium||pw.default.chromium;
const root=fileURLToPath(new URL('../',import.meta.url));
const out=process.env.BROWSER_ARTIFACTS||path.join(root,'test-results','transactions-browser');
await mkdir(out,{recursive:true});
const axe=await readFile(new URL('../node_modules/axe-core/axe.min.js',import.meta.url),'utf8');
let server,browser,page,current='startup';const issues=[];
try {
  server=await createServer({root,configFile:false,plugins:[react()],server:{host:'127.0.0.1',port:0,strictPort:false},define:{__DEV_COURSE_KEY__:JSON.stringify('')},logLevel:'warn'});
  await server.listen();const address=server.httpServer.address();assert(address&&typeof address!=='string');const origin=`http://127.0.0.1:${address.port}`;
  browser=await chromium.launch(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{});
  const button=name=>page.getByRole('button',{name,exact:true});
  const audit=async name=>{
    current=name;await page.evaluate(()=>document.fonts.ready);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
    assert(overflow<=1,`${name}: ${overflow}px horizontal overflow`);
    await page.addScriptTag({content:axe});
    const results=await page.evaluate(()=>window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}));
    assert.deepEqual(results.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[],`${name}: accessibility violations`);
    await page.screenshot({path:path.join(out,`${name.replace(/[^a-z0-9-]/gi,'-')}.png`),fullPage:true});
  };
  for (const colorScheme of ['light','dark']) for (const width of [1280,320]) {
    const caseName=`${colorScheme}-${width}`; current=caseName;
    const context=await browser.newContext({viewport:{width,height:900},colorScheme});
    await context.route('**/*',route=>{const url=new URL(route.request().url());return url.origin===origin||url.protocol==='data:'?route.continue():route.abort();});
    page=await context.newPage(); page.on('pageerror',e=>issues.push(`${current}: ${e.message}`));
    await page.goto(`${origin}/tests/fixtures/transactions.html`);
    const label=name=>page.getByLabel(name,{exact:true});
    const eventCount=()=>page.evaluate(()=>window.transactionFixture.state().sessions.reduce((n,s)=>n+s.events.length,0));
    async function record(name) {
      const before=await eventCount(); await button(name).click();
      await page.waitForFunction(expected=>window.transactionFixture.state().sessions.reduce((n,s)=>n+s.events.length,0)===expected,before+1);
      await page.getByText('Simulation event saved. Prior events and submitted evidence are unchanged.',{exact:true}).waitFor();
    }
    async function phase(stage) {
      await label('Next educational phase').selectOption(stage);
      await label('Phase reasoning').fill(`Synthetic evidence for ${stage}.`);
      await record('Record phase transition');
    }
    async function assign(title) {
      const before=await page.evaluate(()=>window.transactionFixture.state().assignments.length);
      await label('Existing transaction case').selectOption('');
      await label('Transaction learner').selectOption('alice');
      await label('Assigned rule pack').selectOption({index:1});
      await label('Transaction case title').fill(title);
      await label('Transaction instructions').fill('Fictional educational practice only; preserve reasons and evidence.');
      await label('Simulated start date').fill('2026-10-29');
      await button('Assign transaction case').click();
      await page.waitForFunction(n=>window.transactionFixture.state().assignments.length===n,before+1);
      await page.waitForFunction(()=>{const b=[...document.querySelectorAll('button')].find(b=>b.textContent==='Assign revised transaction case');return b&&!b.disabled&&!b.closest('fieldset')?.disabled;});
      await page.getByText('Transaction assigned with exact reviewed rules and source snapshots.',{exact:true}).waitFor();
    }
    async function offer(party,price,counter=false) {
      await label('Offering party').selectOption(party);
      await label('Counter to offer').selectOption(counter?{index:1}:'');
      await label('Offer client').selectOption({label:'Fictional client A'});
      await label('Offer price').fill(price); await label('Earnest amount').fill('100.00');
      await label('Offer expiry date').fill('2026-11-01'); await label('Proposed closing date').fill('2026-11-10');
      await label('Offer reasoning').fill('Synthetic negotiation rationale.');
      await record('Record offer or counteroffer');
    }
    async function accept(party) {
      await label('Offer to respond to').selectOption({index:1});
      await label('Responding party').selectOption(party); await label('Response reasoning').fill('Explicitly accepting exact fictional terms.');
      await record('Accept exact offer');
    }
    async function condition(title,status='satisfied') {
      await label('Contingency').selectOption({label:`${title} (${title.toLowerCase()})`});
      await label('Condition outcome').selectOption(status);
      await label('Condition evidence').fill(`Synthetic ${title} evidence: ${status}.`);
      await record('Record contingency outcome');
    }
    async function trust(kind,amount,reference,client='Fictional client A') {
      await label('Trust entry type').selectOption(kind); await label('Trust client').selectOption({label:client});
      await label('Trust amount').fill(amount); await label('Trust reference').fill(reference);
      await label('Trust entry reason').fill('Fictional segregated client-fund entry.');
      await record('Post trust entry');
    }
    async function reconcile(bank,a,b='0.00') {
      await label('Bank statement balance').fill(bank);
      await label('Reported balance for Fictional client A').fill(a);
      await label('Reported balance for Fictional client B').fill(b);
      await label('Reconciliation reasoning').fill('Compare independently entered fictional statement and client balances.');
      await record('Record three-way reconciliation');
    }
    async function submit(expected) {
      await button('Submit transaction evidence').focus(); await page.keyboard.press('Enter');
      await page.waitForFunction(n=>window.transactionFixture.state().submissions.length===n,expected);
      await page.getByText('Immutable transaction evidence submitted locally. No external transaction or academic credit was created.',{exact:true}).waitFor();
    }

    await label('Rule pack title').fill('Synthetic transaction rules');
    for (const [key,value] of Object.entries({id:'synthetic',name:'Fictional jurisdiction',version:'1.0',sourceNote:'Synthetic original educational rules, not current law.',effectiveFrom:'2026-01-01',effectiveThrough:'2027-12-31'})) await label(`Jurisdiction ${key}`).fill(value);
    await label('Minimum earnest deposit basis points').fill('100'); await label('Deposit deadline in simulated days').fill('3');
    await button('Add fictional client').click(); await label('Client 1 name').fill('Fictional client A');
    await button('Add fictional client').click(); await label('Client 2 name').fill('Fictional client B');
    for (const [i,name] of ['Title','Inspection','Financing'].entries()) {
      await button('Add contingency').click(); await label(`Contingency ${i+1} title`).fill(name);
      await label(`Contingency ${i+1} category`).selectOption(name.toLowerCase()); await label(`Contingency ${i+1} days`).fill('7');
    }
    await page.getByRole('checkbox',{name:'Synthetic practice form — document revision 1',exact:true}).check();
    await label('Form role for Synthetic practice form').fill('Fictional representation and transaction evidence');
    await page.evaluate(()=>window.transactionFixture.failNextSave()); await button('Save rule pack revision').click();
    await page.getByRole('alert').filter({hasText:'Synthetic interrupted save'}).waitFor();
    assert.equal(await label('Rule pack title').inputValue(),'Synthetic transaction rules');
    await button('Save rule pack revision').click();
    await page.waitForFunction(()=>window.transactionFixture.state().packs.length===1);
    await page.getByRole('checkbox',{name:'I reviewed this exact saved educational rule pack, dates, document sources and permissions.',exact:true}).check();
    await button('Approve exact rule pack').click();
    await page.waitForFunction(()=>!!window.transactionFixture.state().packs[0].approval);
    await audit(`${caseName}-reviewed-pack`);
    const exported=page.waitForEvent('download'); await button('Export educational rule pack').click();
    const portable=JSON.parse(await readFile(await (await exported).path(),'utf8'));
    assert.equal(portable.approval,undefined); assert(portable.documents.every(d=>!d.approval),'Source labels cannot carry operative approval through export');
    await assign('Synthetic completed transaction'); await assign('Synthetic adverse transaction');
    await button('Fixture learner area').click();
    await button('Synthetic completed transaction — transaction revision 1').click();
    await label('Document explanation').fill('Synthetic initial case evidence.');
    await label('Simulated quantity').fill('11'); await button('Save transaction documents').click();
    await page.getByRole('alert').filter({hasText:/numeric|bounds/i}).waitFor();
    assert.equal(await label('Document explanation').inputValue(),'Synthetic initial case evidence.','Invalid draft remains recoverable without render crash');
    await label('Simulated quantity').fill('5');
    await page.evaluate(()=>window.transactionFixture.failNextSave()); await button('Save transaction documents').click();
    await page.getByRole('alert').filter({hasText:'Synthetic interrupted save'}).waitFor();
    assert.equal(await label('Document explanation').inputValue(),'Synthetic initial case evidence.');
    await button('Save transaction documents').click(); await page.getByText('Transaction document draft saved.',{exact:true}).waitFor();
    await submit(1); await button('Submit transaction evidence').click();
    assert.equal(await page.evaluate(()=>window.transactionFixture.state().submissions.length),1,'Repeated snapshot submit is idempotent');
    await phase('representation'); await phase('pricing'); await phase('offer');
    await offer('buyer','1000.00'); await offer('seller','1100.00',true); await accept('buyer');
    if (width === 320) {
      const history = page.getByLabel('Scrollable offer history', {exact:true});
      assert(await history.evaluate(el => el.scrollWidth > el.clientWidth), 'Mobile offer columns retain readable widths in a bounded scroll region');
      await history.focus(); await page.keyboard.press('ArrowRight');
      await page.waitForFunction(() => document.querySelector('[aria-label="Scrollable offer history"]').scrollLeft > 0);
      await history.evaluate(el => { el.scrollLeft = el.scrollWidth; });
      await audit(`${caseName}-offer-dates-keyboard-scroll`);
      await history.evaluate(el => { el.scrollLeft = 0; });
    }
    await condition('Title'); await condition('Inspection'); await condition('Financing');
    await trust('deposit','100.00','deposit-A');
    const posted=await eventCount(); await button('Post trust entry').click(); assert.equal(await eventCount(),posted,'Repeated funds posting cannot double count');
    await label('Trust entry type').selectOption('disburse'); await label('Trust client').selectOption({label:'Fictional client B'});
    await label('Trust amount').fill('1.00'); await label('Trust reference').fill('forbidden-client-spend');
    await button('Post trust entry').click(); await page.getByRole('alert').filter({hasText:/client|funds|balance/i}).waitFor();
    assert.equal(await eventCount(),posted,'Another client balance cannot fund a disbursement');
    page.once('dialog',dialog=>dialog.accept()); await button('Discard unposted transaction inputs').click();
    await reconcile('99.00','100.00'); await audit(`${caseName}-reconciliation-mismatch`);
    await reconcile('100.00','100.00'); await page.getByText('All three balances match the configured educational records.',{exact:true}).waitFor();
    await button('Reload transaction cases').click(); await button('Synthetic completed transaction — transaction revision 1').click();
    assert.equal(await label('Document explanation').inputValue(),'Synthetic initial case evidence.');
    await phase('closing'); assert.equal(await label('Document explanation').isDisabled(),true,'Closed source responses are frozen');
    await trust('disburse','100.00','settlement-A'); await reconcile('0.00','0.00'); await phase('archived');
    await submit(2); await audit(`${caseName}-closed-archive`);
    await button('Synthetic adverse transaction — transaction revision 1').click();
    await label('Document explanation').fill('Synthetic adverse case evidence.'); await button('Save transaction documents').click();
    await page.getByText('Transaction document draft saved.',{exact:true}).waitFor();
    await phase('representation'); await phase('pricing'); await phase('offer'); await offer('buyer','1000.00'); await accept('seller');
    await condition('Financing','failed'); await phase('archived'); await submit(3); await audit(`${caseName}-adverse-archive`);
    await label('Fixture learner').selectOption('bob'); await page.getByText('No transaction cases assigned.',{exact:true}).waitFor();
    assert.equal(await button('Synthetic completed transaction — transaction revision 1').count(),0,'Learner projection excludes other profiles');
    await button('Fixture adult area').click(); await label('Transaction submission').selectOption({index:1});
    await label('Transaction instructor feedback').fill('Review the retained intake and completed evidence together.');
    await button('Append transaction feedback').click();
    await page.waitForFunction(()=>window.transactionFixture.state().feedback.length===1);
    await label('Compare transaction evidence').selectOption({index:1}); await audit(`${caseName}-instructor-comparison`);
    await page.reload(); await label('Transaction submission').selectOption({index:1});
    await page.getByText(/Review the retained intake and completed evidence together/).waitFor();
    const key=await page.evaluate(()=>{const p=window.transactionFixture.state().packs[0];return `${p.id}@${p.revision}`;});
    await label('Saved rule pack revision').selectOption(key); await label('Jurisdiction version').fill('1.1');
    await label('Deposit deadline in simulated days').fill('4'); await button('Save rule pack revision').click();
    await page.waitForFunction(()=>window.transactionFixture.state().packs.length===2);
    await label('Compare saved rule pack').selectOption(key); await audit(`${caseName}-rule-revision-comparison`);
    await page.getByRole('checkbox',{name:'I reviewed this exact saved educational rule pack, dates, document sources and permissions.',exact:true}).check();
    await button('Approve exact rule pack').click(); await page.waitForFunction(()=>!!window.transactionFixture.state().packs[1].approval);
    await label('Existing transaction case').selectOption({index:1}); await label('Assigned rule pack').selectOption({index:2});
    await button('Assign revised transaction case').click();
    await page.waitForFunction(()=>window.transactionFixture.state().assignments.length===3);
    assert.equal(await page.evaluate(()=>window.transactionFixture.state().submissions[1].assignment.pack.revision),1,'Prior submitted pack remains exact original source');
    await audit(`${caseName}-reassigned-rules`);
    await context.close(); page=null;
  }
  assert.deepEqual(issues,[],'Browser runtime errors');
  console.log('Transaction browser passed: complete author/review/source-version/assignment, contract counteroffer lineage, client-isolated trust entries/reconciliation, complete and adverse archive, immutable evidence, feedback/comparison, recovery/retry/profile isolation, rule reassignment, keyboard, 320/1280 light/dark, overflow and all WCAG axe tags.');
} catch(error) {
  if(page)await page.screenshot({path:path.join(out,`${current.replace(/[^a-z0-9-]/gi,'-')}-failure.png`),fullPage:true}).catch(()=>{});
  throw error;
} finally {await browser?.close(); await server?.close();}
