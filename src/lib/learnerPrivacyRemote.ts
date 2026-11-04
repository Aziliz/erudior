/** Opt-in integration point for a separately configured app identity provider.
 * No production provider is installed. Community cookies and imported keys are never used. */
import {learnerBindingEqual,parseLearnerBinding,parseLearnerTrust,validateLearnerGrant,type LearnerBinding,type LearnerScope,type LearnerTrust} from './learnerPrivacy';
import type {PrivacyRemote} from './learnerPrivacyStore';
export function learnerPrivacyRemote(options:{baseUrl:string;binding:LearnerBinding;trust:LearnerTrust;grant:(scope:LearnerScope)=>Promise<unknown>;fetch?:typeof fetch;now?:()=>number}):PrivacyRemote {
 const url=new URL(options.baseUrl);if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash||url.pathname!=='/')throw Error('A fixed HTTPS app API origin is required.');
 const binding=parseLearnerBinding(options.binding),trust=parseLearnerTrust(options.trust),requestFetch=options.fetch??fetch;
 return {binding,async request(operation,body){const scope=operation==='write'?'write':operation==='erase'?'erase':'read',signed=await options.grant(scope),grant=validateLearnerGrant(signed,trust,options.now?.()??Math.floor(Date.now()/1000),scope);if(!learnerBindingEqual(binding,{namespace:grant.namespace,account:grant.account,profile:grant.profile,schemaVersion:1}))throw Error('Authenticated app profile changed.');
 const response=await requestFetch(new URL(`learner-progress/${operation}`,url),{method:'POST',credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer',redirect:'error',headers:{'Content-Type':'application/json','Authorization':'Bearer '+JSON.stringify(signed)},body:JSON.stringify(body)});
 const reader=response.body?.getReader();if(!reader)throw Error('Missing server response.');let length=0;const chunks:Uint8Array[]=[];for(;;){const item=await reader.read();if(item.done)break;length+=item.value.length;if(length>150000){await reader.cancel();throw Error('Server response too large.');}chunks.push(item.value);}const bytes=new Uint8Array(length);let at=0;for(const b of chunks){bytes.set(b,at);at+=b.length;}const value:unknown=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));if(!response.ok)throw Error(`Server progress request failed (${response.status}). Reload current state; no overwrite was authorized.`);return value;
 }};
}
