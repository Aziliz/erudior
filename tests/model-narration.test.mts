// Shared renderer/narration regression. All examples are generic, not private curriculum.
import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {JSDOM} from 'jsdom';
import katex from 'katex';
import {ManipModel} from '../src/components/Manipulative';
import {describe,readSpec,startState,counterAdd,type ManipSpec} from '../src/lib/manip';
import {speechText,elementItem,audioLibrary,markReadUnits,readUnits} from '../src/lib/readAloud';

const dom=new JSDOM('<!doctype html><html lang="en"><body></body></html>');
Object.assign(globalThis,{window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement});
const element=(html:string)=>{const node=document.createElement('div');node.innerHTML=html;return node;};
const clean=(text:string)=>text.replace(/\s+/g,' ').trim().replace(/[.!?]+$/,'');
const specs:ManipSpec[]=[
 {kind:'counters',frames:1,colors:2,count:2,count2:1},
 {kind:'blocks',value:124},
 {kind:'numberline',min:0,max:10,at:4},
 {kind:'fractions',bars:['1/2','2/4']},
 {kind:'clock',time:'2:45'},
 {kind:'coins',start:['quarter','dime','penny']},
];

test('each live model is narrated exactly once without toolbar labels',()=>{
 for(const spec of specs){
  const {model}=readSpec(spec),state=startState(model);
  const markup=renderToStaticMarkup(React.createElement(ManipModel,{model,state,onChange:()=>{}}));
  const el=element(markup),mp=el.querySelector('.mp')!;
  assert.equal(clean(speechText(el)),clean(describe(model,state)),spec.kind);
  assert.equal(clean(speechText(mp)),clean(describe(model,state)),spec.kind+' root');
  assert.equal(el.querySelector('[aria-live="polite"]')?.textContent,describe(model,state));
  assert(el.querySelectorAll('button').length>0,'Controls retained: '+spec.kind);
  for(const button of el.querySelectorAll('button'))assert.equal(button.closest('[aria-hidden="true"], [inert], [hidden]'),null,'Control not hidden: '+spec.kind);
 }
});

test('the description reflects current counters, not initial spec or saved answer keys',()=>{
 const {model}=readSpec({kind:'counters',count:2,readout:false});
 const before=startState(model),after=counterAdd(model,before,1);
 for(const state of [before,after]){
  const el=element(renderToStaticMarkup(React.createElement(ManipModel,{model,state,onChange:()=>{}})));
  assert.equal(clean(speechText(el)),clean(describe(model,state)));
 }
 assert.notEqual(describe(model,before),describe(model,after));
 assert.equal(before.filter(Boolean).length,2,'Reading did not mutate model');
});

test('authored caption, surrounding prose and spoken math are preserved in order',()=>{
 const {model}=readSpec({kind:'counters',count:3});const state=startState(model);
 const markup=renderToStaticMarkup(React.createElement(ManipModel,{model,state,onChange:()=>{}}));
 const el=element('<p>Try a new group.</p><figure>'+markup+'<figcaption>Take away one counter to explore.</figcaption></figure><p>'+katex.renderToString('3-1=2')+'</p>');
 const text=speechText(el);
 assert(text.startsWith('Try a new group.'));assert(text.includes(describe(model,state)));
 assert(text.includes('Take away one counter to explore.'),'Instruction retained despite toolbar terminology');
 assert(text.includes('3 minus 1 equals 2'));assert(text.indexOf(describe(model,state))<text.indexOf('Take away one counter'));
 assert.equal(text.split(describe(model,state)).length-1,1);
});

test('normal figures, images, links, phonics buttons and math stay readable',()=>{
 const el=element('<p><a href="#">A useful link</a></p><figure><svg role="img" aria-label="Three dots"></svg><figcaption>Three objects.</figcaption></figure><p><img alt="A triangle" src="data:image/png;base64,AA=="></p><p><button class="ph-word">cat</button></p>');
 const text=speechText(el);
 for(const wanted of ['A useful link','Three dots','Three objects.','A triangle','cat'])assert(text.includes(wanted));
});

test('description does not override hidden models or suppress unrelated prose',()=>{
 const el=element('<p>Visible words.</p><div hidden><div class="mp"><p aria-live="polite">Hidden state</p>Hidden toolbar</div></div><div aria-hidden="true" class="mp"><p aria-live="polite">Decoration state</p>Hidden control</div><p data-ra-description="not a model">Keep these words.</p>');
 assert.equal(speechText(el),'Visible words. Keep these words.');
});

test('empty model status falls back to the previous reading behavior',()=>{
 assert.equal(speechText(element('<div class="mp"><p aria-live="polite"></p><p>Fallback content.</p></div>')),'Fallback content.');
});

test('read-only model and recorded speech overrides preserve the contract',()=>{
 const {model}=readSpec({kind:'counters',count:4});const state=startState(model);
 const el=element(renderToStaticMarkup(React.createElement(ManipModel,{model,state,disabled:true}))).firstElementChild as HTMLElement;
 assert.equal(el.querySelectorAll('button').length,0);
 const text=speechText(el);const lib=audioLibrary({audio:{[text]:'say:A recorded-text replacement'}});
 assert.equal(elementItem(el,lib).text,'A recorded-text replacement');
 assert.equal(clean(text),clean(describe(model,state)));
});

test('static unhydrated figure remains a read unit with intact caption and alt text',()=>{
 const el=element(markReadUnits('<h2>Try it</h2><figure><div class="mp-mount"><svg role="img" aria-label="Two counters"></svg></div><figcaption>Count this pair.</figcaption></figure>',true));
 const units=readUnits(el);assert.equal(units.length,2);
 assert.equal(clean(speechText(units[1])),'Two counters. Count this pair');
 assert.equal(el.querySelectorAll('button.ra-btn').length,2);
});
