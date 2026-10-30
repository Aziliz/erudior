/** Explicit audio source traversal. Never interpret arbitrary text or fetch authored references. */
import type {PortableAuthoredCourse} from './canonicalAuthoring';
import {scanLessonFences} from './lessonFences';
import {readerMarkdownParts} from './readerMarkdownAssets';
type Span = {start:number;end:number;src:string};
function audioSpans(source:string):Span[] {
 const result:Span[]=[];
 for(const fence of scanLessonFences(source)) {
  if(!fence.interactive || !['dialogue','speak','sounds','blend'].includes(fence.kind))continue;
  const bodyStart=source.indexOf('\n',fence.start)+1;
  for(const line of fence.body.matchAll(/[^\r\n]+/g)) {
   const raw=line[0],trim=raw.trim();if(!trim || trim.startsWith('#'))continue;
   const offset=bodyStart+line.index!;
   if(fence.kind==='dialogue'||fence.kind==='speak') {
    const match=/^\s*audio:[ \t]*(.*?)[ \t]*$/i.exec(raw);
    if(match && match[1]) { const start=offset+raw.indexOf(':')+1+(raw.slice(raw.indexOf(':')+1).length-raw.slice(raw.indexOf(':')+1).trimStart().length);result.push({start,end:start+match[1].length,src:match[1]}); }
   } else if(fence.kind==='sounds') {
    // Same token boundaries as phonicsSpec; only the effective last sound= option is used.
    let found:Span|undefined;
    for(const match of raw.matchAll(/([A-Za-z]+)=(?:"([^"]*)"|(\S+))|"([^"]*)"|(\S+)/g)) {
     if(match[1]?.toLowerCase()!=='sound')continue;
     const src=match[2]??match[3]??'';const start=offset+match.index!+match[1].length+1+(match[2]!==undefined?1:0);
     found=src.startsWith('data:')?{start,end:start+src.length,src}:undefined;
    }
    if(found)result.push(found);
   } else {
    const equal=raw.indexOf('=');if(equal<0)continue;
    for(const match of raw.slice(equal+1).matchAll(/\S+/g)) {
     const unit=/^(.+?)\[(.+)\]$/.exec(match[0]);if(!unit || !unit[2].startsWith('data:'))continue;
     const start=offset+equal+1+match.index!+unit[1].length+1;result.push({start,end:start+unit[2].length,src:unit[2]});
    }
   }
  }
 }
 return result;
}
export function transformOfflineAudio<T extends PortableAuthoredCourse>(course:T,map:(source:string)=>string,maxBytes=24*1024*1024):T {
 const size=(value:unknown)=>new TextEncoder().encode(JSON.stringify(value)).length;
 let bytes=size(course);if(bytes>maxBytes)throw Error('Offline audio expansion exceeds total byte limit');
 const result=structuredClone(course);
 function replace(previous:string):string {const next=map(previous);bytes+=size(next)-size(previous);if(bytes>maxBytes)throw Error('Offline audio expansion exceeds total byte limit');return next;}
 function markdown(source:string,readerKind?:string,reader=false):string {
  const spans=reader?readerMarkdownParts(source,readerKind).flatMap(part=>audioSpans(part.source).map(span=>{
   const start=part.positions[span.start],last=part.positions[span.end-1];
   if(start===undefined||last===undefined||source.slice(start,last+1)!==span.src)throw Error('Reader audio source cannot be mapped losslessly');
   return {...span,start,end:last+1};
  })):audioSpans(source);
  let value=source;
  for(const span of spans.sort((a,b)=>b.start-a.start)){const next=replace(span.src);value=value.slice(0,span.start)+next+value.slice(span.end);}
  return value;
 }
 const md=(owner:any,key:string)=>{if(typeof owner?.[key]==='string')owner[key]=markdown(owner[key]);};
 if(result.audio)for(const key of Object.keys(result.audio))if(!/^say:/i.test(result.audio[key]))result.audio[key]=replace(result.audio[key]);
 for(const bank of result.banks)for(const question of bank.questions){
  if(question.audio?.src)question.audio.src=replace(question.audio.src);
  if(question.listen?.startsWith('data:'))question.listen=replace(question.listen);
  if(question.type==='code'){md(question,'stem');if(question.code?.hints)question.code.hints=question.code.hints.map(value=>markdown(value));}
 }
 for(const item of result.vocab??[])if(item.audio)item.audio=replace(item.audio);
 for(const lesson of result.lessons)md(lesson,'body');
 for(const ref of result.references)md(ref,'body');
 for(const deck of result.decks)for(const card of deck.cards){md(card,'front');md(card,'back');}
 for(const drill of result.drills){md(drill,'prompt');md(drill,'solution');}
 for(const text of result.texts??[]){md(text,'about');for(const section of text.sections)section.body=markdown(section.body,text.kind,true);}
 for(const writing of result.writing??[])md(writing,'prompt');
 for(const lab of result.labs??[]){md(lab,'intro');for(const step of lab.steps)md(step,'text');for(const question of lab.questions??[])md(question,'prompt');}
 if(result.activityLog)md(result.activityLog,'prompt');
 return result;
}
