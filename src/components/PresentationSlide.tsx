import { useEffect, useId, useRef, useState } from 'react';
import MathText from './MathText';
import { safePresentationVideoUrl } from '../lib/presentations';

/** Public slide data intentionally has no answer field. */
export type PresentationDisplaySlide = { id:string; title:string; kind:'content'; text:string } | {
  id:string; title:string; kind:'question'|'video'; text:string; choices:string[];
  videoUrl?:string; transcript?:string; pauseAt?:number; multi?:boolean;
};
export default function PresentationSlide({slide,disabled=false,submitted=null,revealedAnswer,onAnswer,multiple}:{
  slide:PresentationDisplaySlide; disabled?:boolean; submitted?:number[]|null;
  revealedAnswer?:number[]; multiple?:boolean; onAnswer?:(choices:number[])=>void;
}) {
  const [picked,setPicked]=useState<number[]>([]),[loadVideo,setLoadVideo]=useState(false),[ready,setReady]=useState(false),[mediaError,setMediaError]=useState('');
  const video=useRef<HTMLVideoElement>(null), title=useRef<HTMLHeadingElement>(null),group=useId();
  useEffect(()=>{setPicked([]);setLoadVideo(false);setReady(false);setMediaError('');title.current?.focus();},[slide.id]);
  useEffect(()=>()=>{video.current?.pause();},[slide.id]);
  const question=slide.kind!=='content';
  const revealed=revealedAnswer!==undefined;
  const multi=question&&(multiple??slide.multi??false);
  const locked=disabled||submitted!==null||revealed;
  const choices=submitted??picked;
  return <section className="presentation-slide" aria-labelledby={`${group}-title`}>
    <h3 ref={title} id={`${group}-title`} tabIndex={-1}>{slide.title}</h3>
    {slide.kind==='video'&&<div className="presentation-video">
      <p>Video question at {slide.pauseAt??0} seconds. You can use the transcript instead of loading the external video.</p>
      <details open><summary>Video transcript</summary><p style={{whiteSpace:'pre-wrap'}}>{slide.transcript}</p></details>
      {!loadVideo?<><p className="small">Loading sends a request to the video provider. No video loads until you choose it.</p><button className="btn" disabled={!safePresentationVideoUrl(slide.videoUrl)} onClick={()=>setLoadVideo(true)}>Load external video</button></>:<video ref={video} controls preload="metadata" playsInline crossOrigin="anonymous" src={safePresentationVideoUrl(slide.videoUrl)?slide.videoUrl:undefined} aria-label="Presentation video" onError={()=>setMediaError('The video could not be played. Use the transcript to continue.')} onTimeUpdate={()=>{if(video.current&&!ready&&video.current.currentTime>=(slide.pauseAt??0)){video.current.pause();setReady(true);}}} onEnded={()=>setReady(true)}/>}
      {mediaError&&<p role="status">{mediaError}</p>}
      {!ready&&<button className="btn" onClick={()=>{video.current?.pause();setReady(true);}}>Use transcript and answer question</button>}
      {ready&&<p role="status">Question ready. Video paused for your response.</p>}
    </div>}
    {(slide.kind!=='video'||ready||submitted!==null||revealed)&&<>
      <MathText as="div" className="presentation-text" text={slide.text}/>
      {question&&<fieldset disabled={locked} className="presentation-choices"><legend>{multi?'Select all correct choices':'Select one correct choice'}</legend>{slide.choices.map((choice,i)=><label className="presentation-choice" key={i}><input type={multi?"checkbox":"radio"} name={group} checked={choices.includes(i)} onChange={()=>setPicked(p=>!multi?[i]:p.includes(i)?p.filter(x=>x!==i):[...p,i].sort((a,b)=>a-b))}/><MathText text={choice}/></label>)}</fieldset>}
      {question&&onAnswer&&!revealed&&<button className="btn primary" disabled={locked||!picked.length} onClick={()=>onAnswer([...picked])}>{submitted!==null?'Response submitted':'Submit response'}</button>}
      {question&&submitted!==null&&!revealed&&<p role="status">Response saved. Waiting for reveal.</p>}
      {question&&revealed&&<div className="notice" role="status"><b>Correct choices:</b><ul>{revealedAnswer.map(i=><li key={i}><MathText text={slide.choices[i]??''}/></li>)}</ul></div>}
    </>}
  </section>;
}
