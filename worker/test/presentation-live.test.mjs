import assert from 'node:assert/strict';
const API=process.env.API??'http://localhost:8787',WS=API.replace(/^http/,'ws');
const sockets=[];
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function connect(url){
 const ws=new WebSocket(url),messages=[],closed={code:0};sockets.push(ws);
 ws.addEventListener('message',e=>messages.push(JSON.parse(e.data)));
 ws.addEventListener('close',e=>{closed.code=e.code;});
 const open=new Promise((resolve,reject)=>{ws.addEventListener('open',resolve);ws.addEventListener('error',reject);});
 return {ws,messages,closed,open,send:m=>ws.send(JSON.stringify(m)),last:t=>messages.filter(m=>m.t===t).at(-1),async wait(t,p=()=>true){const until=Date.now()+5000;for(;;){const m=this.last(t);if(m&&p(m))return m;if(Date.now()>until)throw Error(`Timed out for ${t}: ${JSON.stringify(messages.slice(-2))}`);await sleep(15);}}};
}
const source={courseId:'test-course',courseRevision:1,kind:'lesson',containerId:'',resourceId:'lesson'};
const qsource={...source,kind:'question',containerId:'bank',resourceId:'q'};
const deck={format:'erudior-presentation',version:1,id:'deck',title:'Existing course review',revision:1,slides:[
 {id:'intro',kind:'content',title:'Read',text:'Review the installed lesson.',source},
 {id:'question',kind:'question',title:'Check',text:'Choose two.',choices:['One','Two'],answer:[1],source:qsource},
 {id:'video',kind:'video',title:'Watch',text:'Choose two again.',choices:['One','Two'],answer:[1],source:qsource,videoUrl:'https://media.erudior.com/example.mp4',transcript:'Text alternative to the video.',pauseAt:5}
]};
async function room(pacing){
 const res=await fetch(`${API}/presentation/rooms`,{method:'POST'});assert.equal(res.status,201);const data=await res.json();assert.match(data.joinUrl,/\?presentation=/);
 const url=`${WS}/presentation/rooms/${data.code}/ws`;
 const host=connect(`${url}?role=host&token=${data.token}`);await host.open;await host.wait('presentation-host');
 host.send({t:'setup',deck,pacing});await host.wait('presentation-host',m=>m.deck?.id==='deck'&&m.pacing===pacing);
 return {host,url,...data};
}
async function join(url,name){const p=connect(`${url}?role=player`);await p.open;await p.wait('hello');p.send({t:'join',name});await p.wait('presentation-play');return p;}
try{
 const t=await room('teacher'),{host,url}=t;
 assert.equal((await fetch(`${API}/live/rooms/${t.code}/ws`)).status,426); // The separate quiz namespace never returns presentation state.
 const bad=connect(`${url}?role=host&token=wrong`);await bad.open;await sleep(80);assert.equal(bad.closed.code,4003);
 const a=await join(url,'Ada'),b=await join(url,'Bert');
 host.send({t:'setup',pacing:'teacher',deck:{...deck,slides:[]}});await host.wait('error');assert.equal(host.last('presentation-host').deck.slides.length,3);
 host.send({t:'start'});await a.wait('presentation-play',m=>m.phase==='active');
 assert.equal(a.last('presentation-play').slide.kind,'content');assert.equal(a.last('presentation-play').slide.source,undefined);
 a.send({t:'next',index:0});await sleep(60);assert.equal(a.last('presentation-play').index,0);
 host.send({t:'next',index:0});await a.wait('presentation-play',m=>m.index===1);
 const publicQuestion=a.last('presentation-play');assert.equal(publicQuestion.answer,undefined);assert.equal(publicQuestion.slide.answer,undefined);assert.equal(JSON.stringify(publicQuestion).includes('Bert'),false);
 a.send({t:'answer',index:9,choices:[1]});a.send({t:'answer',index:1,choices:[1,1]});await sleep(60);assert.equal(a.last('presentation-play').answered,null);assert.match(a.last('error').message,/valid answer/);
 a.send({t:'answer',index:1,choices:[1]});await a.wait('presentation-play',m=>m.answered!==null);
 assert.equal(a.last('presentation-play').correct,0);assert.equal(a.last('presentation-play').answer,undefined);
 a.send({t:'answer',index:1,choices:[0]});host.send({t:'next',index:1});await sleep(60);assert.equal(host.last('presentation-host').index,1);
 host.send({t:'reveal',index:1});await a.wait('presentation-play',m=>m.revealed);assert.deepEqual(a.last('presentation-play').answered,[1]);assert.equal(a.last('presentation-play').right,true);
 b.send({t:'answer',index:1,choices:[1]});await sleep(50);assert.equal(b.last('presentation-play').answered,null);
 host.send({t:'next',index:1});await a.wait('presentation-play',m=>m.index===2);host.send({t:'next',index:1});await sleep(50);assert.equal(host.last('presentation-host').index,2);
 assert.equal(a.last('presentation-play').slide.kind,'video');assert.equal(a.last('presentation-play').slide.answer,undefined);assert.equal(a.last('presentation-play').answer,undefined);
 const aid=a.last('presentation-play').player;
 const replacement=connect(`${url}?role=player&player=${encodeURIComponent(aid)}`);await replacement.open;await replacement.wait('presentation-play');await sleep(60);assert.equal(a.closed.code,4000);assert.equal(replacement.last('presentation-play').index,2);
 const h2=connect(`${url}?role=host&token=${t.token}`);await h2.open;await h2.wait('presentation-host');await sleep(60);assert.equal(host.closed.code,4000);assert.equal(h2.last('presentation-host').index,2);
 h2.send({t:'close'});await replacement.wait('closed');await sleep(60);assert.equal(replacement.closed.code,4001);assert.equal((await fetch(`${API}/presentation/rooms/${t.code}/ws`)).status,404);
 const s=await room('student'),x=await join(s.url,'Xenia'),y=await join(s.url,'Yara');s.host.send({t:'start'});await x.wait('presentation-play',m=>m.phase==='active');
 x.send({t:'next',index:0});await x.wait('presentation-play',m=>m.index===1);assert.equal(y.last('presentation-play').index,0);
 x.send({t:'next',index:1});await sleep(60);assert.equal(x.last('presentation-play').index,1);assert.match(x.last('error').message,/Answer the current question/);
 x.send({t:'answer',index:1,choices:[0]});await x.wait('presentation-play',m=>m.revealed);assert.equal(x.last('presentation-play').right,false);assert.deepEqual(x.last('presentation-play').answer,[1]);
 x.send({t:'answer',index:1,choices:[1]});x.send({t:'next',index:1});await x.wait('presentation-play',m=>m.index===2);assert.equal(x.last('presentation-play').correct,0);assert.equal(x.last('presentation-play').answer,undefined);
 x.send({t:'answer',index:2,choices:[1]});await x.wait('presentation-play',m=>m.revealed);x.send({t:'next',index:2});await x.wait('presentation-play',m=>m.phase==='ended');assert.equal(x.last('presentation-play').correct,1);
 assert.equal(y.last('presentation-play').phase,'active');assert.equal(y.last('presentation-play').index,0);
 y.send({t:'next',index:0});await y.wait('presentation-play',m=>m.index===1);assert.equal(y.last('presentation-play').answer,undefined);assert.equal(y.last('presentation-play').slide.answer,undefined);assert.equal(JSON.stringify(y.last('presentation-play')).includes('Xenia'),false);
 s.host.send({t:'end'});await y.wait('presentation-play',m=>m.phase==='ended');assert.equal(y.last('presentation-play').slide,null);s.host.send({t:'close'});await y.wait('closed');
 console.log('Presentation rooms: teacher/student pacing, source stripping, private results, malformed/stale/idempotent controls, reconnection, video questions and acknowledged close passed.');
} finally {for(const ws of sockets)try{ws.close();}catch{}}
