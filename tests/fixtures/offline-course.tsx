// Synthetic content only. Real browser file transport, validation, IndexedDB and learner renderer.
import React, {useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import CourseHome from '../../src/pages/CourseHome';
import Library from '../../src/pages/Library';
import LessonView from '../../src/pages/LessonView';
import {emptyCourse} from '../../src/lib/course';
import * as store from '../../src/lib/storage';
import type {Course} from '../../src/lib/types';
import '../../src/styles.css';
const source=emptyCourse('Synthetic offline portability');source.id='synthetic-portable-source';
source.lessons=[{id:'portable-lesson',module:source.modules[0].id,title:'Offline image lesson',body:'This original synthetic lesson travels with its image.\n\n![Synthetic chart](https://assets.invalid/synthetic-chart.png)'}];
const progress={...store.emptyProgress(),lessonsDone:{'synthetic-portable-source/portable-lesson':'2026-01-01'}};
function Fixture(){
 const [courses,setCourses]=useState<Course[]>([]),[view,setView]=useState('source'),[notice,setNotice]=useState('');
 const reload=async()=>{const result=await store.listCourses();setCourses(result.courses);};
 useEffect(()=>{void(async()=>{if(!(await store.listCourses()).courses.some(c=>c.id===source.id))await store.saveCourse(source);await reload();})();},[]);
 const imported=courses.filter(c=>c.id!==source.id);
 const api:any={courses,allCourses:courses,progress,family:{mode:'family',students:[]},student:null,catalog:{source:'website'},assignmentBlock:()=>null,toast:setNotice,reload,
  saveCourse:async(c:Course)=>{await store.saveCourse(c);await reload();},go:(route:any)=>setView(route.name==='library'?'library':route.name==='lesson'?'lesson':'source')};
 Object.assign(window,{offlineCourseFixture:{courses:()=>courses,progress:()=>progress,reload}});
 return <><header><h1>Offline portability acceptance</h1><p>Synthetic local test content; no accounts, production courses or uploads.</p><nav aria-label="Fixture navigation" className="row"><button className="btn" onClick={()=>setView('source')}>Source course</button><button className="btn" onClick={()=>setView('library')}>Import screen</button><button className="btn" disabled={!imported.length} onClick={()=>setView('lesson')}>Read imported lesson</button></nav></header>{notice&&<p role="status">{notice}</p>}{view==='library'?<Library api={api} broken={[]} standalone={[]}/>:view==='lesson'&&imported.length?<LessonView api={api} course={imported[imported.length-1]} lesson={imported[imported.length-1].lessons[0]}/>:<CourseHome api={api} course={courses.find(c=>c.id===source.id)||source} tab="lessons"/>}</>;
}
createRoot(document.getElementById('root')!).render(<Fixture/>);
