import { validateCompetencies, type Competency } from './competencies';

/** Offline CASE 1.1 package profile, not a CASE service or certification claim.
 * Model: https://www.imsglobal.org/sites/default/files/spec/case/v1p1/rest_binding/caseservicev1p1_restbindv1p0.html
 * Unknown fields fail closed. Accepted data is cloned, never rendered as HTML or fetched.
 */
export interface CaseLink { identifier: string; uri: string; title: string; targetType?: 'CASE' }
export interface CaseEntity { identifier: string; uri: string; lastChangeDateTime: string; [key: string]: unknown }
export interface CaseDocument extends CaseEntity { title: string; creator: string; caseVersion?: '1.1' }
export interface CaseItem extends CaseEntity { fullStatement: string; humanCodingScheme?: string }
export interface CaseAssociation extends CaseEntity { associationType: string; originNodeURI: CaseLink; destinationNodeURI: CaseLink }
export interface CasePackage { CFDocument: CaseDocument; CFItems: CaseItem[]; CFAssociations: CaseAssociation[]; extensions?: Record<string, unknown> }
export interface CaseMapping { caseItemId: string; localSkillId: string }
export interface CaseReview { format: 'erudior-case-review'; version: 1; package: CasePackage; mappings: CaseMapping[]; warnings: string[] }
export const CASE_LIMITS = { bytes: 2_000_000, items: 2000, associations: 10000, nodes: 100000, text: 50000, depth: 16 } as const;
const GUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const TYPES = new Set(['isChildOf','isPeerOf','isPartOf','exactMatchOf','precedes','isRelatedTo','replacedBy','exemplar','hasSkillLevel','isTranslationOf']);
function fail(path: string, why: string): never { throw Error(`CASE ${path}: ${why}`); }
const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x));
function object(x: unknown, path: string): Record<string, unknown> {
  if (!x || typeof x !== 'object' || Array.isArray(x) || ![Object.prototype, null].includes(Object.getPrototypeOf(x))) fail(path,'plain object required');
  return x as Record<string,unknown>;
}
function text(x: unknown, path: string, empty = false): asserts x is string {
  if (typeof x !== 'string' || (!empty && !x.trim()) || x.length > CASE_LIMITS.text || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(x)) fail(path,'bounded text required');
}
function uri(x: unknown, path: string) {
  text(x,path); let u: URL; try { u = new URL(x); } catch { return fail(path,'absolute HTTP(S) URI required'); }
  if (!['https:','http:'].includes(u.protocol) || u.username || u.password || x.length > 2048) fail(path,'unsafe URI');
}
function guid(x: unknown, path: string) { if (typeof x !== 'string' || !GUID.test(x)) fail(path,'lowercase UUID required'); }
function date(x: unknown, path: string, onlyDate = false) {
  text(x,path); const m=/^(\d{4})-(\d{2})-(\d{2})(.*)$/.exec(x);
  if (!m || !Number.isFinite(Date.parse(x)) || (onlyDate ? m[4] !== '' : !/^T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(m[4]))) fail(path,'ISO date/time required');
  const days = new Date(Date.UTC(+m[1],+m[2],0)).getUTCDate();
  if (+m[2]<1 || +m[2]>12 || +m[3]<1 || +m[3]>days) fail(path,'invalid calendar date');
}
function keys(x: Record<string,unknown>, allowed: string[], path: string) { for (const k of Object.keys(x)) if (!allowed.includes(k)) fail(`${path}.${k}`,'unsupported field; refusing lossy conversion'); }
function link(x: unknown,path: string,generic=false) {
  const o=object(x,path); keys(o,['identifier','uri','title',...(generic?['targetType']:[])],path); guid(o.identifier,path+'.identifier'); uri(o.uri,path+'.uri'); text(o.title,path+'.title',true);
  if (o.targetType !== undefined && o.targetType !== 'CASE') fail(path,'non-CASE targets are outside this profile');
}
function bounded(raw: unknown) {
  let nodes=0; const seen=new Set<object>();
  const visit=(v:unknown,depth:number):void=>{
    if (++nodes>CASE_LIMITS.nodes || depth>CASE_LIMITS.depth) fail('package','structural limit exceeded');
    if (typeof v==='string') {text(v,'value',true);return;}
    if (v===null || typeof v==='boolean' || typeof v==='number' && Number.isFinite(v)) return;
    if (!v || typeof v!=='object') fail('package','JSON values required');
    if (seen.has(v)) fail('package','cyclic/shared objects not supported'); seen.add(v);
    if (!Array.isArray(v)) object(v,'package');
    if (Array.isArray(v) && Object.keys(v).length!==v.length) fail('package','sparse arrays not supported');
    for (const [k,val] of Object.entries(v)) { if (['__proto__','prototype','constructor'].includes(k)) fail('package','reserved key'); visit(val,depth+1); }
    seen.delete(v);
  }; visit(raw,0);
  if (new TextEncoder().encode(JSON.stringify(raw)).length>CASE_LIMITS.bytes) fail('package','byte limit exceeded');
}
const common=['identifier','uri','lastChangeDateTime','extensions'];
const metadata=['notes','language','subject','subjectURI','licenseURI','statusStartDate','statusEndDate'];
function entity(value:unknown,path:string,fields:string[]) {
  const o=object(value,path);keys(o,[...common,...fields],path);guid(o.identifier,path+'.identifier');uri(o.uri,path+'.uri');date(o.lastChangeDateTime,path+'.lastChangeDateTime');
  for(const [k,v] of Object.entries(o)) {
    if(common.includes(k)) { if(k==='extensions') object(v,path+'.extensions'); continue; }
    if (['originNodeURI','destinationNodeURI','CFAssociationGroupingURI'].includes(k)) {link(v,path+'.'+k,k!=='CFAssociationGroupingURI');continue;}
    if(k.endsWith('URI')) { if(k==='subjectURI'){if(!Array.isArray(v))fail(path+'.'+k,'array required');v.forEach((a,i)=>link(a,`${path}.${k}[${i}]`));}else link(v,path+'.'+k);continue;}
    if(['subject','conceptKeywords','educationLevel'].includes(k)){if(!Array.isArray(v))fail(path+'.'+k,'array required');v.forEach(a=>text(a,path+'.'+k));continue;}
    if(k==='sequenceNumber'){if(!Number.isSafeInteger(v)||Number(v)<0)fail(path+'.'+k,'nonnegative integer required');continue;}
    if(k==='officialSourceURL'){uri(v,path+'.'+k);continue;}
    if(k==='statusStartDate'||k==='statusEndDate'){date(v,path+'.'+k,true);continue;}
    text(v,path+'.'+k,true);
  }
  return o;
}
export function parseCasePackage(input: string | unknown): CasePackage {
  let raw:unknown=input;
  if(typeof input==='string') {if(new TextEncoder().encode(input).length>CASE_LIMITS.bytes)fail('package','byte limit exceeded');try{raw=JSON.parse(input);}catch{fail('package','invalid JSON');}}
  bounded(raw);const p=object(raw,'package');keys(p,['CFDocument','CFItems','CFAssociations','extensions'],'package');
  if(p.extensions!==undefined)object(p.extensions,'extensions');
  const d=entity(p.CFDocument,'CFDocument',[...metadata,'title','creator','caseVersion','frameworkType','officialSourceURL','publisher','description','version','adoptionStatus']);
  text(d.title,'CFDocument.title');text(d.creator,'CFDocument.creator');
  if(d.caseVersion!==undefined&&d.caseVersion!=='1.1')fail('CFDocument.caseVersion','only 1.1 accepted');
  if(!Array.isArray(p.CFItems)||p.CFItems.length>CASE_LIMITS.items)fail('CFItems','bounded array required');
  if(!Array.isArray(p.CFAssociations)||p.CFAssociations.length>CASE_LIMITS.associations)fail('CFAssociations','bounded array required');
  const ids=new Set<string>(),uris=new Set<string>(); const known=new Map<string,string>();
  const identity=(o:Record<string,unknown>)=>{if(ids.has(o.identifier as string)||uris.has(o.uri as string))fail('package','duplicate identifier or URI');ids.add(o.identifier as string);uris.add(o.uri as string);};
  identity(d);known.set(d.identifier as string,d.uri as string);
  p.CFItems.forEach((value,i)=>{const o=entity(value,`CFItems[${i}]`,[...metadata,'fullStatement','alternativeLabel','CFItemType','humanCodingScheme','listEnumeration','abbreviatedStatement','conceptKeywords','conceptKeywordsURI','educationLevel','CFItemTypeURI']);text(o.fullStatement,`CFItems[${i}].fullStatement`);identity(o);known.set(o.identifier as string,o.uri as string);});
  p.CFAssociations.forEach((value,i)=>{const o=entity(value,`CFAssociations[${i}]`,['associationType','sequenceNumber','originNodeURI','destinationNodeURI','CFAssociationGroupingURI','notes']);if(!TYPES.has(o.associationType as string))fail(`CFAssociations[${i}]`,'unsupported association type');link(o.originNodeURI,'originNodeURI',true);link(o.destinationNodeURI,'destinationNodeURI',true);identity(o);for(const k of ['originNodeURI','destinationNodeURI']){const l=o[k] as CaseLink;if(known.has(l.identifier)&&known.get(l.identifier)!==l.uri)fail(k,'identifier/URI mismatch');if([...known.values()].includes(l.uri)&&known.get(l.identifier)!==l.uri)fail(k,'URI/identifier mismatch');}});
  return clone(p) as unknown as CasePackage;
}
export function serializeCasePackage(pkg: CasePackage): string { return JSON.stringify(parseCasePackage(pkg),null,2); }
export function createCaseReview(pkg: CasePackage, mappings: CaseMapping[], skills: Pick<Competency,'id'|'title'>[]): CaseReview {
  const source=parseCasePackage(pkg);if(!Array.isArray(mappings)||mappings.length>CASE_LIMITS.items)fail('mappings','bounded array required');
  const existing=new Set(skills.map(s=>s.id)),items=new Set(source.CFItems.map(s=>s.identifier)),seen=new Set<string>();
  for(const m of mappings){const o=object(m,'mapping');keys(o,['caseItemId','localSkillId'],'mapping');if(!items.has(m.caseItemId)||!existing.has(m.localSkillId)||seen.has(m.caseItemId))fail('mapping','unknown or duplicate mapping');seen.add(m.caseItemId);}
  const warnings=['Unverified external framework. Mappings are review drafts only: no local graph, mastery, prerequisites or credit is changed.','Association order is preserved; imported precedes relationships are not interpreted as local prerequisites.'];
  const known=new Set([source.CFDocument.identifier,...items]);
  if(source.CFAssociations.some(a=>!known.has(a.originNodeURI.identifier)||!known.has(a.destinationNodeURI.identifier)))warnings.push('External association targets are retained but not fetched or verified.');
  if(JSON.stringify(source).includes('"extensions":'))warnings.push('Extensions are preserved as opaque data, not interpreted.');
  return {format:'erudior-case-review',version:1,package:source,mappings:clone(mappings),warnings};
}
/** Reopen a draft without trusting saved warnings or installing external mappings. */
export function parseCaseReview(input: string | unknown, skills: Pick<Competency,'id'|'title'>[]): CaseReview {
  let raw:unknown=input;
  if(typeof input==='string') { if(new TextEncoder().encode(input).length>CASE_LIMITS.bytes)fail('review','byte limit exceeded');try{raw=JSON.parse(input);}catch{fail('review','invalid JSON');} }
  bounded(raw);const r=object(raw,'review');keys(r,['format','version','package','mappings','warnings'],'review');
  if(r.format!=='erudior-case-review'||r.version!==1)fail('review','unsupported format/version');
  if(r.warnings!==undefined&&(!Array.isArray(r.warnings)||r.warnings.some(w=>typeof w!=='string')))fail('review','invalid warnings');
  return createCaseReview(parseCasePackage(r.package),r.mappings as CaseMapping[],skills);
}
/** UUIDv5 (RFC namespace URL) keeps public content identity stable, without learner data. */
async function stableId(name:string):Promise<string>{
  const ns=Uint8Array.from('6ba7b8119dad11d180b400c04fd430c8'.match(/../g)!,v=>parseInt(v,16));const bytes=new TextEncoder().encode(name),data=new Uint8Array(ns.length+bytes.length);data.set(ns);data.set(bytes,ns.length);
  const hash=new Uint8Array(await crypto.subtle.digest('SHA-1',data));hash[6]=(hash[6]&15)|80;hash[8]=(hash[8]&63)|128;
  const hex=Array.from(hash.slice(0,16),v=>v.toString(16).padStart(2,'0')).join('');return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}
