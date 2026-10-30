/** Synthetic acceptance data only. These eight short examples are not curriculum,
 * official courses, learner records, or publishable catalog recommendations. */
import {emptyDoc, migrateCommunityDocToCanonical, type CommunityDoc, type CommunityMeta} from '../../src/lib/communityFormat';
import {exportCourseSnapshot,normalizeCourse} from '../../src/lib/course';
import {courseFromCanonicalAuthoring} from '../../src/lib/canonicalAuthoring';
import type {Course} from '../../src/lib/courseContentTypes';

export const K_DEMO_SUBJECTS = [
 {id:'math',subject:'Math',title:'Synthetic K Math',lessonTitle:'Count paper dots',questionStem:'How many dots are shown: ● ● ●?',answer:'Three',feature:'manipulative'},
 {id:'language-arts',subject:'English and language arts',title:'Synthetic K Language Arts',lessonTitle:'Read a short word',questionStem:'Which word names the animal in our test sentence?',answer:'Cat',feature:'reader-and-phonics'},
 {id:'science',subject:'Science',title:'Synthetic K Science',lessonTitle:'Observe paper shapes',questionStem:'What are we comparing in this paper-only example?',answer:'Shapes',feature:'lab'},
 {id:'social-studies',subject:'Social studies',title:'Synthetic K Social Studies',lessonTitle:'Take turns with cards',questionStem:'What does our pretend group do with the picture cards?',answer:'Take turns',feature:'writing'},
 {id:'art',subject:'Art',title:'Synthetic K Art',lessonTitle:'Describe a paper pattern',questionStem:'Which pattern repeats in the example?',answer:'Dot, line, dot, line',feature:'reader'},
 {id:'music',subject:'Music',title:'Synthetic K Music',lessonTitle:'Notice a test sound',questionStem:'Which mark represents the pretend beat in this example?',answer:'A dot',feature:'embedded-audio'},
 {id:'physical-education',subject:'Physical education',title:'Synthetic K Physical Education',lessonTitle:'Record a pretend movement',questionStem:'What does our fictional log record?',answer:'A pretend movement',feature:'activity-log'},
 {id:'health',subject:'Health',title:'Synthetic K Health',lessonTitle:'Describe a pretend routine',questionStem:'Which item is part of the fictional drawing routine?',answer:'A clean paper towel',feature:'writing'},
] as const;
export type KDemoId = typeof K_DEMO_SUBJECTS[number]['id'];
export type KDemoMode = 'legacy'|'canonical';
export const K_DEMO_NOTICE = 'Original synthetic acceptance example only. Not a complete kindergarten course, medical guidance, reviewed curriculum, or official publication.';
// A valid, silent PCM WAV (no voice or third-party media); no network or autoplay.
export const K_DEMO_AUDIO = 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQIAAAAAAA==';
export function demoCourseMeta(id: string, version=1): CommunityMeta {
 return {id,version,review:'not_reviewed',author:'Synthetic acceptance author'};
}
export function createKDemoDoc(id: KDemoId, mode: KDemoMode='legacy'): CommunityDoc {
 const subject=K_DEMO_SUBJECTS.find(s=>s.id===id);
 if(!subject)throw Error('Unknown synthetic subject');
 const doc=emptyDoc(subject.title);
 Object.assign(doc,{description:K_DEMO_NOTICE,subject:subject.subject,level:'Elementary School',type:'Course',calculator:'none'});
 const question={id:'notice',kind:'choice' as const,stem:subject.questionStem,choices:[subject.answer,'A different answer'],answer:[0],explanation:'The answer matches this original synthetic example.'};
 doc.modules=[{id:'explore',title:'Synthetic exploration',quiz:[{...question,id:'recall'}]}];
 doc.lessons=[{id:'observe',module:'explore',title:subject.lessonTitle,minutes:2,refs:['source'],blocks:[
  {type:'heading',text:'Synthetic example',level:2},
  {type:'text',md:`${K_DEMO_NOTICE}\n\nOur example answer is **${subject.answer}**.`},
  {type:'question',...question},
 ]}];
 doc.decks=[{id:'remember',title:'Synthetic reminder',cards:[{id:'card',front:subject.questionStem,back:subject.answer}]}];
 doc.glossary=[{term:'synthetic',definition:'An original example created to test the software.',aliases:['test example']}];
 doc.references=[{id:'source',title:'Example provenance',md:K_DEMO_NOTICE}];
 if(id==='math')doc.lessons[0].blocks.splice(2,0,{type:'manipulative',spec:{kind:'counters',count:3,frames:1,caption:'Three paper dots in a synthetic example.'}});
 if(['language-arts','art'].includes(id))doc.texts=[{id:'reading',title:'Synthetic reading',kind:'prose',lang:'en-US',author:'Synthetic acceptance author',source:K_DEMO_NOTICE,sections:[{id:'opening',title:'Example words',body:id==='language-arts'?'The cat sits by a paper mat.':'Dot, line, dot, line. This is our paper pattern.',questions:['observe-notice']}]}];
 if(['social-studies','health'].includes(id)){
  doc.rubrics=[{id:'response-rubric',title:'Synthetic response check',criteria:[{id:'example',name:'Names the example',levels:[{points:1,label:'Present'},{points:0,label:'Not yet'}]}]}];
  doc.writing=[{id:'response',title:'Describe the example',module:'explore',kind:'short',prompt:`Describe the fictional example: ${subject.answer}. An adult may transcribe a spoken response.`,rubric:'response-rubric',selfCheck:true}];
  doc.lessons[0].blocks.push({type:'assignment',kind:'writing',id:'response'});
 }
 if(id==='science'){
  doc.labs=[{id:'paper-shapes',title:'Compare paper shapes',module:'explore',intro:'A paper-only software demonstration.',adult:true,safety:['Use only printed paper shapes. An adult handles any cutting beforehand.'],materials:['Two pre-cut paper shapes'],steps:[{text:'Point to the different outlines.',adult:true}],tables:[{id:'observations',title:'Paper observations',columns:['Shape','Observation'],rows:2}],questions:[{id:'notice-shape',kind:'observation',prompt:'What did you notice about the outlines?'}]}];
  doc.lessons[0].blocks.push({type:'assignment',kind:'lab',id:'paper-shapes'});
 }
 if(id==='physical-education'){
  doc.activityLog={title:'Fictional activity log',types:['Pretend movement'],prompt:'Record a fictional example only. No real exercise is required by this software test.',uploads:false};
  doc.lessons[0].blocks.push({type:'assignment',kind:'log'});
 }
 if(mode==='legacy')return doc;
 const canonical=migrateCommunityDocToCanonical(doc,`synthetic-k-${id}`);
 canonical.canonical!.course.readAloud=true;
 canonical.canonical!.course.disclaimer=K_DEMO_NOTICE;
 if(id==='language-arts'){
  const q=canonical.canonical!.course.banks[0].questions[0];
  q.blend=['c','a','t'];q.listen='cat';
  canonical.canonical!.course.audio={cat:'say:cat'};
 }
 if(id==='music'){
  canonical.canonical!.course.audio={beat:K_DEMO_AUDIO};
  canonical.canonical!.course.banks[0].questions[0].audio={src:K_DEMO_AUDIO,text:'A dot represents the pretend beat.',lang:'en-US'};
 }
 return canonical;
}
/** Semantic snapshot used across install/reopen checks. Course/bank namespace and
 * publisher identity are asserted separately, never erased in actual installation. */
export function demoRuntimeManifest(course: Course): Record<string, unknown> {
 const value=JSON.parse(exportCourseSnapshot(course));
 const {id:_id,revision:_revision,community:_community,author:_author,updated:_updated,...semantic}=value;
 return semantic;
}

/** Import the authored semantics through the same canonical input used by official
 * packages. This comparator has no publisher provenance and grants no authority. */
export function demoSourceCourse(doc: CommunityDoc, id: KDemoId): Course {
 const payload=doc.canonical??migrateCommunityDocToCanonical(doc,`synthetic-k-${id}`).canonical!;
 return normalizeCourse(courseFromCanonicalAuthoring(payload));
}
