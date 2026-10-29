import { useEffect, useRef, useState } from 'react';
import type { AppApi } from '../App';
import PresentationSlide from '../components/PresentationSlide';
import { codeOk, normCode } from '../lib/live';
import { presentationPlayerUrl, presentationSocket } from '../lib/presentationLive';
import type { PresentationPlayState } from '../lib/presentationProtocol';

export default function PresentationPlay({api,initialCode}:{api:AppApi;initialCode?:string}) {
  const [code,setCode]=useState(normCode(initialCode??'')),[name,setName]=useState(''),[joining,setJoining]=useState(false),[error,setError]=useState('');
  const [state,setState]=useState<PresentationPlayState|null>(null),[status,setStatus]=useState<'connecting'|'open'|'lost'>('connecting'),[ended,setEnded]=useState(''),[pending,setPending]=useState(false);
  const socket=useRef<ReturnType<typeof presentationSocket>|null>(null),joiningRef=useRef(false),active=useRef(0),pendingRef=useRef(false);
  useEffect(()=>()=>{active.current++;socket.current?.stop();},[]);
  function join(event:React.FormEvent){
    event.preventDefault();if(joiningRef.current)return;
    const room=normCode(code);if(!codeOk(room)){setError('Room codes are six letters and numbers.');return;}if(!name.trim()){setError('Enter a nickname.');return;}
    socket.current?.stop();const sequence=++active.current;joiningRef.current=true;setJoining(true);setError('');setEnded('');
    let player='';try{player=sessionStorage.getItem(`erudior.presentation.${room}`)??'';}catch{/* Reconnect within this screen remains available. */}
    const s=presentationSocket(presentationPlayerUrl(room,player||undefined),{
      onMessage:m=>{if(sequence!==active.current)return;if(m.t==='hello'&&player){player='';socket.current?.send({t:'join',name:name.trim()});}else if(m.t==='presentation-play'){
        setState(m);setJoining(false);joiningRef.current=false;pendingRef.current=false;setPending(false);setError('');
        if(player!==m.player){player=m.player;try{sessionStorage.setItem(`erudior.presentation.${room}`,player);}catch{/* Private state still exists on the server until expiry. */}}
      }else if(m.t==='error'){setError(m.message);setJoining(false);joiningRef.current=false;pendingRef.current=false;setPending(false);}else if(m.t==='closed'){setEnded(m.message||'The room closed.');setJoining(false);joiningRef.current=false;s.stop();}},
      onStatus:v=>{if(sequence===active.current){setStatus(v);if(v!=='open'){pendingRef.current=false;setPending(false);}}},
      onEnd:(_code,reason)=>{if(sequence===active.current){setEnded(reason||'The room closed.');setJoining(false);joiningRef.current=false;setStatus('lost');}},
    },()=>player?null:{t:'join',name:name.trim()});s.setUrl(()=>presentationPlayerUrl(room,player||undefined));socket.current=s;
  }
  function leave(){active.current++;socket.current?.stop();setState(null);setEnded('');setJoining(false);joiningRef.current=false;setPending(false);pendingRef.current=false;}
  function answer(choices:number[]){if(!state||pendingRef.current||status!=='open'||state.answered!==null||state.revealed)return;pendingRef.current=true;setPending(true);if(!socket.current?.send({t:'answer',index:state.index,choices})){pendingRef.current=false;setPending(false);setError('Response was not sent. Wait for reconnect and retry.');}}
  function next(){if(!state||pendingRef.current||status!=='open')return;pendingRef.current=true;setPending(true);if(!socket.current?.send({t:'next',index:state.index})){pendingRef.current=false;setPending(false);}}
  return <div className="page presentation-play"><h1>Interactive presentation</h1>{error&&<p role="alert">{error}</p>}
    {ended?<section className="panel"><h2>Session ended</h2><p role="status">{ended}</p><p>Your responses do not change grades, mastery or certificates.</p><button className="btn" onClick={leave}>Join another presentation</button><button className="btn" onClick={()=>api.go({name:'library'})}>Back to library</button></section>:!state?<form className="panel" onSubmit={join}><p>Join with the teacher's code. Use a nickname: only the teacher sees participant names. Your classmates do not see your responses.</p><label className="field">Presentation code<input className="input" autoComplete="off" value={code} maxLength={6} disabled={joining} onChange={e=>setCode(normCode(e.target.value))}/></label><label className="field">Nickname<input className="input" autoComplete="off" value={name} maxLength={40} disabled={joining} onChange={e=>setName(e.target.value)}/></label><button className="btn primary" disabled={joining} type="submit">{joining?'Joining…':'Join presentation'}</button>{joining&&<button className="btn" type="button" onClick={leave}>Cancel joining</button>}</form>:<section className="panel"><h2>{state.title}</h2><p>Connection: {status} · {state.pacing==='teacher'?'Teacher-paced':'Student-paced'} · Your nickname: {state.name}</p>{status!=='open'&&<p role="status">Reconnecting. Controls are paused; a response is only saved after the server acknowledges it.</p>}
      {state.phase==='lobby'?<p role="status">Waiting for the teacher to start.</p>:state.phase==='ended'?<><p role="status">Presentation complete. You answered {state.correct} questions correctly.</p><p>Practice feedback only; no academic credit.</p></>:state.slide&&<><p role="status">Slide {state.index+1} of {state.total}</p><PresentationSlide key={`${state.index}:${state.slide.id}`} slide={state.slide} disabled={status!=='open'||pending} submitted={state.answered} revealedAnswer={state.revealed?state.answer:undefined} onAnswer={answer}/>{state.revealed&&state.right!==undefined&&<p role="status">{state.right?'Your response is correct.':'Review the correct choices above.'}</p>}{state.pacing==='student'?<button className="btn primary" disabled={status!=='open'||pending||(state.slide.kind!=='content'&&!state.revealed)} onClick={next}>Next slide</button>:<p>The teacher controls the next slide.</p>}</>}
      <button className="btn" onClick={leave}>Leave presentation</button>
    </section>}
  </div>;
}
