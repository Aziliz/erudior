import { useEffect, useRef, useState } from 'react';
import { MAX_AUDIO_CLIP_BYTES, validateCourseAudioFields, validateEmbeddedAudio } from '../lib/courseAudio';

/** Only validated embedded bytes are ever offered to the local audio player. */
export function playableEmbeddedAudio(value?: string): string | undefined {
  return value?.startsWith('data:audio/') && !validateEmbeddedAudio(value).length ? value : undefined;
}

/** Explicit local upload and audition. Pending reads cannot replace newer edits. */
export function EmbeddedAudioInput({ label, value, sourceVersion, onChange, onPendingChange }: { label: string; value?: string; sourceVersion?: string; onChange: (value: string | undefined) => void; onPendingChange?: (pending: boolean) => void }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<string>();
  const [removal, setRemoval] = useState<{ value: string }>();
  const epoch = useRef(0), live = useRef(true), pending = useRef(false);
  const latest = useRef({ value, sourceVersion, onChange, onPendingChange }); latest.current = { value, sourceVersion, onChange, onPendingChange };
  const setPending = (next: boolean) => { if (pending.current !== next) { pending.current = next; latest.current.onPendingChange?.(next); } setBusy(next); };
  const cancel = () => { epoch.current++; setPending(false); setError(''); };
  useEffect(() => { live.current = true; return () => { live.current = false; epoch.current++; if (pending.current) { pending.current = false; latest.current.onPendingChange?.(false); } }; }, []);
  useEffect(() => { epoch.current++; setPending(false); setPreview(undefined); }, [value, sourceVersion]);
  async function upload(file: File) {
    const token = ++epoch.current, before = value, beforeVersion = sourceVersion;
    setError(''); setRemoval(undefined); setPreview(undefined); setPending(false);
    if (file.size > MAX_AUDIO_CLIP_BYTES) { setError(`Audio must be at most ${MAX_AUDIO_CLIP_BYTES} bytes.`); return; }
    if (!/^audio\/(mpeg|mp3|mp4|aac|x-m4a|ogg|opus|wav|x-wav|wave|webm|flac)$/.test(file.type)) { setError('Choose a supported audio MIME type.'); return; }
    setPending(true);
    try {
      const data = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onerror = () => reject(new Error('Could not read audio file.')); reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Invalid audio file.')); reader.readAsDataURL(file); });
      if (!live.current || epoch.current !== token || latest.current.value !== before || latest.current.sourceVersion !== beforeVersion) return;
      const errors = validateEmbeddedAudio(data, label); if (errors.length) throw new Error(errors.join('\n'));
      setPending(false); latest.current.onChange(data);
    } catch (e) { if (live.current && epoch.current === token) setError(e instanceof Error ? e.message : 'Could not read audio file.'); }
    finally { if (live.current && epoch.current === token) setPending(false); }
  }
  const playable = playableEmbeddedAudio(value);
  return <fieldset className="stack"><legend>{label}</legend>
    <p>{value ? playable ? 'Embedded recording present.' : 'Source reference present; embed valid audio before publication.' : 'No recording; text-to-speech can be used where configured.'}</p>
    <label className="field">Upload {label}<input className="input" type="file" accept="audio/*" onChange={e => { const file = e.target.files?.[0]; e.target.value = ''; if (file) void upload(file); }} /></label>
    <p className="small">Local audio only, up to {MAX_AUDIO_CLIP_BYTES.toLocaleString()} bytes. Preview never starts automatically; the browser may not support every accepted audio codec.</p>
    {playable && <><button className="btn" type="button" disabled={busy} onClick={() => { setPreview(playable); setError(''); }}>Preview {label}</button>
      {preview === playable && <div className="stack"><audio aria-label={`${label} preview`} controls preload="none" src={playable} onError={() => setError('This browser could not decode the recording. Try another supported audio format.')} style={{ maxWidth: '100%' }} /><button className="btn" type="button" onClick={() => setPreview(undefined)}>Close {label} preview</button></div>}</>}
    <button className="btn" type="button" disabled={!value && !busy} onClick={() => { cancel(); setPreview(undefined); if (value) setRemoval({ value }); }}>Remove {label}</button>
    {removal && <div role="alert"><p>Remove this recording from the draft? Existing published versions are unchanged.</p><button className="btn" type="button" onClick={() => {
      cancel(); setRemoval(undefined);
      if (latest.current.value !== removal.value) { setError('The recording changed. Review it before removing.'); return; }
      latest.current.onChange(undefined);
    }}>Confirm removal of {label}</button><button className="btn" type="button" onClick={() => setRemoval(undefined)}>Keep {label}</button></div>}
    {busy && <><p role="status">Reading audio…</p><button className="btn" type="button" onClick={cancel}>Cancel audio upload</button></>}
    {error && <p role="alert">{error}</p>}
  </fieldset>;
}

