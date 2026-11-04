// Synthetic test fixtures only, not distributed course content or real identities.
import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import ContentInteroperability from '../../src/components/ContentInteroperability';
import {exportQtiItem,importQtiItem,qtiChoiceToBank} from '../../src/lib/interopQti';
import {exportSkillsToCase,serializeCasePackage} from '../../src/lib/interopCase';
import {exportCartridge} from '../../src/lib/interopCartridge';
import {emptyCourse} from '../../src/lib/course';
import {requestNavigation} from '../../src/lib/navigationGuard';
import '../../src/styles.css';
import '../../src/interoperability.css';
const choice=exportQtiItem({id:'external_item',title:'Synthetic choice',prompt:'Choose the first option',kind:'choice',multiple:false,shuffle:false,choices:[{id:'first',text:'First'},{id:'second',text:'Second'}],correct:['first']});
const exact=exportQtiItem({id:'external_text',title:'Synthetic exact text',prompt:'Enter the exact response',kind:'text',suffix:'End of prompt',correct:'Exact'});
const framework=serializeCasePackage(await exportSkillsToCase([{id:'synthetic.skill',title:'Synthetic skill',prerequisites:[],evidence:{}}],{namespace:'https://example.test/framework',title:'Synthetic framework',creator:'Test author',lastChangeDateTime:'2026-10-29T00:00:00Z'}));
const archive=exportCartridge({identifier:'synthetic_package',title:'Synthetic cartridge',items:[{identifier:'item_one',title:'Static resource',resourceId:'static_resource',children:[]}],resources:[{identifier:'static_resource',kind:'text',title:'Static resource',text:'Inert <strong>text</strong> and learning notes.'},{identifier:'external_link',kind:'link',title:'External link',url:'https://example.test/resource'}]});
const course=emptyCourse('Synthetic source course');course.id='synthetic_course';course.modules=[{id:'module',title:'Synthetic module'}];course.lessons=[{id:'lesson',module:'module',title:'Synthetic lesson',body:'Text snapshot only.\n\nNo runtime behavior.'}];
const bank=qtiChoiceToBank(importQtiItem(choice),'synthetic_bank');let saved:any[]=[], fail=false,locked=false;
Object.assign(window,{exchangeFixture:{choice,exact,framework,archive:Array.from(archive),saved:()=>saved,failNext:()=>{fail=true;},lock:()=>{locked=true;},unlock:()=>{locked=false;}}});
function Fixture(){const [shown,setShown]=useState(true);const api:any={allCourses:[course],courses:[course],banks:[bank],importInteroperabilityBank:async(xml:string)=>{if(locked)throw Error('Adult access changed; reopen content exchange.');if(fail){fail=false;throw Error('Synthetic interrupted save. Retry safely.');}saved.push(qtiChoiceToBank(importQtiItem(xml),'copy_'+saved.length));}};return <><button className="btn" onClick={()=>{if(requestNavigation('app',{name:shown?'outside':'parent'}))setShown(!shown);}}>{shown?'Leave exchange':'Reopen exchange'}</button>{shown?<ContentInteroperability api={api}/>:<p>Outside exchange</p>}</>;}
createRoot(document.getElementById('root')!).render(<React.StrictMode><Fixture/></React.StrictMode>);
