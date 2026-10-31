import type { Course } from './courseContentTypes';
import { presentationSources } from './presentations';
import { validateCourseWork, type CourseWork } from './courseWork';

/** Host-neutral material model. This module grants NO identity, approval or publication authority.
 * Only an authenticated server may supply the current verified source inventory or approve a revision. */
export const STUDIO_KINDS = ['worksheet', 'quiz', 'rubric', 'discussion', 'project', 'lab', 'presentation', 'study-guide'] as const;
export type StudioKind = typeof STUDIO_KINDS[number];
export const STUDIO_LIMITS = { bytes: 500_000, resources: 50, blocks: 200, text: 16000 } as const;
export interface StudioSource { courseId: string; revision: number; digest: string }
/** digest is the verified immutable package hash, not an author-provided assurance of trust. */
export interface StudioInventory { source: StudioSource; course: Course }
export interface StudioBlock { label: string; text: string; choices?: string[]; answer?: number[]; answerText?: string }
export interface StudioResource {
  key: string;
  kind: 'passage' | 'question' | 'rubric' | 'writing' | 'lab';
  title: string;
  source: StudioSource;
  blocks: StudioBlock[];
  /** Preserve canonical learner-facing assessed-work structure without flattening IDs or settings. */
  work?: CourseWork;
}
export interface StudioDocument {
  format: 'erudior-studio-material'; version: 1; id: string; revision: number;
  kind: StudioKind; title: string; instructions: string; teacherNotes: string; resources: StudioResource[];
}
export interface StudioApproval { revision: number; digest: string; reviewedBy: string; reviewedAt: string }
const obj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v) && [Object.prototype, null].includes(Object.getPrototypeOf(v));
function fail(message: string): never { throw new Error(message); }
const keys = (v: Record<string, unknown>, allowed: string[]) => Object.keys(v).every(k => allowed.includes(k));
const string = (v: unknown, max: number, empty = false): v is string => typeof v === 'string' && v.length <= max && (empty || !!v.trim()) && !/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(v);
const identifier = (v: unknown): v is string => typeof v === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(v);
/** Rich Markdown/media stays in canonical course lessons. Studio renders these strings as text only. */
const inert = (v: unknown, max: number = STUDIO_LIMITS.text): v is string => string(v, max, true) && !/<\/?[a-z]|```|!\[|\]\(|\[\[/i.test(v);
const revision = (v: unknown, minimum = 1): v is number => Number.isSafeInteger(v) && Number(v) >= minimum;
const sourceKey = (s: StudioSource) => `${s.courseId}@${s.revision}:${s.digest}`;
function parseSource(v: unknown): StudioSource {
  if (!obj(v) || !keys(v, ['courseId','revision','digest']) || !identifier(v.courseId) || !revision(v.revision) || typeof v.digest !== 'string' || !/^[a-f0-9]{64}$/.test(v.digest)) fail('Invalid verified source reference.');
  return {courseId: v.courseId as string, revision: v.revision as number, digest: v.digest as string};
}
function parseBlock(v: unknown): StudioBlock {
  if (!obj(v) || !keys(v, ['label','text','choices','answer','answerText']) || !inert(v.label,300) || !inert(v.text)) fail('Invalid or unsupported material text.');
  const block: StudioBlock = {label:v.label as string,text:v.text as string};
  if (v.choices !== undefined || v.answer !== undefined) {
    if (!Array.isArray(v.choices) || v.choices.length < 2 || v.choices.length > 8 || !v.choices.every(c=>inert(c,2000)&&!!c.trim()) || !Array.isArray(v.answer) || !v.answer.length || new Set(v.answer).size !== v.answer.length || !v.answer.every(a=>Number.isSafeInteger(a)&&Number(a)>=0&&Number(a)<(v.choices as unknown[]).length)) fail('Invalid question choices or teacher answer.');
    block.choices = [...v.choices] as string[]; block.answer = [...v.answer] as number[];
  }
  if (v.answerText !== undefined) { if (!inert(v.answerText)) fail('Invalid teacher answer text.'); block.answerText=v.answerText; }
  return block;
}
function parseResource(v: unknown): StudioResource {
  if (!obj(v) || !keys(v,['key','kind','title','source','blocks','work']) || !string(v.key,500) || !['passage','question','rubric','writing','lab'].includes(v.kind as string) || !inert(v.title,300) || !Array.isArray(v.blocks) || !v.blocks.length || v.blocks.length>STUDIO_LIMITS.blocks) fail('Invalid material resource.');
  const resource:StudioResource={key:v.key as string,kind:v.kind as StudioResource['kind'],title:v.title as string,source:parseSource(v.source),blocks:v.blocks.map(parseBlock)};
  if (['rubric','writing','lab'].includes(resource.kind)) {
    if (!obj(v.work) || !keys(v.work,['rubrics','writing','labs']) || validateCourseWork(v.work).length) fail('Invalid canonical material structure.');
    const work=v.work as CourseWork;
    if (resource.kind==='rubric' && (work.rubrics?.length!==1 || work.writing!==undefined || work.labs!==undefined) || resource.kind==='writing' && (work.writing?.length!==1 || work.labs!==undefined) || resource.kind==='lab' && (work.labs?.length!==1 || work.writing!==undefined)) fail('Incompatible canonical material structure.');
    resource.work=structuredClone(work);
  } else if(v.work!==undefined) fail('Unexpected canonical work in a passage or question.');
  return resource;
}
const allowed: Record<StudioKind, readonly StudioResource['kind'][]> = {
  worksheet:['passage','question'], quiz:['question'], rubric:['rubric'], discussion:['passage','writing'],
  project:['writing','rubric'], lab:['lab','rubric'], presentation:['passage','question'], 'study-guide':['passage','question'],
};
function compatible(kind: StudioKind, resources: StudioResource[]): boolean {
  return resources.every(r=>allowed[kind].includes(r.kind)) &&
    (!resources.length || kind !== 'project' || resources.some(r=>r.kind==='writing')) && (!resources.length || kind !== 'lab' || resources.some(r=>r.kind==='lab'));
}
/** A bounded JSON snapshot, deliberately without any approval/account/official-status fields. */
export function parseStudioDocument(input: unknown): StudioDocument {
  if (typeof input === 'string') {
    if (new TextEncoder().encode(input).length>STUDIO_LIMITS.bytes) fail('Material exceeds the import limit.');
    input=JSON.parse(input);
  }
  let encoded: string;
  try { encoded=JSON.stringify(input); } catch { return fail('Material must be bounded JSON.'); }
  if (!encoded! || new TextEncoder().encode(encoded).length>STUDIO_LIMITS.bytes) fail('Material exceeds the import limit.');
  const v=input;
  if (!obj(v) || !keys(v,['format','version','id','revision','kind','title','instructions','teacherNotes','resources']) || v.format!=='erudior-studio-material' || v.version!==1 || !identifier(v.id) || !revision(v.revision,0) || !STUDIO_KINDS.includes(v.kind as StudioKind) || !inert(v.title,300) || !(v.title as string).trim() || !inert(v.instructions) || !inert(v.teacherNotes) || !Array.isArray(v.resources) || v.resources.length>STUDIO_LIMITS.resources) fail('Invalid material format or limits.');
  const resources=v.resources.map(parseResource), kind=v.kind as StudioKind;
  if (new Set(resources.map(r=>`${sourceKey(r.source)}/${r.key}`)).size!==resources.length || !compatible(kind,resources)) fail('Duplicate or incompatible material resources.');
  return {format:'erudior-studio-material',version:1,id:v.id as string,revision:v.revision as number,kind,title:v.title as string,instructions:v.instructions as string,teacherNotes:v.teacherNotes as string,resources};
}
/** Inventory is supplied by the trusted loader. Local imports cannot register sources here. */
export function studioResources(inventory: readonly StudioInventory[]): { resources: StudioResource[]; excluded: number } {
  const resources:StudioResource[]=[], counts=new Map<string,number>(); let excluded=0;
  for(const entry of inventory) counts.set(entry.source.courseId,(counts.get(entry.source.courseId)||0)+1);
  for(const entry of inventory) {
    const source=parseSource(entry.source), c=entry.course;
    if(c.id!==source.courseId || c.revision!==source.revision || counts.get(c.id)!==1) {excluded++;continue;}
    const add=(key:string,kind:StudioResource['kind'],title:string,blocks:StudioBlock[],work?:CourseWork)=>{
      try {resources.push(parseResource({key,kind,title,source,blocks,...(work?{work}:{})}));}catch{excluded++;}
    };
    const slides=presentationSources([c]); excluded+=slides.excluded;
    for(const slide of slides.slides) {
      if(slide.kind==='video') {excluded++;continue;}
      if(slide.source.kind==='card') {
        const card=c.decks.find(d=>d.id===slide.source.containerId)?.cards.find(card=>card.id===slide.source.resourceId);
        if(!card) {excluded++;continue;}
        add(slide.id,'passage',slide.title,[{label:slide.title,text:card.front,answerText:card.back}]);
      } else add(slide.id,slide.kind==='question'?'question':'passage',slide.title,[{label:slide.title,text:slide.text,...(slide.kind==='question'?{choices:slide.choices,answer:slide.answer}:{})}]);
    }
    if(validateCourseWork(c).length) {excluded+=(c.rubrics?.length??0)+(c.writing?.length??0)+(c.labs?.length??0);continue;}
    const rubricBlocks=(id:string):StudioBlock[] => (c.rubrics?.find(r=>r.id===id)?.criteria??[]).map(criterion=>({label:criterion.name,text:[criterion.description??'',...criterion.levels.map(level=>`${level.points}: ${level.label}${level.description?' — '+level.description:''}`)].filter(Boolean).join('\n')}));
    for(const rubric of c.rubrics??[]) add(`rubric/${rubric.id}`,'rubric',rubric.title??rubric.id,rubricBlocks(rubric.id),{rubrics:[rubric]});
    for(const writing of c.writing??[]) add(`writing/${writing.id}`,'writing',writing.title,[{label:writing.title,text:writing.prompt},...(writing.words?[{label:'Word target',text:`Minimum: ${writing.words.min??'not specified'}; maximum: ${writing.words.max??'not specified'}`}]:[]),...(writing.minutes?[{label:'Suggested minutes',text:String(writing.minutes)}]:[]),...(writing.rubric?[{label:'Source rubric',text:writing.rubric},...rubricBlocks(writing.rubric)]:[])],{writing:[writing],...(writing.rubric?{rubrics:c.rubrics?.filter(r=>r.id===writing.rubric)}:{})});
    for(const lab of c.labs??[]) add(`lab/${lab.id}`,'lab',lab.title,[
      {label:'Adult supervision',text:lab.adult?'An adult must be present for the whole lab.':'Follow the source safety instructions.'},
      {label:'Safety',text:lab.safety.join('\n')},{label:'Introduction',text:lab.intro??''},{label:'Materials',text:lab.materials.join('\n')},
      ...lab.steps.map((s,i)=>({label:`Step ${i+1}${s.adult?' — adult supervision required':''}`,text:s.text})),
      ...lab.tables.map(t=>({label:t.title??t.id,text:`Columns: ${t.columns.join(' | ')}\nRows: ${t.rows}${t.rowLabels?'\nRow labels: '+t.rowLabels.join(' | '):''}`})),
      ...lab.questions.map(q=>({label:q.kind,text:q.prompt})),...(lab.photos?[{label:'Photo prompt',text:lab.photos}]:[]),...(lab.minutes?[{label:'Suggested minutes',text:String(lab.minutes)}]:[]),...(lab.rubric?[{label:'Source rubric',text:lab.rubric},...rubricBlocks(lab.rubric)]:[]),
    ],{labs:[lab],...(lab.rubric?{rubrics:c.rubrics?.filter(r=>r.id===lab.rubric)}:{})});
  }
  const seen=new Map<string,number>(); for(const r of resources) {const k=`${sourceKey(r.source)}/${r.key}`;seen.set(k,(seen.get(k)||0)+1);}
  const unique=resources.filter(r=>seen.get(`${sourceKey(r.source)}/${r.key}`)===1);
  return {resources:unique,excluded:excluded+resources.length-unique.length};
}
export function studioChoices(kind:StudioKind,inventory:readonly StudioInventory[]):StudioResource[] {
  return studioResources(inventory).resources.filter(r=>allowed[kind].includes(r.kind));
}
export function studioProblems(input:unknown,inventory:readonly StudioInventory[]):string[] {
  const doc=parseStudioDocument(input), available=studioResources(inventory).resources;
  const problems:string[]=[];
  if(!doc.resources.length) problems.push('Select source material before review or delivery.');
  for(const resource of doc.resources) {
    const current=available.find(r=>r.key===resource.key&&sourceKey(r.source)===sourceKey(resource.source));
    if(!current || JSON.stringify(current)!==JSON.stringify(resource)) problems.push(`${resource.title}: the exact verified source is unavailable or changed.`);
  }
  return problems;
}
export async function studioDigest(input:unknown):Promise<string> {
  const bytes=new TextEncoder().encode(JSON.stringify(parseStudioDocument(input)));
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(b=>b.toString(16).padStart(2,'0')).join('');
}
/** Pure comparison, NOT an authorization decision. The server must also verify the current admin/session. */
export async function studioApprovalCurrent(doc:StudioDocument,approval:StudioApproval|null,inventory:readonly StudioInventory[]):Promise<boolean> {
  return !!approval && approval.revision===doc.revision && !studioProblems(doc,inventory).length && approval.digest===await studioDigest(doc);
}
/** Projection is constructed, never a clone with a few private fields deleted. No teacher answer reaches it. */
export function studioLearnerView(input:unknown) {
  const doc=parseStudioDocument(input);
  return {kind:doc.kind,title:doc.title,instructions:doc.instructions,resources:doc.resources.map(r=>({kind:r.kind,title:r.title,source:{...r.source},...(r.work?{work:structuredClone(r.work)}:{}),blocks:r.blocks.map(b=>({label:b.label,text:b.text,...(b.choices?{choices:[...b.choices]}:{})}))}))};
}
export function importStudioCopy(input:unknown,newId:string):StudioDocument {
  const doc=parseStudioDocument(input);
  return parseStudioDocument({...doc,id:newId,revision:0});
}

/** Build snapshots only by resolving exact current source identities, never by accepting client blocks. */
export function buildStudioDocument(kind:StudioKind,id:string,title:string,selection:readonly {source:StudioSource;key:string}[],inventory:readonly StudioInventory[]):StudioDocument {
  if(selection.length>STUDIO_LIMITS.resources) fail('Too many selected resources.');
  const choices=studioChoices(kind,inventory);
  const resources=selection.map(selected=>{
    const source=parseSource(selected.source);
    const found=choices.find(r=>r.key===selected.key&&sourceKey(r.source)===sourceKey(source));
    if(!found) fail('The selected source is unavailable or incompatible with this builder.');
    return structuredClone(found);
  });
  return parseStudioDocument({format:'erudior-studio-material',version:1,id,revision:0,kind,title,instructions:'',teacherNotes:'',resources});
}
