import { useEffect, useRef, useState } from 'react';
import PresentationSlide from '../components/PresentationSlide';
import { registerNavigationGuard } from '../lib/navigationGuard';
import type { PresentationDeck } from '../lib/presentations';
import { openPresentationRoom, presentationHostUrl, presentationSocket } from '../lib/presentationLive';
import type { PresentationHostState } from '../lib/presentationProtocol';

type Room={code:string;token:string;joinUrl:string;deck:PresentationDeck;pacing:'teacher'|'student';mustClose?:boolean};
let hosting:Room|null=null;
export default function PresentationHost({deck,onExit,validate}:{deck:PresentationDeck;onExit:()=>void;validate?:(target:PresentationDeck)=>string[]|Promise<string[]>}) {
  const [room,setRoom]=useState<Room|null>(hosting),[pacing,setPacing]=useState<'teacher'|'student'>('teacher'),[state,setState]=useState<PresentationHostState|null>(null);
  const [status,setStatus]=useState<'connecting'|'open'|'lost'>('connecting'),[error,setError]=useState(''),[busy,setBusy]=useState(false),[closing,setClosing]=useState(!!hosting?.mustClose),[ended,setEnded]=useState(false),[generation,setGeneration]=useState(0),[starting,setStarting]=useState(false);
  const validateRef=useRef(validate);validateRef.current=validate;
  const sourceProblems=async(target:PresentationDeck)=>{try{return await validateRef.current?.(target)??[];}catch{return ['Presentation sources could not be verified.'];}};
  const socket=useRef<ReturnType<typeof presentationSocket>|null>(null),mounted=useRef(true),closingRef=useRef(!!hosting?.mustClose),opening=useRef(false),startingRef=useRef(false),hostState=useRef<PresentationHostState|null>(null);
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;};},[]);
  useEffect(()=>registerNavigationGuard(()=>{if((room&&!ended)||busy){setError('Close the presentation room before leaving. If disconnected, use the explicit unconfirmed closure recovery.');return false;}return true;}),[room,ended,busy]);
  useEffect(()=>{if((!room&&!busy)||ended)return;const warn=(event:BeforeUnloadEvent)=>{event.preventDefault();event.returnValue='';};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[room,ended,busy]);
  useEffect(()=>{
    if(!room)return;
    let active=true,setupSent=false,checkingSetup=false,connectionEpoch=0;
    const s=presentationSocket(presentationHostUrl(room.code,room.token),{
      onMessage:async m=>{
        if(!active)return;
        if(m.t==='presentation-host'){
          hostState.current=m;setState(m);
          if(m.phase==='lobby'&&!m.deck&&!closingRef.current&&!setupSent&&!checkingSetup){
            checkingSetup=true;const epoch=connectionEpoch;const problems=await sourceProblems(room.deck);
            if(!active||epoch!==connectionEpoch)return;checkingSetup=false;
            if(closingRef.current||hostState.current?.phase!=='lobby'||hostState.current.deck)return;
            if(problems.length){setError(problems.join(' '));room.mustClose=true;closingRef.current=true;setClosing(true);s.send({t:'close'});}
            else setupSent=s.send({t:'setup',deck:room.deck,pacing:room.pacing});
          }
        }else if(m.t==='error')setError(m.message);
        else if(m.t==='closed'){hosting=null;closingRef.current=false;setClosing(false);setEnded(true);s.stop();}
      },
      onStatus:v=>{if(active){setStatus(v);if(v==='connecting'){connectionEpoch++;setupSent=false;checkingSetup=false;}if(v==='open'&&closingRef.current)s.send({t:'close'});}},
      onEnd:(code,reason)=>{if(!active)return;setStatus('lost');if(code===4001){hosting=null;setEnded(true);setClosing(false);closingRef.current=false;}else setError(reason||'Connection ended. Room closure is not confirmed.');},
    });socket.current=s;
    return()=>{active=false;connectionEpoch++;s.stop();socket.current=null;};
  },[room,generation]);
  useEffect(()=>{if(!closing)return;const timer=setTimeout(()=>setError('Closure is unconfirmed. Retry closing or reconnect before leaving.'),5000);return()=>clearTimeout(timer);},[closing,generation]);
  async function open(){
    if(opening.current)return;opening.current=true;setBusy(true);setError('');
    try{
      const snapshot=structuredClone(deck),chosenPacing=pacing;
      const problems=await sourceProblems(snapshot);if(!mounted.current)return;if(problems.length){setError(problems.join(' '));return;}
      const result=await openPresentationRoom();
      const r:Room={...result,deck:snapshot,pacing:chosenPacing};hosting=r;
      const changed=await sourceProblems(snapshot);
      if(changed.length||!mounted.current){r.mustClose=true;closingRef.current=true;if(mounted.current){setClosing(true);setError(changed.join(' '));}}
      if(mounted.current)setRoom(r);
      else {
        // A parent teardown while the request was in flight must not publish the deck.
        // Retain the credential unless the cleanup is acknowledged, so a later visit can retry.
        const cleanup=presentationSocket(presentationHostUrl(r.code,r.token),{
          onMessage:m=>{if(m.t==='closed'){if(hosting===r)hosting=null;cleanup.stop();}},
          onStatus:v=>{if(v==='open')cleanup.send({t:'close'});},
          onEnd:code=>{if(code===4001&&hosting===r)hosting=null;},
        });
      }
    }catch(e){if(mounted.current)setError((e as Error).message);}
    finally{opening.current=false;if(mounted.current)setBusy(false);}
  }
  function close(){if(room)room.mustClose=true;closingRef.current=true;setClosing(true);setError('');if(!socket.current?.send({t:'close'}))setError('Closure is unconfirmed while disconnected. Reconnect to retry, or explicitly leave it to expire.');}
  async function send(t:string){
    const current=hostState.current,transport=socket.current;if(!current||status!=='open'||closingRef.current)return;
    if(t==='start'){
      if(startingRef.current)return;startingRef.current=true;setStarting(true);
      try{if(!current.deck)return;const problems=await sourceProblems(current.deck);if(!mounted.current||socket.current!==transport||closingRef.current||hostState.current?.phase!=='lobby')return;if(problems.length){setError(problems.join(' '));return;}transport?.send({t,index:current.index});}
      finally{startingRef.current=false;if(mounted.current)setStarting(false);}return;
    }
    transport?.send({t,index:current.index});
  }
  if(ended)return <section className="panel"><h2>Presentation room closed</h2><p role="status">The server confirmed the room ended. Room responses are not academic records.</p><button className="btn" onClick={onExit}>Back to presentations</button></section>;
  if(!room)return <section className="panel"><h2>Share {deck.title}</h2><p>Anonymous classroom session, up to four hours. Learners see only their own responses. The teacher can see participant nicknames. Closing deletes room state.</p><label className="field">Pacing<select className="input" value={pacing} disabled={busy} onChange={e=>setPacing(e.target.value as typeof pacing)}><option value="teacher">Teacher-paced</option><option value="student">Student-paced</option></select></label>{error&&<p role="alert">{error}</p>}<button className="btn primary" disabled={busy||!deck.slides.length} onClick={open}>{busy?'Opening room…':'Open presentation room'}</button><button className="btn" disabled={busy} onClick={onExit}>Cancel</button></section>;
  const slide=state?.deck?.slides[state.index];
  return <section className="panel presentation-host"><h2>{room.deck.title}</h2><p>Room code: <strong>{room.code}</strong> · {room.pacing==='teacher'?'Teacher-paced':'Student-paced'} · Connection: {status}</p>{room.joinUrl&&<p><a href={room.joinUrl} target="_blank" rel="noreferrer">Learner join link</a></p>}{error&&<p role="alert">{error}</p>}{closing&&<p role="status">Waiting for server confirmation of closure. Do not assume the room has closed.</p>}
    {(status!=='open'||closing&&!!error)&&<button className="btn" onClick={()=>setGeneration(x=>x+1)}>Reconnect to room</button>}
    {!closing&&state?.phase==='lobby'&&<button className="btn primary" disabled={status!=='open'||!state.deck||starting} onClick={()=>send('start')}>Start presentation</button>}
    {!closing&&state?.phase==='active'&&<><p role="status">{state.pacing==='teacher'?`Slide ${state.index+1} of ${state.deck?.slides.length??0}`:'Learners progress independently'}</p>{state.pacing==='teacher'&&slide&&<><PresentationSlide key={slide.id} slide={slide} multiple={slide.kind!=='content'&&slide.answer.length>1} disabled revealedAnswer={state.revealed&&slide.kind!=='content'?slide.answer:undefined}/><div className="row">{slide.kind!=='content'&&!state.revealed&&<button className="btn" disabled={status!=='open'} onClick={()=>send('reveal')}>Reveal answer to learners</button>}<button className="btn" disabled={status!=='open'||(slide.kind!=='content'&&!state.revealed)} onClick={()=>send('next')}>Next slide</button></div></>}<button className="btn" disabled={status!=='open'} onClick={()=>send('end')}>End presentation</button></>}
    {state?.phase==='ended'&&<p role="status">Presentation ended. Close the room to remove responses.</p>}
    <h3>Participants</h3><p>Nicknames are visible here only. Do not enter sensitive student details.</p><ul>{state?.players.map(p=><li key={p.id}>{p.name} · {p.connected?'connected':'disconnected'} · slide {Math.max(0,p.index+1)} · {p.correct} correct{p.answered?' · responded':''}</li>)}</ul>
    <div className="row"><button className="btn" disabled={closing&&status==='open'&&!error} onClick={close}>Close room</button><span className="small">Close the room before leaving this screen.</span></div>{closing&&(status!=='open'||!!error)&&<details><summary>Cannot reconnect?</summary><p>Forgetting this room does not close it. It expires after the host has been absent for ten minutes, or after four hours total.</p><button className="btn" onClick={()=>{socket.current?.stop();hosting=null;onExit();}}>Forget local room and leave unconfirmed</button></details>}
  </section>;
}

