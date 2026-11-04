import { parsePresentation, PRESENTATION_LIMITS, type PresentationDeck } from '../../src/lib/presentations';
import { publicPresentationSlide, type PresentationHostState, type PresentationPlayState, type PresentationPacing } from '../../src/lib/presentationProtocol';
const ROOM_MS=4*3600_000,HOST_GONE_MS=10*60_000,MAX_PLAYERS=200;
interface Player {id:string;name:string;socket:WebSocket|null;index:number;answers:Map<number,number[]>}
const same=(a:number[],b:number[])=>a.length===b.length&&[...a].sort().every((n,i)=>n===[...b].sort()[i]);
const send=(socket:WebSocket|null,message:unknown)=>{try{socket?.send(JSON.stringify(message));}catch{/* disconnected */}};
async function hash(text:string){const bytes=new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)));return [...bytes].map(n=>n.toString(16).padStart(2,'0')).join('');}
/** Ephemeral presentation room. It deliberately never writes learner responses to durable storage. */
export class PresentationRoom {
  private hostHash='';private host:WebSocket|null=null;private created=0;private hostLeftAt=0;
  private deck:PresentationDeck|null=null;private pacing:PresentationPacing='teacher';private phase:'lobby'|'active'|'ended'='lobby';
  private index=-1;private revealed=new Set<number>();private players=new Map<string,Player>();private sockets=new Set<WebSocket>();
  constructor(private state:DurableObjectState){}
  async fetch(req:Request):Promise<Response>{
    const url=new URL(req.url);
    if(url.pathname==='/presentation-init'&&req.method==='POST'){
      if(this.hostHash&&Date.now()-this.created<ROOM_MS)return new Response('taken',{status:409});
      this.close('Previous room expired.');
      const value=await req.json() as {tokenHash?:unknown};
      if(typeof value.tokenHash!=='string'||!/^[a-f0-9]{64}$/.test(value.tokenHash))return new Response('Invalid token',{status:400});
      this.hostHash=value.tokenHash;this.created=Date.now();this.phase='lobby';
      await this.state.storage.setAlarm(this.created+ROOM_MS);return new Response('ok');
    }
    if(!url.pathname.startsWith('/presentation/rooms/'))return new Response('Wrong room type.',{status:404});
    if(!this.hostHash||Date.now()-this.created>=ROOM_MS){this.close('Room expired.');return new Response('No such room.',{status:404});}
    if(req.headers.get('Upgrade')!=='websocket')return new Response('Expected WebSocket.',{status:426});
    const role=url.searchParams.get('role');
    if(role!=='host'&&role!=='player')return new Response('Invalid role.',{status:400});
    if(role==='player'&&this.sockets.size>=MAX_PLAYERS*2)return new Response('Too many connections.',{status:429});
    const pair=new WebSocketPair(),client=pair[0],socket=pair[1];socket.accept();
    if(role==='host'){
      if(await hash(url.searchParams.get('token')??'')!==this.hostHash){socket.close(4003,'Not the host.');return new Response(null,{status:101,webSocket:client});}
      this.host?.close(4000,'Opened elsewhere.');this.host=socket;this.hostLeftAt=0;
      socket.addEventListener('message',e=>{if(this.host===socket)this.onHost(String(e.data));});
      socket.addEventListener('close',()=>{if(this.host===socket){this.host=null;this.hostLeftAt=Date.now();void this.state.storage.setAlarm(Math.min(this.created+ROOM_MS,this.hostLeftAt+HOST_GONE_MS));}});
      this.sendHost();
    }else{
      this.sockets.add(socket);
      socket.addEventListener('message',e=>this.onPlayer(socket,String(e.data)));
      socket.addEventListener('close',()=>{this.sockets.delete(socket);for(const player of this.players.values())if(player.socket===socket)player.socket=null;this.sendHost();});
      const player=this.players.get(url.searchParams.get('player')??'');
      if(player){if(player.socket)this.sockets.delete(player.socket);player.socket?.close(4000,'Opened elsewhere.');player.socket=socket;this.sendPlayer(player);this.sendHost();}
      else send(socket,{t:'hello',title:this.deck?.title??'Presentation'});
    }
    return new Response(null,{status:101,webSocket:client});
  }
  async alarm(){
    const now=Date.now();if(!this.hostHash)return;
    if(now>=this.created+ROOM_MS||(!this.host&&this.hostLeftAt&&now>=this.hostLeftAt+HOST_GONE_MS)){this.close('Presentation room closed.');return;}
    await this.state.storage.setAlarm(Math.min(this.created+ROOM_MS,!this.host&&this.hostLeftAt?this.hostLeftAt+HOST_GONE_MS:this.created+ROOM_MS));
  }
  private close(message:string){
    send(this.host,{t:'closed',message});this.host?.close(4001,message);
    for(const player of this.players.values()){send(player.socket,{t:'closed',message});player.socket?.close(4001,message);}
    this.host=null;this.hostHash='';for(const socket of this.sockets)socket.close(4001,message);this.sockets.clear();this.players.clear();this.deck=null;this.index=-1;this.revealed.clear();this.phase='ended';this.hostLeftAt=0;
  }
  private parse(raw:string):Record<string,unknown>|null{
    if(raw.length>PRESENTATION_LIMITS.bytes+1000)return null;
    try{const v=JSON.parse(raw);return v&&typeof v==='object'&&!Array.isArray(v)?v:null;}catch{return null;}
  }
  private onHost(raw:string){
    const m=this.parse(raw);if(!m)return;
    if(m.t==='close'){this.close('Presentation closed by the host.');return;}
    if(m.t==='setup'){
      if(this.phase!=='lobby')return;
      try{
        if(m.pacing!=='teacher'&&m.pacing!=='student')throw Error('Choose teacher or student pacing.');
        const deck=parsePresentation(m.deck);if(!deck.slides.length)throw Error('Add at least one slide.');
        this.deck=deck;this.pacing=m.pacing;this.broadcast();
      }catch(e){send(this.host,{t:'error',message:e instanceof Error?e.message:'Invalid presentation.'});}
      return;
    }
    if(m.t==='start'&&this.phase==='lobby'&&this.deck){this.phase='active';this.index=0;for(const p of this.players.values())p.index=0;this.broadcast();return;}
    if(this.phase!=='active'||!this.deck)return;
    if(m.t==='end'){this.phase='ended';this.broadcast();return;}
    if(this.pacing!=='teacher'||m.index!==this.index)return;
    if(m.t==='reveal'){
      if(this.deck.slides[this.index]?.kind==='content')return;
      this.revealed.add(this.index);this.broadcast();
    }else if(m.t==='next'){
      if(this.deck.slides[this.index]?.kind!=='content'&&!this.revealed.has(this.index))return;
      this.index++;if(this.index>=this.deck.slides.length)this.phase='ended';
      for(const p of this.players.values())p.index=this.index;
      this.broadcast();
    }
  }
  private onPlayer(socket:WebSocket,raw:string){
    if(!this.hostHash||!this.sockets.has(socket))return;
    const m=this.parse(raw);if(!m)return;
    let player=[...this.players.values()].find(p=>p.socket===socket);
    if(m.t==='join'){
      if(player){this.sendPlayer(player);return;}
      if(this.phase==='ended'){send(socket,{t:'error',message:'Presentation has ended.'});return;}
      if(this.players.size>=MAX_PLAYERS){send(socket,{t:'error',message:'Room is full.'});return;}
      const name=typeof m.name==='string'?m.name.replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,40):'';
      if(!name){send(socket,{t:'error',message:'Enter a nickname.'});return;}
      if([...this.players.values()].some(p=>p.name.toLowerCase()===name.toLowerCase())){send(socket,{t:'error',message:'Nickname is already taken.'});return;}
      player={id:crypto.randomUUID(),name,socket,index:this.phase==='active'?(this.pacing==='teacher'?this.index:0):-1,answers:new Map()};
      this.players.set(player.id,player);this.sendPlayer(player);this.sendHost();return;
    }
    if(!player)return;
    if(this.phase!=='active'||!this.deck||m.index!==player.index){this.sendPlayer(player);return;}
    const slide=this.deck.slides[player.index];if(!slide)return;
    if(m.t==='answer'&&slide.kind!=='content'&&!player.answers.has(player.index)){
      if(this.pacing==='teacher'&&this.revealed.has(player.index)){this.sendPlayer(player);return;}
      const choices=m.choices;
      if(!Array.isArray(choices)||!choices.length||new Set(choices).size!==choices.length||!choices.every(n=>Number.isInteger(n)&&n>=0&&n<slide.choices.length)||(slide.answer.length===1&&choices.length!==1)){send(socket,{t:'error',message:'Choose a valid answer for the current slide.'});this.sendPlayer(player);return;}
      player.answers.set(player.index,[...choices].sort((a,b)=>a-b));this.sendPlayer(player);this.sendHost();
    }else if(m.t==='next'&&this.pacing==='student'){
      if(slide.kind!=='content'&&!player.answers.has(player.index)){send(socket,{t:'error',message:'Answer the current question before continuing.'});this.sendPlayer(player);return;}
      player.index++;this.sendPlayer(player);this.sendHost();
    }else this.sendPlayer(player);
  }
  private visibleCorrect(player:Player){
    if(!this.deck)return 0;
    return [...player.answers].filter(([index,answer])=>{const slide=this.deck!.slides[index];return slide?.kind!=='content'&&(this.pacing==='student'||this.revealed.has(index))&&same(answer,slide.answer);}).length;
  }
  private sendHost(){
    const message:PresentationHostState={t:'presentation-host',phase:this.phase,deck:this.deck,pacing:this.pacing,index:this.index,revealed:this.revealed.has(this.index),players:[...this.players.values()].map(p=>({id:p.id,name:p.name,connected:!!p.socket,index:p.index,answered:p.answers.has(p.index),correct:this.visibleCorrect(p)})),answered:[...this.players.values()].filter(p=>p.answers.has(this.index)).length};
    send(this.host,message);
  }
  private sendPlayer(player:Player){
    const active=this.phase==='active'&&!!this.deck&&player.index<this.deck.slides.length;
    const slide=active?this.deck!.slides[player.index]:null;
    const answer=player.answers.get(player.index)??null;
    const revealed=!!slide&&slide.kind!=='content'&&(this.pacing==='student'?!!answer:this.revealed.has(player.index));
    const message:PresentationPlayState={t:'presentation-play',player:player.id,name:player.name,title:this.deck?.title??'Presentation',pacing:this.pacing,phase:this.phase==='lobby'?'lobby':active?'active':'ended',index:player.index,total:this.deck?.slides.length??0,slide:slide?publicPresentationSlide(slide):null,answered:answer,revealed,correct:this.visibleCorrect(player)};
    if(revealed&&slide){message.answer=[...slide.answer];message.right=!!answer&&same(answer,slide.answer);}
    send(player.socket,message);
  }
  private broadcast(){this.sendHost();for(const player of this.players.values())this.sendPlayer(player);}
}
