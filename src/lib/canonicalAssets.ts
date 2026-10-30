import { transformReaderMarkdownImages } from './readerMarkdownAssets';
/** Explicit semantic traversal shared by ownership checks and offline installation. */
import { markdownImageAssets, transformMarkdownImages } from './markdownAssets';
import type { PortableAuthoredCourse } from './canonicalAuthoring';
export function transformCanonicalAssets<T extends PortableAuthoredCourse>(course:T, image:(src:string)=>string, options:{maxBytes?:number}={}):T {
 const size=(value:unknown)=>new TextEncoder().encode(JSON.stringify(value)).length;
 let bytes=size(course);const max=options.maxBytes??32*1024*1024;
 if(bytes>max)throw Error("Canonical asset expansion exceeds total byte limit");
 const reserve=(previous:string,next:string)=>{bytes+=size(next)-size(previous);if(bytes>max)throw Error("Canonical asset expansion exceeds total byte limit");};
 const result=structuredClone(course);
 const md=(owner:any,key:string)=>{if(typeof owner?.[key]==='string')owner[key]=transformMarkdownImages(owner[key],image,reserve);};
 for(const lesson of result.lessons)md(lesson,'body');
 for(const ref of result.references)md(ref,'body');
 for(const deck of result.decks)for(const card of deck.cards){md(card,'front');md(card,'back');}
 for(const bank of result.banks)for(const q of bank.questions){
  if(q.image){const next=image(q.image.src);reserve(q.image.src,next);q.image.src=next;}
  if(q.type==='code'){
   md(q,'stem');
   if(q.code?.hints)q.code.hints=q.code.hints.map(value=>transformMarkdownImages(value,image,reserve));
  }
 }
 for(const drill of result.drills){md(drill,'prompt');md(drill,'solution');}
 for(const text of result.texts??[]){md(text,'about');for(const section of text.sections)section.body=transformReaderMarkdownImages(section.body,image,reserve,text.kind);}
 for(const writing of result.writing??[])md(writing,'prompt');
 for(const lab of result.labs??[]){md(lab,'intro');for(const step of lab.steps)md(step,'text');for(const question of lab.questions??[])md(question,'prompt');}
 if(result.activityLog)md(result.activityLog,'prompt');
 return result;
}
export function canonicalAssetSources(course:PortableAuthoredCourse):string[]{const refs=new Set<string>();transformCanonicalAssets(course,src=>{refs.add(src);return src;});return [...refs];}
export {markdownImageAssets};
