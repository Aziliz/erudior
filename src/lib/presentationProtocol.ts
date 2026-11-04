import type { PresentationDeck, PresentationSlide } from './presentations';
export type PresentationPacing='teacher'|'student';
export type PublicPresentationSlide = {id:string;kind:'content';title:string;text:string} | {id:string;kind:'question';title:string;text:string;choices:string[];multi:boolean} | {id:string;kind:'video';title:string;text:string;choices:string[];multi:boolean;videoUrl:string;transcript:string;pauseAt:number};
export interface PresentationHostState {
  t:'presentation-host';phase:'lobby'|'active'|'ended';deck:PresentationDeck|null;pacing:PresentationPacing;index:number;revealed:boolean;
  players:{id:string;name:string;connected:boolean;index:number;answered:boolean;correct:number}[];answered:number;
}
export interface PresentationPlayState {
  t:'presentation-play';player:string;name:string;title:string;pacing:PresentationPacing;phase:'lobby'|'active'|'ended';index:number;total:number;
  slide:PublicPresentationSlide|null;answered:number[]|null;revealed:boolean;answer?:number[];right?:boolean;correct:number;
}
export type PresentationMessage=PresentationHostState|PresentationPlayState|{t:'hello';title:string}|{t:'error';message:string}|{t:'closed';message:string};
/** Explicit allowlist prevents source metadata, future fields or answer keys leaking. */
export function publicPresentationSlide(slide:PresentationSlide):PublicPresentationSlide {
  const base={id:slide.id,title:slide.title,text:slide.text};
  if(slide.kind==='content')return {...base,kind:'content'};
  const question={...base,choices:[...slide.choices],multi:slide.answer.length>1};
  return slide.kind==='question'?{...question,kind:'question'}:{...question,kind:'video',videoUrl:slide.videoUrl,transcript:slide.transcript,pauseAt:slide.pauseAt};
}
