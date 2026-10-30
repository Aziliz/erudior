import assert from 'node:assert/strict';
const values=new Map<string,string>(),writes:string[]=[];
(globalThis as any).isTauri=true;
(globalThis as any).window={__TAURI_INTERNALS__:{invoke:async(command:string,args:any)=>{
 if(command==='load_state')return values.get(args.name)??null;
 if(command==='save_state'){writes.push(args.name);args.content===null?values.delete(args.name):values.set(args.name,args.content);return;}
 if(command==='compare_and_swap_state'){if((values.get(args.name)??null)!==args.expected)return false;writes.push(args.name);values.set(args.name,args.content);return true;}
 throw Error('Unexpected '+command);
}}};
const {collect,restoreContents}=await import('../src/lib/backup.ts');
values.set('family',JSON.stringify({format:'erudior-family',version:1,students:[{id:'alice',name:'Synthetic legacy'}]}));
const backup=await collect([],[]);
await restoreContents(JSON.stringify(backup),{courses:[],banks:[]});assert.deepEqual(JSON.parse(values.get('family')!).students[0].assigned,[]);
for(const assigned of [null,{},'malformed',[null],[{courseId:'fixture',subject:42}]]){
 const corrupt={...backup,family:{...backup.family,students:[{id:'alice',name:'Synthetic',assigned}]}};
 writes.length=0;const before=[...values];await assert.rejects(restoreContents(JSON.stringify(corrupt),{courses:[],banks:[]}),/Invalid family assignments/);assert.deepEqual(writes,[]);assert.deepEqual([...values],before);
}
const imported={...backup,family:{...backup.family,students:[{id:'alice',name:'Synthetic',assigned:[{courseId:'community-fixture',subject:'Science',communityReview:{learnerId:'alice',contentDigest:'fabricated'}}]}]}};
await restoreContents(JSON.stringify(imported),{courses:[],banks:[]});assert.equal(JSON.parse(values.get('family')!).students[0].assigned[0].communityReview,undefined);
console.log('Parent planning backup: missing legacy assignments safe-empty; malformed preflight zero writes; imported review never authority.');
