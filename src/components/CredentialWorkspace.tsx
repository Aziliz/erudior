import {useEffect,useMemo,useRef,useState} from 'react';
import type {AppApi} from '../App';
import {credentialCanonical} from '../lib/credentialIntegrity';
import {credentialInstructionalEvidence} from '../lib/credentialEvidence';
import type {InstructionalLibrary} from '../lib/instructionalEvidence';
import CredentialIntegrityPanel from './CredentialIntegrityPanel';

/** Read-only adapter: the existing adult boundary is rechecked before and after preparation.
 * A local report is never uploaded, registered, signed or converted into qualifying credit. */
export async function prepareAuthorizedCredentialEvidence(service:NonNullable<AppApi['instructionalSupervisor']>,id:string,revision:number){
 const before=await service.load();
 const prepared=await credentialInstructionalEvidence(before,id,revision);
 const after=await service.load();
 const checked=await credentialInstructionalEvidence(after,id,revision);
 if(credentialCanonical(prepared)!==credentialCanonical(checked))throw Error('Evidence changed during preparation. Reload and inspect the current history.');
 // Final authority check after asynchronous digest work. The exact chosen history must still match.
 const final=await service.load();
 if(credentialCanonical(after)!==credentialCanonical(final))throw Error('Evidence changed during preparation. Reload before exporting.');
 return JSON.stringify(prepared,null,2);
}
export default function CredentialWorkspace({api}:{api:AppApi}){
 const service=api.instructionalSupervisor;
 const scope=JSON.stringify({password:api.family?.parent?.password,students:api.family?.students?.map(s=>s.id),student:api.student?.id});
 const [library,setLibrary]=useState<InstructionalLibrary|null>(null),[error,setError]=useState(''),[loading,setLoading]=useState(false),[refresh,setRefresh]=useState(0);
 const generation=useRef(0);
 useEffect(()=>{const g=++generation.current;setLibrary(null);setError('');setLoading(!!service);if(service)void service.load().then(value=>{if(g===generation.current)setLibrary(value);},e=>{if(g===generation.current)setError(e instanceof Error?e.message:'Evidence unavailable.');}).finally(()=>{if(g===generation.current)setLoading(false);});return()=>{generation.current++;};},[service,scope,refresh]);
 const sources=useMemo(()=>library&&service?library.assignments.map(a=>({id:`${a.id}@${a.revision}`,title:`${a.title} — revision ${a.revision}`,prepare:()=>prepareAuthorizedCredentialEvidence(service,a.id,a.revision)})):[],[library,service]);
 return <section><button type="button" style={{minHeight:32}} disabled={loading||!service} onClick={()=>setRefresh(x=>x+1)}>Reload credential evidence sources</button>{loading&&<p role="status">Loading authorized local evidence…</p>}{error&&<p role="alert">{error}</p>}{!service&&<p>No authorized educational evidence source is available in this profile.</p>}<CredentialIntegrityPanel key={scope+':'+refresh} profileKey={scope} evidenceSources={sources}/></section>;
}
