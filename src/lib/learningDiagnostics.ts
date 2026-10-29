/** Educational evidence summaries, not clinical diagnoses or automatic grades. */
import type { Course, Progress } from './types';
import { FOUNDATION_COMPETENCIES, type AuthoredCompetency } from './competencyCatalog';
import { resolveCompetencyEvidence } from './competencyEvidence';
import { captureCompetencyEvidence, syncCompetencyLedger, competencyLedgerStates, parseCompetencyLedger, type CompetencySource } from './competencyState';
export interface DiagnosticSource extends CompetencySource { n:number; mastery:number|null; confidence:number; at?:string; latestAttemptAt?:string }
export interface ErrorPattern { courseId:string; bankId:string; questionId:string; questionTitle:string; incorrect:number; answered:number; reason:string }
export interface SkillDiagnostic {
  skillId:string; title:string; mastery:number|null; confidence:number; answers:number;
  status:'unknown'|'insufficient'|'needs-review'|'established'; reason:string; blockedBy:string[];
  sources:DiagnosticSource[]; patterns:ErrorPattern[]; measuredAt:string;
}
export interface LearningDiagnostics { skills:SkillDiagnostic[] }
/** Captures the same exact-source ledger as learning paths without mutating learner data. */
export async function diagnoseLearning(courses:Course[],progress:Progress,at=new Date().toISOString(),authored:AuthoredCompetency[]=FOUNDATION_COMPETENCIES):Promise<LearningDiagnostics> {
  const graph=resolveCompetencyEvidence(authored,courses,{allowMissingCourses:true});
  const fresh=syncCompetencyLedger(progress,await captureCompetencyEvidence(graph,courses,progress,at));
  const ledger=parseCompetencyLedger(fresh.competencies), snapshots=new Map(ledger.snapshots.map(s=>[s.id,s]));
  const installed=new Set(courses.map(c=>c.id));
  const visible=new Set(authored.filter(s=>Object.keys(s.lessons).some(id=>installed.has(id))).map(s=>s.id));
  for(const source of ledger.sources)visible.add(source.skillId);
  return {skills:competencyLedgerStates(graph,fresh).filter(s=>visible.has(s.id)).map(state=>{
    const sources=ledger.sources.filter(s=>s.skillId===state.id).map(s=>{
      const snapshot=s.snapshotId?snapshots.get(s.snapshotId):undefined;
      const latestAttemptAt=progress.attempts.filter(a=>a.bankId===s.bankId&&a.kind!=='pretest'&&s.since&&Number.isFinite(Date.parse(a.finishedAt))&&Date.parse(a.finishedAt)>Date.parse(s.since)&&a.answers.filter(answer=>answer.qid===s.questionId&&answer.chosen.length>0).length===1).map(a=>a.finishedAt).sort((a,b)=>Date.parse(b)-Date.parse(a))[0];
      return {...s,...(latestAttemptAt?{latestAttemptAt}:{}),n:snapshot?.n??0,mastery:snapshot?.mastery??null,confidence:snapshot?.confidence??0,...(snapshot?{at:snapshot.at}:{})};
    });
    const patterns:ErrorPattern[]=[];
    for(const source of sources){
      // A timestamp without a matched current fingerprint is not source provenance.
      const current= courses.find(c=>c.id===source.courseId)?.banks.find(b=>b.id===source.bankId)?.questions.find(q=>q.id===source.questionId);
      if(!current || !source.since || !source.snapshotId)continue;
      const seen=new Set<string>();let answered=0,incorrect=0;
      for(const attempt of [...progress.attempts].sort((a,b)=>b.finishedAt.localeCompare(a.finishedAt))){
        if(seen.has(attempt.id)||attempt.bankId!==source.bankId||attempt.kind==='pretest'||Date.parse(attempt.finishedAt)<=Date.parse(source.since)||!Number.isFinite(Date.parse(attempt.finishedAt)))continue;
        seen.add(attempt.id);
        const answers=attempt.answers.filter(a=>a.qid===source.questionId);
        if(answers.length!==1||!answers[0].chosen.length)continue;
        answered++;if(!answers[0].correct)incorrect++;
        if(answered===30)break;
      }
      if(incorrect>=2)patterns.push({courseId:source.courseId,bankId:source.bankId,questionId:source.questionId,questionTitle:current.stem.slice(0,500),incorrect,answered,reason:'Repeated incorrect responses on this exact linked question. Review the responses with the learner; this does not establish why the error occurred.'});
    }
    const status:SkillDiagnostic['status']=state.mastery===null?'unknown':state.confidence<.65?'insufficient':state.assessedMastered?'established':'needs-review';
    let reason=status==='unknown'?'No current linked assessment evidence. Assess before drawing conclusions.':status==='insufficient'?'Limited assessment evidence; a confident skill-gap conclusion is not yet supported.':status==='established'?'Current linked assessment evidence meets the existing learning-path threshold.':'Current linked assessment evidence is below the learning-path threshold; an adult should review targeted support.';
    if(sources.some(source=>!installed.has(source.courseId)))reason+=' Some evidence is retained from an uninstalled course; it is historical and its source must be reinstalled and verified before practice.';
    return {skillId:state.id,title:state.title,mastery:state.mastery,confidence:state.confidence,answers:state.attempts,status,reason,blockedBy:[...state.blockedBy],sources,patterns,measuredAt:at};
  })};
}
export interface DiagnosticLearner {studentId:string;studentName:string;diagnostics:LearningDiagnostics}
export interface DiagnosticGroup {skillId:string;title:string;status:SkillDiagnostic['status'];studentIds:string[];reason:string}
/** Suggestions only; caller explicitly chooses the roster and approves any assignment. */
export function groupDiagnostics(learners:DiagnosticLearner[]):DiagnosticGroup[]{
  if(new Set(learners.map(l=>l.studentId)).size!==learners.length)throw Error('Duplicate diagnostic learner.');
  const groups=new Map<string,DiagnosticGroup>();
  for(const learner of learners)for(const skill of learner.diagnostics.skills){
    if(skill.status==='established')continue;
    const key=skill.skillId+'|'+skill.status;
    const group=groups.get(key)??{skillId:skill.skillId,title:skill.title,status:skill.status,studentIds:[],reason:skill.status==='needs-review'?'Suggested reteaching group; review evidence and differentiate support before assigning.':'Suggested assessment/check-in group; insufficient evidence is not a demonstrated misconception.'};
    group.studentIds.push(learner.studentId);groups.set(key,group);
  }
  return [...groups.values()].sort((a,b)=>a.skillId.localeCompare(b.skillId)||a.status.localeCompare(b.status));
}
