import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { generate } from '../src/lib/drills.ts';
import type { Drill } from '../src/lib/exerciseTypes.ts';
const base:Drill={id:'finite-recovery',title:'Synthetic finite-domain recovery',vars:{x:{choices:[0,1]}},where:['x == 1'],prompt:'Value {x}',answer:'x',format:'number',solution:'Value {x}'};
function random<T>(next:(call:number)=>number,run:()=>T):{result:T;calls:number}{const original=Math.random;let calls=0;Math.random=()=>next(calls++);try{return {result:run(),calls};}finally{Math.random=original;}}
const choices=Array.from({length:8},(_,i)=>i);
const triple:Drill={...base,vars:{k:{choices},ans:{choices},how:{choices}},where:['k == ans','k == how','k == 7'],answer:'k'};
const recovered=random(call=>[0,0.125,0.25][call%3],()=>generate(triple));
assert.equal(recovered.calls,1500,'all500 random candidates fail; fallback consumes no randomness');assert.deepEqual(recovered.result.values,{k:7,ans:7,how:7});
// The exact public bundled drill that exposed probabilistic release validation failure.
const trigCourse=JSON.parse(readFileSync('samples/math/math-trigonometry.json','utf8'));
const trig=trigCourse.drills.find((drill:Drill)=>drill.id==='trig-d-simplify') as Drill;
assert(trig,'existing release fixture remains present');
const trigRecovery=random(call=>[0,0.2,0.3][call%3],()=>generate(trig));assert.equal(trigRecovery.calls,1500);assert.equal(trigRecovery.result.values.k,trigRecovery.result.values.ans);assert.equal(trigRecovery.result.values.k,trigRecovery.result.values.how);assert(trigRecovery.result.prompt.trim());assert(trigRecovery.result.solution.trim());
const normal=random(()=>0.9,()=>generate(base));assert.equal(normal.calls,1,'ordinary success does not run fallback or reroll');assert.equal(normal.result.answer,1);
const lateRandom=random(call=>call===499?0.9:0,()=>generate(base));assert.equal(lateRandom.calls,500);assert.equal(lateRandom.result.answer,1,'500th random success remains intact');
const enriched:Drill={...base,vars:{x:{choices:[{label:'Bad label',value:-1},{label:'Selected label',value:4}]},word:{choices:['kept']}},funcs:{'f(t)':'t * 2'},calc:{root:'sqrt(x)',twice:'f(root)',result:'twice + 1'},where:['root == 2','result == 5'],prompt:'{x}: {word} = {result}',solution:'{x} gives {root}',answer:'result',figure:{type:'plot',caption:'{x} figure'}};
const labelResult=random(()=>0,()=>generate(enriched));assert.equal(labelResult.calls,1000);assert.equal(labelResult.result.answer,5);assert.equal(labelResult.result.prompt,'Selected label: kept = 5');assert.equal(labelResult.result.solution,'Selected label gives 2');assert.equal(labelResult.result.figures[0].caption,'Selected label figure');
const fractional=random(()=>0,()=>generate({...base,vars:{x:{min:0,max:0.3,step:0.1}},where:['x == 0.2']}));assert.equal(fractional.calls,500);assert.equal(fractional.result.values.x,0.2,'range recovery uses the existing random rounding');
const boundary=random(()=>0,()=>generate({...base,vars:{x:{min:0,max:99},y:{min:0,max:99}},where:['x == 99','y == 99']}));assert.equal(boundary.calls,1000);assert.equal(boundary.result.values.x,99);assert.equal(boundary.result.values.y,99,'inclusive10,000-combination bound is searched');
const bounded=random(()=>0,()=>assert.throws(()=>generate({...base,vars:{x:{min:0,max:100},y:{min:0,max:99}},where:['x == 100','y == 99']}),/no inputs met.*500 tries/));assert.equal(bounded.calls,1000,'overbound finite domain retains bounded random failure rather than partially searching');
const huge=random(()=>0,()=>assert.throws(()=>generate({...base,vars:{x:{min:0,max:Number.MAX_SAFE_INTEGER}},where:['x < 0']}),/no inputs met.*500 tries/));assert.equal(huge.calls,500,'unsafe domain count never allocates an enormous array');
const manyVariables=Object.fromEntries(Array.from({length:101},(_,i)=>[`v${i}`,{choices:[0]}]));
const wide=random(()=>0,()=>assert.throws(()=>generate({...base,vars:manyVariables,where:['v0 == 1']}),/no inputs met.*500 tries/));assert.equal(wide.calls,50500,'more than100 variables never enters exhaustive recovery');
const impossible=random(()=>0,()=>assert.throws(()=>generate({...base,where:['x == 2']}),/no inputs met.*500 tries/));assert.equal(impossible.calls,500);
random(()=>0,()=>assert.throws(()=>generate({...base,calc:{y:'sqrt(-1)'},where:undefined}),/y = sqrt\(-1\)/,'unconstrained calc failures still throw immediately'));
random(()=>0,()=>assert.throws(()=>generate({...base,where:['unknownVariable > 0']}),/where.*Unknown/,'invalid constraint syntax/name still throws'));
random(()=>0,()=>assert.throws(()=>generate({...base,funcs:{'bad(':'x'}}),/Synthetic finite-domain recovery/,'function compilation failures retain title context'));
// A failure encountered only on an enumerated candidate must not be swallowed.
random(()=>0,()=>assert.throws(()=>generate({...base,calc:{y:'sqrt(x - 1)'},where:['unknownVariable > 0']}),/where.*Unknown/));
console.log('Drill recovery: adversarial500 misses, bounded exhaustive domains, unchanged random success, labels/functions/calcs/figures, exact range rounding and failure semantics passed');
