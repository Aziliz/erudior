import assert from 'node:assert/strict';
const state=new Map<string,string>(),mutations:string[]=[];
(globalThis as any).isTauri=true;
(globalThis as any).window={__TAURI_INTERNALS__:{invoke:async(command:string,args:any)=>{
 if(command==='load_state')return state.get(args.name)??null;
 if(command==='save_state'){mutations.push(args.name);args.content===null?state.delete(args.name):state.set(args.name,args.content);return;}
 if(command==='compare_and_swap_state'){if((state.get(args.name)??null)!==args.expected)return false;mutations.push(args.name);state.set(args.name,args.content);return true;}
 if(command==='load_progress')return state.get('progress')??null;
 if(command==='save_progress'){mutations.push('progress');state.set('progress',args.content);return;}
 throw Error('Unexpected command '+command);
}}};
const {collect,restoreContents,encryptText,decryptText}=await import('../src/lib/backup.ts');
const library={format:'erudior-presentation-library',version:1,decks:[{format:'erudior-presentation',version:1,id:'one',title:'Teacher resource',revision:3,slides:[{id:'s1',title:'Question',kind:'video',text:'Choose',choices:['A','B'],answer:[1],source:{courseId:'c',courseRevision:2,kind:'question',containerId:'b',resourceId:'q'},videoUrl:'https://media.school.org/video.mp4',transcript:'Full transcript',pauseAt:10}]}]};
state.set('presentations',JSON.stringify(library));
const snapshot=await collect([],[]);assert.deepEqual(snapshot.presentations,library);
const encrypted=await encryptText(JSON.stringify(snapshot),'test-only passphrase');assert(!encrypted.includes('Teacher resource'));
state.delete('presentations');await restoreContents(await decryptText(JSON.parse(encrypted),'test-only passphrase'),{courses:[],banks:[]});assert.deepEqual(JSON.parse(state.get('presentations')!),library);
const before=[...state];mutations.length=0;
const bad=structuredClone(library);bad.decks[0].slides[0].videoUrl='https://127.0.0.1/private';await assert.rejects(restoreContents(JSON.stringify({...snapshot,presentations:bad}),{courses:[],banks:[]}));assert.deepEqual([...state],before);assert.deepEqual(mutations,[],'presentation validation precedes any destructive restore');
await assert.rejects(restoreContents(JSON.stringify({...snapshot,presentations:null}),{courses:[],banks:[]}));assert.deepEqual([...state],before);assert.deepEqual(mutations,[]);
state.set('presentations','{damaged');await assert.rejects(collect([],[]));state.set('presentations',JSON.stringify(library));
const {presentations:_,...legacy}=snapshot;await restoreContents(JSON.stringify(legacy),{courses:[],banks:[]});assert.equal(state.has('presentations'),false,'legacy family restore clears another family library');
console.log('presentation backup: encrypted exact roundtrip, preflight rejection, damaged collection and legacy library clearing passed');