export function LocalPresentationPlayer({deck,onExit,mode='student'}:{deck:PresentationDeck;onExit:()=>void;mode?:'teacher'|'student'}) {
  const [index,setIndex]=useState(0),[answers,setAnswers]=useState<Record<number,number[]>>({}),[reveals,setReveals]=useState<Record<number,boolean>>({});
  const slide=deck.slides[index],submitted=answers[index]??null,revealed=!!reveals[index];
  if(!slide)return <section className="panel"><h2>Presentation complete</h2><p>Local practice only. No grades or learner records were changed.</p><button className="btn" onClick={()=>{setIndex(0);setAnswers({});setReveals({});}}>Restart presentation</button><button className="btn" onClick={onExit}>Back to presentations</button></section>;
  return <section className="panel"><h2>{deck.title}</h2><p role="status">Slide {index+1} of {deck.slides.length} · {mode==='teacher'?'Teacher preview':'Self-paced local practice'}</p><PresentationSlide key={`${index}:${slide.id}`} slide={slide} multiple={slide.kind!=='content'&&slide.answer.length>1} submitted={submitted} revealedAnswer={revealed&&slide.kind!=='content'?slide.answer:undefined} onAnswer={choices=>{setAnswers(a=>a[index]?a:{...a,[index]:choices});if(mode==='student')setReveals(r=>({...r,[index]:true}));}}/>{mode==='teacher'&&slide.kind!=='content'&&!revealed&&<button className="btn" onClick={()=>setReveals(r=>({...r,[index]:true}))}>Reveal answer</button>}<div className="row"><button className="btn" disabled={index===0} onClick={()=>setIndex(i=>i-1)}>Previous slide</button><button className="btn primary" disabled={mode==='student'&&slide.kind!=='content'&&!revealed} onClick={()=>setIndex(i=>i+1)}>Next slide</button><button className="btn" onClick={onExit}>Exit local presentation</button></div></section>;
}
