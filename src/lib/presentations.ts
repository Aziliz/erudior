import type { Course } from './courseContentTypes';

/** Reusable teaching resources, not academic evidence or credentials. */
export interface PresentationSource {
  courseId: string;
  courseRevision: number | null;
  kind: 'lesson' | 'card' | 'glossary' | 'question';
  containerId: string;
  resourceId: string;
}
export type SourceRef = PresentationSource;
interface SlideBase { id: string; title: string; source: PresentationSource }
export interface ContentSlide extends SlideBase { kind: 'content'; text: string }
export interface QuestionSlide extends SlideBase { kind: 'question'; text: string; choices: string[]; answer: number[] }
export interface VideoSlide extends SlideBase { kind: 'video'; text: string; choices: string[]; answer: number[]; videoUrl: string; transcript: string; pauseAt: number }
export type PresentationSlide = ContentSlide | QuestionSlide | VideoSlide;
export interface PresentationDeck { format: 'erudior-presentation'; version: 1; id: string; title: string; revision: number; slides: PresentationSlide[] }
export interface PresentationLibrary { format: 'erudior-presentation-library'; version: 1; decks: PresentationDeck[] }
export const PRESENTATION_LIMITS = { decks: 100, slides: 100, text: 12000, transcript: 16000, bytes: 4_000_000 } as const;
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const str = (v: unknown, max: number) => typeof v === 'string' && !!v.trim() && v.length <= max && !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(v);
const id = (v: unknown) => str(v, 300);
const keys = (v: Record<string, unknown>, allowed: string[]) => Object.keys(v).every(k => allowed.includes(k));
function fail(message: string): never { throw Error(message); }
/** Remote media is never fetched by the server; playback still requires explicit consent. */
export function safePresentationVideoUrl(value: unknown): value is string {
  if (typeof value !== 'string' || value.length > 2000 || value !== value.trim()) return false;
  try {
    const u = new URL(value), h = u.hostname.toLowerCase();
    return u.protocol === 'https:' && !u.username && !u.password && (!u.port || u.port === '443') &&
      !u.hash && /^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])$/.test(h) && h.includes('.') &&
      !/^[0-9.]+$/.test(h) && !h.split('.').some(s => !s || s.startsWith('-') || s.endsWith('-')) &&
      !/(^|\.)(localhost|local|localdomain|internal|test|invalid|example|onion|home|lan)$/.test(h) && !h.endsWith('.localhost') && !h.endsWith('.home.arpa');
  } catch { return false; }
}
function parseSource(value: unknown): PresentationSource {
  if (!object(value) || !keys(value,['courseId','courseRevision','kind','containerId','resourceId']) || !id(value.courseId) ||
      !(value.courseRevision === null || Number.isSafeInteger(value.courseRevision) && Number(value.courseRevision) >= 1) ||
      !['lesson','card','glossary','question'].includes(String(value.kind)) || typeof value.containerId !== 'string' || value.containerId.length > 300 || !id(value.resourceId)) fail('Invalid presentation source.');
  return {courseId:value.courseId as string,courseRevision:value.courseRevision as number|null,kind:value.kind as PresentationSource['kind'],containerId:value.containerId as string,resourceId:value.resourceId as string};
}
export function parsePresentationSlide(value: unknown): PresentationSlide {
  if (!object(value) || !id(value.id) || !str(value.title,300) || !str(value.text,PRESENTATION_LIMITS.text)) fail('Invalid presentation slide.');
  const base = {id:value.id as string,title:value.title as string,source:parseSource(value.source),text:value.text as string};
  if (value.kind === 'content') {
    if (!keys(value,['id','title','source','text','kind']) || base.source.kind === 'question') fail('Invalid content slide.');
    return {...base,kind:'content'};
  }
  if (!['question','video'].includes(String(value.kind)) || base.source.kind !== 'question' || !Array.isArray(value.choices) || value.choices.length < 2 || value.choices.length > 8 ||
      !value.choices.every(c=>str(c,2000)) || !Array.isArray(value.answer) || !value.answer.length || new Set(value.answer).size !== value.answer.length ||
      !value.answer.every(a=>Number.isInteger(a) && a >= 0 && a < (value.choices as unknown[]).length)) fail('Invalid presentation question.');
  const question = {...base,choices:[...value.choices] as string[],answer:[...value.answer] as number[]};
  if (value.kind === 'question') {
    if (!keys(value,['id','title','source','text','kind','choices','answer'])) fail('Unknown question fields.');
    return {...question,kind:'question'};
  }
  if (!keys(value,['id','title','source','text','kind','choices','answer','videoUrl','transcript','pauseAt']) || !safePresentationVideoUrl(value.videoUrl) ||
      !str(value.transcript,PRESENTATION_LIMITS.transcript) || typeof value.pauseAt !== 'number' || !Number.isFinite(value.pauseAt) || value.pauseAt < 0 || value.pauseAt > 14400) fail('Invalid video question. Use a public HTTPS video, transcript and a pause from 0 to 14400 seconds.');
  return {...question,kind:'video',videoUrl:value.videoUrl,transcript:value.transcript as string,pauseAt:value.pauseAt};
}
function decoded(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  if (value.length > PRESENTATION_LIMITS.bytes) fail('Presentation file is too large.');
  try { return JSON.parse(value); } catch { return fail('Presentation file is not valid JSON.'); }
}
export function parsePresentation(input: unknown): PresentationDeck {
  const v = decoded(input);
  if (!object(v) || !keys(v,['format','version','id','title','revision','slides']) || v.format !== 'erudior-presentation' || v.version !== 1 || !id(v.id) || !str(v.title,300) ||
      !Number.isSafeInteger(v.revision) || Number(v.revision) < 0 || !Array.isArray(v.slides) || v.slides.length > PRESENTATION_LIMITS.slides) fail('Invalid presentation format or limits.');
  const slides = v.slides.map(parsePresentationSlide);
  if (new Set(slides.map(s=>s.id)).size !== slides.length) fail('Duplicate presentation slide IDs.');
  const deck:PresentationDeck = {format:'erudior-presentation',version:1,id:v.id as string,title:v.title as string,revision:v.revision as number,slides};
  if (JSON.stringify(deck).length > PRESENTATION_LIMITS.bytes) fail('Presentation is too large.');
  return deck;
}
export function parsePresentationLibrary(input: unknown): PresentationLibrary {
  if (input === null || input === undefined) return {format:'erudior-presentation-library',version:1,decks:[]};
  const v = decoded(input);
  if (!object(v) || !keys(v,['format','version','decks']) || v.format !== 'erudior-presentation-library' || v.version !== 1 || !Array.isArray(v.decks) || v.decks.length > PRESENTATION_LIMITS.decks) fail('Invalid presentation library.');
  const decks = v.decks.map(parsePresentation);
  if (new Set(decks.map(d=>d.id)).size !== decks.length) fail('Duplicate presentation IDs.');
  if (JSON.stringify(v).length > PRESENTATION_LIMITS.bytes) fail('Presentation library is too large.');
  return {format:'erudior-presentation-library',version:1,decks};
}
export const serializePresentation = (deck: PresentationDeck) => JSON.stringify(parsePresentation(deck),null,2);
const readable = (v: unknown, max:number=PRESENTATION_LIMITS.text): v is string => str(v,max) && !/```|!\[|<\/?[a-z]|\[\[|\]\(/i.test(v as string);
/** Only self-contained text is copied. Unsupported media/widgets are visibly excluded. */
export function presentationSources(courses: readonly Course[]): {slides: PresentationSlide[]; excluded: number} {
  const candidates: (PresentationSlide|null)[] = [];
  const sourceCounts=new Map<string,number>();
  const counts = new Map<string,number>();
  for(const c of courses) counts.set(c.id,(counts.get(c.id)||0)+1);
  for(const c of courses) {
    const source = (kind:PresentationSource['kind'],containerId:string,resourceId:string):PresentationSource => ({courseId:c.id,courseRevision:c.revision??null,kind,containerId,resourceId});
    const push = (ref:PresentationSource,title:string,text:string,question?:{choices:string[];answer:number[]},usable=true) => {
      const sourceId=JSON.stringify([ref.courseId,ref.kind,ref.containerId,ref.resourceId]);
      sourceCounts.set(sourceId,(sourceCounts.get(sourceId)||0)+1);
      if(counts.get(c.id)! > 1 || !usable || !readable(text) || !str(title,300)) {candidates.push(null);return;}
      const base={id:JSON.stringify([ref.courseId,ref.kind,ref.containerId,ref.resourceId]),title,source:ref,text};
      candidates.push(question?{...base,kind:'question',choices:[...question.choices],answer:[...question.answer]}:{...base,kind:'content'});
    };
    for(const l of c.lessons) push(source('lesson','',l.id),l.title,l.body);
    for(const d of c.decks) for(const card of d.cards) push(source('card',d.id,card.id),d.title,`${card.front}\n\n${card.back}`);
    for(const g of c.glossary) push(source('glossary','',g.term),g.term,g.definition);
    for(const b of c.banks) for(const q of b.questions) {
      const usable=(!q.type||q.type==='choice') && !q.image && !q.audio && !q.listen && !q.blend && q.choices.length>=2 && q.choices.length<=8 && q.choices.every(x=>readable(x,2000)) && q.answer.length>0 && new Set(q.answer).size===q.answer.length && q.answer.every(a=>Number.isInteger(a)&&a>=0&&a<q.choices.length);
      push(source('question',b.id,q.id),`${b.title} · ${q.id}`,q.stem,{choices:q.choices,answer:q.answer},usable);
    }
  }
  const ids=new Map<string,number>();for(const s of candidates) if(s) ids.set(s.id,(ids.get(s.id)||0)+1);
  const slides=candidates.filter((s):s is PresentationSlide=>!!s&&ids.get(s.id)===1&&sourceCounts.get(s.id)===1);
  return {slides,excluded:candidates.length-slides.length};
}
/** Exact source snapshots reject revision changes, altered answers and ambiguous IDs. */
export function presentationProblems(deck: PresentationDeck,courses: readonly Course[]): string[] {
  const parsed=parsePresentation(deck), current=presentationSources(courses).slides;
  const problems:string[]=[];
  if(!parsed.slides.length) problems.push('Add at least one slide before presenting.');
  for(const s of parsed.slides) {
    const original=current.find(x=>JSON.stringify(x.source)===JSON.stringify(s.source));
    if(!original) {problems.push(`${s.title}: the exact installed source is missing, changed or unsupported.`);continue;}
    if(original.title!==s.title || original.text!==s.text || (s.kind!=='content' && (original.kind==='content' || JSON.stringify(original.choices)!==JSON.stringify(s.choices) || JSON.stringify(original.answer)!==JSON.stringify(s.answer)))) problems.push(`${s.title}: source content changed. Replace this slide from the installed course.`);
  }
  return problems;
}
export function makeVideoSlide(question: QuestionSlide,videoUrl:string,transcript:string,pauseAt:number): VideoSlide {
  return parsePresentationSlide({...question,kind:'video',videoUrl,transcript,pauseAt}) as VideoSlide;
}
