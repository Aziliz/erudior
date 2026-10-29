// Original synthetic fixtures only. No production learner or course mutations.
import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import CourseSpreadsheetEditor from '../../src/components/CourseSpreadsheetEditor';
import SpreadsheetCourseAssignment from '../../src/components/SpreadsheetCourseAssignment';
import SpreadsheetReviewPanel from '../../src/components/SpreadsheetReviewPanel';
import {emptyCourse,exportCourseSnapshot} from '../../src/lib/course';
import {importValidatedCourseSnapshot} from '../../src/lib/courseIntegrity';
import {emptyProgress,useStudentFiles} from '../../src/lib/storage';
import {requestNavigation} from '../../src/lib/navigationGuard';
import '../../src/styles.css';
const initial=emptyCourse('Synthetic spreadsheet course');initial.id='spreadsheet-fixture';initial.lessons=[{id:'lesson',module:initial.modules[0].id,title:'Synthetic work',body:'Synthetic engine regression only.'}];
let course=localStorage.getItem('spreadsheet-fixture-course')?importValidatedCourseSnapshot(localStorage.getItem('spreadsheet-fixture-course')!):initial;
const histories:Record<string,any>=JSON.parse(localStorage.getItem('spreadsheet-fixture-progress')||'{}');let fail=false;
Object.assign(window,{spreadsheetFixture:{course:()=>course,progress:()=>histories,failNextSave:()=>{fail=true;}}});
function Fixture(){const [mode,setMode]=useState('author'),[student,setStudent]=useState('alice'),[tick,setTick]=useState(0),[dirty,setDirty]=useState(false),[notice,setNotice]=useState('');void tick;useStudentFiles(student);histories[student]??=emptyProgress();
const api:any={student:{id:student,name:student},progress:histories[student],updateProgress:async(fn:any)=>{if(fail){fail=false;throw Error('Synthetic interrupted save');}histories[student]=fn(histories[student]);localStorage.setItem('spreadsheet-fixture-progress',JSON.stringify(histories));setTick(x=>x+1);}};
function go(next:string){if(dirty){setNotice('Apply assignment changes before leaving.');return;}if(requestNavigation())setMode(next);}
return <><div className="row" style={{flexWrap:'wrap'}}><button className="btn" onClick={()=>go('author')}>Fixture author</button><button className="btn" onClick={()=>go('review')}>Fixture review</button><button className="btn" onClick={()=>go('learner')}>Fixture learner</button></div>{notice&&<p role="status">{notice}</p>}{mode==='author'?<><CourseSpreadsheetEditor course={course} update={fn=>{course=fn(course);setTick(x=>x+1);}} onEditingChange={setDirty}/><button className="btn" disabled={dirty} onClick={()=>{localStorage.setItem('spreadsheet-fixture-course',exportCourseSnapshot(course));setNotice('Exact course snapshot saved.');}}>Fixture save course</button></>:mode==='review'?<SpreadsheetReviewPanel course={course}/>:<><label>Fixture learner identity<select className="select" value={student} onChange={e=>setStudent(e.target.value)}><option value="alice">Alice</option><option value="bob">Bob</option></select></label>{course.spreadsheetAssignments?.map(a=><SpreadsheetCourseAssignment key={a.id} api={api} courseId={course.id} assignment={a}/>)}</>}</>;}
createRoot(document.getElementById('root')!).render(<React.StrictMode><Fixture/></React.StrictMode>);
