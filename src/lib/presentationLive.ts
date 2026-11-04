import { API } from './community';
import type { PresentationMessage } from './presentationProtocol';
export async function openPresentationRoom():Promise<{code:string;token:string;joinUrl:string}> {
  let response:Response;
  try { response=await fetch(`${API}/presentation/rooms`,{method:'POST'}); }
  catch { throw Error('Could not reach the presentation server. Check your connection and retry.'); }
  const data=await response.json().catch(()=>({}));
  if(!response.ok||typeof data.code!=='string'||typeof data.token!=='string')throw Error(data.error||'Could not open presentation room.');
  return {code:data.code,token:data.token,joinUrl:typeof data.joinUrl==='string'?data.joinUrl:''};
}
const base=()=>API.replace(/^http/,'ws');
export const presentationHostUrl=(code:string,token:string)=>`${base()}/presentation/rooms/${code}/ws?role=host&token=${encodeURIComponent(token)}`;
export const presentationPlayerUrl=(code:string,player?:string)=>`${base()}/presentation/rooms/${code}/ws?role=player${player?`&player=${encodeURIComponent(player)}`:''}`;
export function presentationSocket(url:string,handlers:{onMessage:(message:PresentationMessage)=>void;onStatus:(status:'connecting'|'open'|'lost')=>void;onEnd:(code:number,reason:string)=>void},hello?:()=>unknown) {
  let socket:WebSocket|null=null,stopped=false,tries=0;
  let getUrl=()=>url,timer:ReturnType<typeof setTimeout>|undefined;
  const connect=()=>{
    if(stopped)return;
    handlers.onStatus('connecting');
    let ws:WebSocket;
    try { ws=new WebSocket(getUrl()); } catch { stopped=true; handlers.onEnd(0,'Could not connect to presentation room.');return; }
    socket=ws;
    ws.onopen=()=>{if(stopped||socket!==ws){ws.close(1000);return;}tries=0;handlers.onStatus('open');const h=hello?.();if(h&&socket===ws&&!stopped)ws.send(JSON.stringify(h));};
    ws.onmessage=e=>{if(stopped||socket!==ws)return;try{handlers.onMessage(JSON.parse(String(e.data)) as PresentationMessage);}catch{/* Ignore malformed transport data. */}};
    ws.onclose=e=>{if(stopped||socket!==ws)return;if(e.code>=4000&&e.code<4100){stopped=true;handlers.onEnd(e.code,e.reason);return;}handlers.onStatus('lost');if(++tries>30){stopped=true;handlers.onEnd(0,'Connection lost. Rejoin to recover your room state.');return;}timer=setTimeout(connect,Math.min(8000,500*2**Math.min(tries,4)));};
  };
  connect();
  return {send:(message:unknown)=>{if(stopped||socket?.readyState!==WebSocket.OPEN)return false;try{socket.send(JSON.stringify(message));return true;}catch{return false;}},setUrl:(fn:()=>string)=>{getUrl=fn;},stop:()=>{stopped=true;clearTimeout(timer);socket?.close(1000);}};
}
