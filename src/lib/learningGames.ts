import type { Course } from "./types";

/** Games are ephemeral review activities, never assessment or credential evidence. */
export interface GamePair { id: string; prompt: string; answer: string; topic: string; source: string; explanation?: string }
export type GameSource = "questions" | "cards" | "glossary";
const textOnly = (s: string) => !!s.trim() && s.length <= 4000 && !/```|!\[|<\/?[a-z]|\[\[|\]\(/i.test(s);
export function gamePairs(course: Course, source: GameSource): { pairs: GamePair[]; excluded: number } {
  const candidates: (GamePair | null)[] = [];
  if (source === "questions") for (const b of course.banks) for (const q of b.questions) {
    const valid = (!q.type || q.type === "choice") && !q.image && !q.audio && !q.listen && !q.blend && q.answer.length === 1 && Number.isInteger(q.answer[0]) && q.answer[0] >= 0 && q.answer[0] < q.choices.length;
    candidates.push(valid ? { id: JSON.stringify([course.id, "question", b.id, q.id]), prompt: q.stem, answer: q.choices[q.answer[0]], topic: q.topic || "Review", source: `${course.title} · ${b.title} · ${q.id}`, explanation: q.explanation } : null);
  }
  if (source === "cards") for (const d of course.decks) for (const c of d.cards) candidates.push({ id: JSON.stringify([course.id,"card",d.id,c.id]), prompt: c.front, answer: c.back, topic: c.topic || d.title, source: `${course.title} · ${d.title} · ${c.id}` });
  if (source === "glossary") for (const g of course.glossary) candidates.push({ id: JSON.stringify([course.id,"term",g.term]), prompt: g.definition, answer: g.term, topic: g.topic || "Glossary", source: `${course.title} · glossary · ${g.term}` });
  const ids = new Map<string,number>(); for (const p of candidates) if(p) ids.set(p.id,(ids.get(p.id)||0)+1);
  const prompts = new Map<string,number>(), answers = new Map<string,number>();
  for(const p of candidates) if(p){const q=p.prompt.trim().toLocaleLowerCase(),a=p.answer.trim().toLocaleLowerCase();prompts.set(q,(prompts.get(q)||0)+1);answers.set(a,(answers.get(a)||0)+1);}
  const pairs: GamePair[] = [];
  for (const p of candidates) {
    if (!p || ids.get(p.id)! > 1 || !textOnly(p.prompt) || !textOnly(p.answer)) continue;
    const a=p.answer.trim().toLocaleLowerCase(), q=p.prompt.trim().toLocaleLowerCase();
    // A board must have one unambiguous answer for each prompt.
    if (prompts.get(q)! > 1 || answers.get(a)! > 1 || q===a) continue;
    pairs.push(p);
  }
  return {pairs,excluded:candidates.length-pairs.length};
}
export function shuffled<T>(items: readonly T[], random = Math.random): T[] {
  const out=[...items]; for(let i=out.length-1;i>0;i--){const j=Math.min(i,Math.max(0,Math.floor(random()*(i+1)))); [out[i],out[j]]=[out[j],out[i]];}return out;
}
export function bingoLines(marked: readonly number[], size=3): number {
  const m=new Set(marked); let lines=0;
  for(let i=0;i<size;i++){if(Array.from({length:size},(_,j)=>i*size+j).every(x=>m.has(x)))lines++;if(Array.from({length:size},(_,j)=>j*size+i).every(x=>m.has(x)))lines++;}
  if(Array.from({length:size},(_,i)=>i*size+i).every(x=>m.has(x)))lines++;
  if(Array.from({length:size},(_,i)=>i*size+size-1-i).every(x=>m.has(x)))lines++;
  return lines;
}
export interface ReviewScore { resolved: Record<string, boolean>; points: number }
export function resolveReview(s: ReviewScore,id: string, correct: boolean): ReviewScore {
  if(Object.prototype.hasOwnProperty.call(s.resolved,id))return s;
  return {resolved:{...s.resolved,[id]:correct},points:s.points+(correct?100:0)};
}
export function makeTeams(names: string[], count: number, random=Math.random): string[][] {
  const clean=[...new Set(names.map(n=>n.trim().slice(0,40)).filter(Boolean))].slice(0,200);
  const teams=Array.from({length:Math.max(1,Math.min(clean.length||1,Math.floor(count)||1))},()=>[] as string[]);
  shuffled(clean,random).forEach((n,i)=>teams[i%teams.length].push(n));return teams;
}
