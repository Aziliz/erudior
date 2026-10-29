import { useEffect, useRef, useState } from 'react';
import { MAX_AUDIO_CLIP_BYTES, validateCourseAudioFields, validateEmbeddedAudio } from '../lib/courseAudio';

/** An explicit local upload; never fetches or plays a source. Pending reads cannot replace newer edits. */
export function EmbeddedAudioInput({label, value, onChange, onPendingChange}: {label:string;value?:string;onChange:(value:string|undefined)=>void;onPendingChange?:(pending:boolean)=>void}) {
  const [error,setError]=useState(''); const [busy,setBusy]=useState(false);
  const epoch=useRef(0); const live=useRef(true); const latest=useRef({value,onChange,onPendingChange}); latest.current={value,onChange,onPendingChange}; const pending=useRef(false);
  const setPending=(next:boolean)=>{if(pending.current!==next){pending.current=next;latest.current.onPendingChange?.(next);}setBusy(next);};
  useEffect(()=>{live.current=true; return ()=>{live.current=false;epoch.current++;if(pending.current){pending.current=false;latest.current.onPendingChange?.(false);}};},[]);
  const replace=(next:string|undefined)=>{epoch.current++;setPending(false);setError('');onChange(next);};
  async function upload(file:File) {
    const token=++epoch.current; const before=value; setError(''); setPending(false);
    if(file.size>MAX_AUDIO_CLIP_BYTES){setError(`Audio must be at most ${MAX_AUDIO_CLIP_BYTES} bytes.`);return;}
    if(!/^audio\/(mpeg|mp3|mp4|aac|x-m4a|ogg|opus|wav|x-wav|wave|webm|flac)$/.test(file.type)){setError('Choose a supported audio MIME type.');return;}
    setPending(true);
    try {
      const data=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onerror=()=>reject(new Error('Could not read audio file.'));reader.onload=()=>typeof reader.result==='string'?resolve(reader.result):reject(new Error('Invalid audio file.'));reader.readAsDataURL(file);});
      if(!live.current||epoch.current!==token||latest.current.value!==before)return;
      const errors=validateEmbeddedAudio(data,label); if(errors.length)throw new Error(errors.join('\n'));
      setPending(false);
      latest.current.onChange(data);
    }catch(e){if(live.current&&epoch.current===token)setError(e instanceof Error?e.message:'Could not read audio file.');}
    finally{if(live.current&&epoch.current===token)setPending(false);}
  }
  return <fieldset><legend>{label}</legend><p>{value ? value.startsWith('data:audio/')?'Embedded recording present.':'Source reference present; embed before publication.':'No recording; text-to-speech can be used where configured.'}</p><label>Upload {label}<input type="file" accept="audio/*" onChange={e=>{const file=e.target.files?.[0];e.target.value='';if(file)void upload(file);}}/></label><button type="button" disabled={!value&&!busy} onClick={()=>replace(undefined)}>Remove {label}</button>{busy&&<><p role="status">Reading audio…</p><button type="button" onClick={()=>{epoch.current++;setPending(false);setError('');}}>Cancel audio upload</button></>}{error&&<p role="alert">{error}</p>}</fieldset>;
}

export function AudioResourceEditor({audio,onChange,onPendingChange}:{audio?:Record<string,string>;onChange:(audio:Record<string,string>|undefined)=>void;onPendingChange?:(pending:boolean)=>void}) {
  const uploading=useRef(false);
  const [index,setIndex]=useState(0);const [newKey,setNewKey]=useState('');const [error,setError]=useState('');
  const keys=Object.keys(audio??{});const selected=Math.min(index,Math.max(0,keys.length-1));const key=keys[selected];const value=key===undefined?undefined:audio![key];
  const update=(next:Record<string,string>)=>{if(uploading.current){setError("Finish or cancel the audio upload first.");return;}const errors=validateCourseAudioFields({audio:next}, 'course', {mode:'source'});if(errors.length){setError(errors.join('\n'));return;}setError('');onChange(next);};
  return <section><h3>Recorded audio and pronunciation library</h3><p>Keys match spoken words or named sounds. Spoken replacements use device voices; recordings remain embedded. No audio plays automatically here.</p><label>New clip key<input value={newKey} onChange={e=>setNewKey(e.target.value)}/></label><button type="button" onClick={()=>{if(uploading.current){setError("Finish or cancel the audio upload first.");return;}if(!newKey.trim()){setError('Enter a clip key.');return;}if(Object.prototype.hasOwnProperty.call(audio??{},newKey)){setError('Clip key already exists.');return;}const next={...audio,[newKey]:`say:${newKey}`};if(validateCourseAudioFields({audio:next}, 'course', {mode:'source'}).length){setError('Clip key is invalid or collides with an existing normalized key.');return;}update(next);setIndex(keys.length);setNewKey('');}}>Add audio entry</button>{key!==undefined&&<div><p>Entry {selected+1} of {keys.length}: {key}</p><button type="button" disabled={!selected} onClick={()=>{if(uploading.current)setError("Finish or cancel the audio upload first.");else setIndex(selected-1);}}>Previous audio entry</button><button type="button" disabled={selected===keys.length-1} onClick={()=>{if(uploading.current)setError("Finish or cancel the audio upload first.");else setIndex(selected+1);}}>Next audio entry</button><label>Clip key<input value={key} onChange={e=>{if(e.target.value===key)return;const next={...audio};delete next[key];if(Object.prototype.hasOwnProperty.call(next,e.target.value)){setError('Clip key already exists.');return;}const entries=Object.entries(audio!).map(([k,v])=>[k===key?e.target.value:k,v]);update(Object.fromEntries(entries));}}/></label><label>Spoken replacement<textarea value={!!value && /^say:/i.test(value)?value.slice(4):''} onChange={e=>update({...audio,[key]:`say:${e.target.value}`})}/></label><EmbeddedAudioInput onPendingChange={v=>{uploading.current=v;onPendingChange?.(v);}} key={key} label="Library recording" value={!!value && /^say:/i.test(value)?undefined:value} onChange={v=>{if(v)update({...audio,[key]:v});else {const next={...audio};delete next[key];onChange(next);}}}/><button type="button" onClick={()=>{const next={...audio};delete next[key];onChange(next);}}>Remove audio entry</button></div>}{error&&<p role="alert">{error}</p>}</section>;
}
