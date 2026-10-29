// Test-only synthetic resources. Not production course content.
import React from 'react';
import {createRoot} from 'react-dom/client';
import Presentations from '../../src/pages/Presentations';
import {createPresentationStore} from '../../src/lib/presentationStore';
import {emptyCourse} from '../../src/lib/course';
import '../../src/styles.css';
import '../../src/presentations.css';
const course=emptyCourse('Synthetic presentation sources');course.id='presentation-fixture';course.revision=1;
course.lessons=[{id:'intro',module:'m',title:'Reading slide',body:'Read this accessible instructional text.'}];
course.banks=[{id:'b',title:'Questions',questions:[{id:'q',stem:'Choose the first option.',choices:['First','Second'],answer:[0]}]} as any];
let saved:string|null=null;
const presentationLibrary=createPresentationStore({read:async()=>saved,update:async fn=>saved=await fn(saved),authorize:async()=> 'test-adult'});
const api:any={allCourses:[course],presentationLibrary,toast:(text:string)=>{document.getElementById('toast')!.textContent=text;}};
createRoot(document.getElementById('root')!).render(<><div id="toast" role="status"/><Presentations api={api}/></>);
