import {useEffect,useRef,useState} from 'react';

/** This view is produced only by the caller's independently configured verifier, never by JSON input. */
export interface CredentialVerificationView {
  issuer:string; program:string; credentialId:string; issuedAt:string;
  status:'active'|'revoked'|'unknown'; statusMessage:string; checkedAt?:string; statusExpiresAt?:string;
  events:{revision:number;action:string;at:string;digest:string}[];
  limitations:string[]; pdf?:Uint8Array;
}
export interface CredentialVerifier {
  label:string;
  verify:(bundleText:string)=>Promise<CredentialVerificationView>;
  refreshStatus?:(bundleText:string)=>Promise<CredentialVerificationView>;
}
export interface CredentialIntegrityPanelProps {
  profileKey?:string;
  evidenceSources?:{id:string;title:string;prepare:()=>Promise<string>}[];
  verifier?:CredentialVerifier;
}
const MAX_BYTES=4*1024*1024;
const control={minHeight:32,maxWidth:'100%'};
function bounded(text:string){if(!text.trim()||new TextEncoder().encode(text).length>MAX_BYTES)throw Error('Provide a nonempty artifact no larger than 4 MiB.');return text;}
export default function CredentialIntegrityPanel({profileKey='',evidenceSources=[],verifier}:CredentialIntegrityPanelProps){
 const [source,setSource]=useState(''),[evidence,setEvidence]=useState(''),[bundle,setBundle]=useState(''),[result,setResult]=useState<CredentialVerificationView|null>(null),[error,setError]=useState(''),[notice,setNotice]=useState(''),[busy,setBusy]=useState(false);
 const generation=useRef(0),locked=useRef(false);
 useEffect(()=>{generation.current++;locked.current=false;setSource('');setEvidence('');setBundle('');setResult(null);setError('');setNotice('');setBusy(false);return()=>{generation.current++;locked.current=false;};},[profileKey,verifier]);
 useEffect(()=>{if(!result||result.status==='unknown')return;const expiry=Date.parse(result.statusExpiresAt??'');const remaining=expiry-Date.now();if(!Number.isFinite(remaining)||remaining<=0){setResult({...result,status:'unknown',statusMessage:'Signed current status is unavailable or expired. Check again before relying on it.'});return;}const timer=setTimeout(()=>setResult(r=>r===result?{...r,status:'unknown',statusMessage:'Signed current status expired. Check again before relying on it.'}:r),Math.min(remaining,2147483647));return()=>clearTimeout(timer);},[result]);
 function invalidate(){generation.current++;setResult(null);setError('');setNotice('');setBusy(false);locked.current=false;}
 async function run(action:()=>Promise<void>){if(locked.current)return;locked.current=true;setBusy(true);setError('');const token=generation.current;try{await action();}catch(e){if(token===generation.current)setError(e instanceof Error?e.message:'The operation failed.');}finally{if(token===generation.current){locked.current=false;setBusy(false);}}}
 function verify(refresh=false){if(locked.current)return;const token=generation.current;setResult(null);void run(async()=>{if(!verifier)throw Error('No independently configured issuer trust is available.');const raw=bounded(bundle);const value=await (refresh&&verifier.refreshStatus?verifier.refreshStatus(raw):verifier.verify(raw));if(token===generation.current){setResult(value);setNotice('Exact artifact integrity checked against configured issuer trust. Read the current-status and authority limits below.');}});}
 function download(bytes:Uint8Array,name:string,type:string){const url=URL.createObjectURL(new Blob([bytes as BlobPart],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),0);}
 return <section aria-label="Credential integrity workspace" style={{overflowWrap:'anywhere',minWidth:0,display:'grid',gap:12}}>
  <h2>Credential integrity and evidence</h2>
  <p><strong>Production issuance is disabled.</strong> This workspace does not issue qualifications, verify a real person’s identity, approve a program or create issuer keys.</p>
  <p>Local educational workload, community accounts and supervising-adult labels are not authenticated qualifying enrollment or institutional approval. A separately authorized issuer must verify enrollment, instructor approval, the exact evidence and approved equivalent-hours methodology.</p>
  <details><summary style={control}>Production prerequisites and trust boundaries</summary><ul><li>Independently approved program and methodology, with effective dates and issuer authority.</li><li>Verified enrollment and authorized instructor attestations bound to the exact evidence.</li><li>Separately provisioned secure issuer signing service, registry and privacy/retention policy.</li><li>Explicit authorization before provisioning credentials, keys, trust registrations or real issuance.</li></ul><p>Signed artifacts prove integrity only relative to independently trusted keys. They do not establish accreditation. A detached signature over PDF bytes is not a PAdES or qualified electronic signature.</p></details>
  <h3>Prepare evidence for authorized review</h3>
  <p>Preparation does not approve hours or issue a credential. Evidence stays in this browser until you explicitly download it; only share it with an authorized recipient.</p>
  <label>Available evidence<select className="select" aria-label="Credential evidence source" style={control} value={source} disabled={busy} onChange={e=>{setSource(e.target.value);setEvidence('');setError('');}}><option value="">Select evidence</option>{evidenceSources.map(s=><option key={s.id} value={s.id}>{s.title}</option>)}</select></label>
  {!evidenceSources.length&&<p>No authorized evidence source is available for this profile.</p>}
  <button className="btn" style={control} disabled={busy||!source} onClick={()=>{const token=generation.current;void run(async()=>{const s=evidenceSources.find(s=>s.id===source);if(!s)throw Error('Evidence source is no longer available.');const raw=bounded(await s.prepare());if(token===generation.current){setEvidence(raw);setNotice('Evidence prepared locally. This is not an approval or qualifying credit.');}});}}>Prepare exact evidence</button>
  {evidence&&<><label>Prepared evidence<textarea className="textarea" aria-label="Prepared credential evidence" rows={8} readOnly value={evidence} style={{width:'100%',boxSizing:'border-box'}}/></label><button className="btn" style={control} disabled={busy} onClick={()=>download(new TextEncoder().encode(evidence),'educational-evidence.json','application/json')}>Download prepared evidence</button></>}
  <h3>Verify an existing signed artifact</h3>
  <p>{verifier?`Independent trust configuration: ${verifier.label}.`:'No independently configured issuer trust is available. Imported keys or local names cannot establish issuer authority.'}</p>
  <label>Signed credential artifact<textarea className="textarea" aria-label="Signed credential artifact" value={bundle} rows={8} maxLength={MAX_BYTES} style={{width:'100%',boxSizing:'border-box'}} onChange={e=>{invalidate();setBundle(e.target.value);}}/></label>
  <label>Import artifact file<input className="input" aria-label="Import credential artifact file" style={control} type="file" accept="application/json,.json" onChange={e=>{const file=e.target.files?.[0];e.target.value='';invalidate();if(!file)return;const token=generation.current;void run(async()=>{if(file.size>MAX_BYTES)throw Error('Artifact exceeds the 4 MiB limit.');const text=bounded(await file.text());if(token===generation.current)setBundle(text);});}}/></label>
  <div style={{display:'flex',flexWrap:'wrap',gap:8,margin:'12px 0'}}><button className="btn" style={control} disabled={busy||!bundle.trim()||!verifier} onClick={()=>verify()}>Verify exact artifact</button><button className="btn" style={control} disabled={busy||!result||!verifier?.refreshStatus} onClick={()=>verify(true)}>Check current signed status</button><button className="btn" style={control} disabled={!bundle&&!result&&!evidence} onClick={()=>{invalidate();setBundle('');setEvidence('');}}>Clear private inputs</button></div>
  {busy&&<p role="status">Checking locally or contacting the configured status service…</p>}{error&&<p role="alert">{error}</p>}{notice&&<p role="status">{notice}</p>}
  {result&&<section aria-label="Credential verification result" style={{display:'grid',gap:12,minWidth:0}}><h3>Artifact integrity verified</h3><dl><dt>Issuer reference</dt><dd>{result.issuer}</dd><dt>Program reference</dt><dd>{result.program}</dd><dt>Credential reference</dt><dd>{result.credentialId}</dd><dt>Issued</dt><dd>{result.issuedAt}</dd><dt>Current status</dt><dd><strong>{result.status}</strong> — {result.statusMessage}</dd>{result.checkedAt&&<><dt>Status checked at</dt><dd>{result.checkedAt}</dd></>}</dl><p>An old issuance signature does not prove that a credential remains active. Unknown or stale status must not be treated as current validity.</p><ul>{result.limitations.map((s,i)=><li key={i}>{s}</li>)}</ul>
   <p>Event history scrolls horizontally on narrow screens. Focus the table region and use the arrow keys.</p><div role="region" aria-label="Signed credential event history" tabIndex={0} style={{overflowX:'auto',position:'relative',maxWidth:'100%'}}><table style={{minWidth:740,width:'100%',borderCollapse:'collapse'}}><caption style={{textAlign:'left',padding:'8px'}}>Immutable signed event history</caption><thead><tr>{['Revision','Action','Time','Signed digest'].map(t=><th key={t} style={{whiteSpace:'nowrap',textAlign:'left',padding:8,minWidth:t==='Revision'?70:t==='Action'?90:t==='Time'?220:260}}>{t}</th>)}</tr></thead><tbody>{result.events.map(e=><tr key={e.revision}><td style={{padding:8,minWidth:70}}>{e.revision}</td><td style={{padding:8,minWidth:90}}>{e.action}</td><td style={{whiteSpace:'nowrap',padding:8,minWidth:220}}>{e.at}</td><td style={{minWidth:260,padding:8}}>{e.digest}</td></tr>)}</tbody></table></div>
   {result.pdf&&<button className="btn" style={control} onClick={()=>download(result.pdf!,'verified-credential.pdf','application/pdf')}>Download verified PDF bytes</button>}
  </section>}
 </section>;
}