export function AudioResourceEditor({ audio, onChange, onPendingChange }: { audio?: Record<string, string>; onChange: (audio: Record<string, string> | undefined) => void; onPendingChange?: (pending: boolean) => void }) {
  const uploading = useRef(false);
  const [busy, setBusy] = useState(false), [selectedKey, setSelectedKey] = useState<string>(), [newKey, setNewKey] = useState(''), [error, setError] = useState('');
  const [removal, setRemoval] = useState<{ key: string; value: string }>();
  const latest = useRef(audio); latest.current = audio;
  const keys = Object.keys(audio ?? {}), key = selectedKey && Object.prototype.hasOwnProperty.call(audio ?? {}, selectedKey) ? selectedKey : keys[0];
  const selected = key === undefined ? -1 : keys.indexOf(key), value = key === undefined ? undefined : audio![key];
  function allowed() { if (uploading.current) { setError('Finish or cancel the audio upload first.'); return false; } return true; }
  function update(next: Record<string, string>): boolean {
    if (!allowed()) return false;
    const errors = validateCourseAudioFields({ audio: next }, 'course', { mode: 'source' });
    if (errors.length) { setError(errors.join('\n')); return false; }
    setError(''); setRemoval(undefined); onChange(next); return true;
  }
  function select(next: string) { if (allowed()) { setSelectedKey(next); setRemoval(undefined); setError(''); } }
  return <section className="stack" aria-label="Audio resource library"><h3>Recorded audio and pronunciation library</h3>
    <p>Keys match spoken words or named sounds. Spoken replacements use device voices; recordings remain embedded. No audio plays automatically here.</p>
    <label className="field">New clip key<input className="input" value={newKey} onChange={e => setNewKey(e.target.value)} /></label>
    <button className="btn" type="button" disabled={busy} onClick={() => {
      if (!allowed()) return;
      if (!newKey.trim()) { setError('Enter a clip key.'); return; }
      if (Object.prototype.hasOwnProperty.call(audio ?? {}, newKey)) { setError('Clip key already exists.'); return; }
      const next = { ...audio, [newKey]: `say:${newKey}` };
      if (validateCourseAudioFields({ audio: next }, 'course', { mode: 'source' }).length) { setError('Clip key is invalid or collides with an existing normalized key.'); return; }
      if (update(next)) { setSelectedKey(newKey); setNewKey(''); }
    }}>Add audio entry</button>
    {key !== undefined && <div className="stack">
      <label className="field">Audio entry<select className="select" value={key} disabled={busy} onChange={e => select(e.target.value)}>{keys.map(k => <option key={k} value={k}>{k}</option>)}</select></label>
      <p>Entry {selected + 1} of {keys.length}: {key}</p>
      <div className="row"><button className="btn" type="button" disabled={busy || selected <= 0} onClick={() => select(keys[selected - 1])}>Previous audio entry</button><button className="btn" type="button" disabled={busy || selected === keys.length - 1} onClick={() => select(keys[selected + 1])}>Next audio entry</button></div>
      <label className="field">Clip key<input className="input" disabled={busy} value={key} onChange={e => {
        if (e.target.value === key) return;
        if (Object.prototype.hasOwnProperty.call(audio!, e.target.value)) { setError('Clip key already exists.'); return; }
        const next = Object.fromEntries(Object.entries(audio!).map(([k, v]) => [k === key ? e.target.value : k, v]));
        if (update(next)) setSelectedKey(e.target.value);
      }} /></label>
      <label className="field">Spoken replacement<textarea className="textarea" disabled={busy} value={value && /^say:/i.test(value) ? value.slice(4) : ''} onChange={e => update({ ...audio, [key]: `say:${e.target.value}` })} /></label>
      <p className="small">Entering a spoken replacement replaces this entry's recording. Keep a separate entry when you need both.</p>
      <EmbeddedAudioInput key={key} label="Library recording" sourceVersion={value} value={value && /^say:/i.test(value) ? undefined : value} onPendingChange={v => { uploading.current = v; setBusy(v); onPendingChange?.(v); }} onChange={v => {
        if (v) update({ ...latest.current, [key]: v });
        else { const next = { ...latest.current }; delete next[key]; update(next); }
      }} />
      <button className="btn" type="button" disabled={busy} onClick={() => { if (allowed()) setRemoval({ key, value: value! }); }}>Remove audio entry</button>
      {removal && <div role="alert"><p>Remove audio entry “{removal.key}” from the draft? Existing published versions are unchanged.</p><button className="btn" type="button" disabled={busy} onClick={() => {
        if (!allowed()) return;
        if (!Object.prototype.hasOwnProperty.call(latest.current ?? {}, removal.key) || latest.current![removal.key] !== removal.value) { setRemoval(undefined); setError('The entry changed. Review it before removing.'); return; }
        const next = { ...latest.current }; delete next[removal.key]; update(next);
      }}>Confirm audio entry removal</button><button className="btn" type="button" onClick={() => setRemoval(undefined)}>Keep audio entry</button></div>}
    </div>}
    {error && <p role="alert">{error}</p>}
  </section>;
}
