import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import Panel,{type CredentialVerificationView,type CredentialVerifier} from '../../src/components/CredentialIntegrityPanel';
import {credentialHash,credentialBase64,verifyCredentialStatus} from '../../src/lib/credentialIntegrity';
import {verifyCredentialBundle} from '../../src/lib/credentialPdf';
import {credentialFixture} from './credentialIntegrity';
import '../../src/styles.css';
const fixture=await credentialFixture(Math.floor(Date.now()/1000));
let fail=false,revoked=false;
async function view(raw:string,fresh=false):Promise<CredentialVerificationView>{
 if(fail){fail=false;throw Error('Synthetic interrupted verification; retry safely.');}
 const checked=await verifyCredentialBundle(JSON.parse(raw),fixture.trust),first=checked.events[0];
 let status:CredentialVerificationView['status']='unknown',statusMessage='Historical signature only. Current registry status has not been checked.',checkedAt:string|undefined,statusExpiresAt:string|undefined;
 if(fresh){const now=Math.floor(Date.now()/1000),challenge=credentialBase64(crypto.getRandomValues(new Uint8Array(32))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');const signed=fixture.status(challenge,revoked?'revoked':'issued',now);const current=verifyCredentialStatus(signed,fixture.trust,first.credentialId,now,challenge,first.lookupTokenHash);status=current.status==='issued'?'active':'revoked';statusMessage='Fresh synthetic signed registry response. No real qualification was issued.';checkedAt=new Date(current.checkedAt*1000).toISOString();statusExpiresAt=new Date(current.expiresAt*1000).toISOString();}
 return {issuer:fixture.trust.issuerId,program:`${first.programId} revision ${first.programVersion}`,credentialId:first.credentialId,issuedAt:new Date(first.at*1000).toISOString(),status,statusMessage,checkedAt,statusExpiresAt,events:await Promise.all(checked.events.map(async(e,i)=>({revision:e.revision,action:e.action,at:new Date(e.at*1000).toISOString(),digest:await credentialHash(checked.bundle.events[i])}))),limitations:['Synthetic ephemeral-key demonstration only; no real enrollment, approval or qualification.','Detached PDF byte signature, not an embedded PAdES signature.'],pdf:checked.pdf};
}
const verifier:CredentialVerifier={label:'Synthetic ephemeral independent public keys',verify:raw=>view(raw),refreshStatus:raw=>view(raw,true)};
const evidenceSources=[{id:'synthetic',title:'Synthetic educational observations',prepare:async()=>JSON.stringify({format:'synthetic-evidence',educationalOnly:true,authority:'local-educational-observations-only',note:'Synthetic observations do not confer qualifying credit.'},null,2)}];
Object.assign(window,{credentialFixture:{bundle:()=>JSON.stringify(fixture.bundle),failNext:()=>{fail=true;},revoke:()=>{revoked=true;}}});
function Fixture(){const [trusted,setTrusted]=useState(false),[profile,setProfile]=useState('one');return <><p>All examples below are synthetic. Ephemeral keys exist only in this isolated test page.</p><div style={{display:'flex',flexWrap:'wrap',gap:8,margin:'12px 0'}}><button className="btn" onClick={()=>setTrusted(true)}>Use synthetic configured trust</button><button className="btn" onClick={()=>setProfile(p=>p==='one'?'two':'one')}>Switch synthetic profile</button></div><Panel profileKey={profile} evidenceSources={trusted?evidenceSources:[]} verifier={trusted?verifier:undefined}/></>;}
createRoot(document.getElementById('root')!).render(<React.StrictMode><Fixture/></React.StrictMode>);