export interface CaseExportOptions { namespace:string; title:string; creator:string; lastChangeDateTime:string; identifier?:string }
export async function exportSkillsToCase(skills: Competency[],options:CaseExportOptions):Promise<CasePackage>{
  if(!Array.isArray(skills)||!skills.length||skills.length>CASE_LIMITS.items)fail('skills','select a bounded nonempty graph');
  if(skills.some(s=>!s||!Array.isArray(s.prerequisites))||skills.reduce((n,s)=>n+1+s.prerequisites.length,0)>CASE_LIMITS.associations)fail('skills','association limit exceeded');
  const errors=validateCompetencies(skills);if(errors.length)fail('skills',errors.join('; '));
  uri(options.namespace,'namespace');const base=options.namespace.replace(/\/+$/,'');const url=new URL(base);if(url.search||url.hash)fail('namespace','query and fragment not supported');
  const identifier=options.identifier??await stableId(base+'#framework');guid(identifier,'identifier');date(options.lastChangeDateTime,'lastChangeDateTime');text(options.title,'title');text(options.creator,'creator');
  const d:CaseDocument={identifier,uri:base+'/CFDocuments/'+identifier,title:options.title,creator:options.creator,lastChangeDateTime:options.lastChangeDateTime,caseVersion:'1.1'};
  const items:CaseItem[]=[];for(const s of skills){const id=await stableId(base+'#skill/'+s.id);items.push({identifier:id,uri:base+'/CFItems/'+id,fullStatement:s.title,humanCodingScheme:s.id,lastChangeDateTime:options.lastChangeDateTime});}
  const byId=new Map(items.map(i=>[i.humanCodingScheme!,i]));const associations:CaseAssociation[]=[];
  const ref=(i:CaseEntity):CaseLink=>({identifier:i.identifier,uri:i.uri,title:String(i.fullStatement??i.title)});
  const add=async(type:string,origin:CaseEntity,dest:CaseEntity,notes?:string)=>{const id=await stableId(base+'#association/'+type+'/'+origin.identifier+'/'+dest.identifier);associations.push({identifier:id,uri:base+'/CFAssociations/'+id,associationType:type,originNodeURI:ref(origin),destinationNodeURI:ref(dest),lastChangeDateTime:options.lastChangeDateTime,...(notes?{notes}:{})});};
  for(const s of skills){await add('isChildOf',byId.get(s.id)!,d);for(const required of s.prerequisites)await add('precedes',byId.get(required)!,byId.get(s.id)!,'Exported local prerequisite ordering. CASE precedes alone does not assert mastery or completion.');}
  return parseCasePackage({CFDocument:d,CFItems:items,CFAssociations:associations});
}
