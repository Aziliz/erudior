/** Adult-only persistence boundary. App supplies a live unlock/selected-profile authority check. */
import type { Course, Progress } from './types';
import type { Competency } from './competencies';
import { applyCompetencyDecision, captureCompetencyEvidence, parseCompetencyLedger, syncCompetencyLedger, type CompetencyDecisionAction } from './competencyState';
export interface CompetencyDecisionInput { id: string; skillId: string; action: CompetencyDecisionAction; reason: string }
export interface CompetencyStoreIO {
  readProgress(studentId: string): Promise<Progress>;
  updateProgress(studentId: string, change: (current: Progress) => Progress | Promise<Progress>): Promise<Progress>;
  authorize(studentId: string): Promise<{actorId:string;actorName:string}>;
  studentExists(studentId: string): Promise<boolean>;
  now(): string;
}
const validStudent = (id:string) => /^[a-z0-9]{1,24}$/.test(id);
export function createCompetencyStore(io: CompetencyStoreIO) {
  const check = async (studentId:string) => {
    if (!validStudent(studentId) || !await io.studentExists(studentId)) throw Error('This learner profile no longer exists.');
    return io.authorize(studentId);
  };
  return {
    async load(studentId:string): Promise<Progress> {
      await check(studentId); const progress = await io.readProgress(studentId); await check(studentId);
      parseCompetencyLedger(progress.competencies); return progress;
    },
    async decide(studentId:string,input:CompetencyDecisionInput): Promise<Progress> {
      const actor = await check(studentId), at=io.now();
      return io.updateProgress(studentId,async current=>{
        const currentActor=await check(studentId);
        if(currentActor.actorId!==actor.actorId)throw Error('Supervising adult changed; retry the decision.');
        const existing=parseCompetencyLedger(current.competencies).decisions.find(d=>d.id===input.id);
        if(existing){
          if(existing.skillId!==input.skillId||existing.action!==input.action||existing.reason!==input.reason||existing.actorId!==actor.actorId||existing.actorName!==actor.actorName)throw Error('Competency decision ID conflicts with history.');
          return current;
        }
        return applyCompetencyDecision(current,{...input,...actor,at});
      });
    },
    async sync(studentId:string,graph:Competency[],courses:Course[]):Promise<Progress> {
      await check(studentId);
      return io.updateProgress(studentId,async current=>{await check(studentId); const capture=await captureCompetencyEvidence(graph,courses,current,io.now()); await check(studentId); return syncCompetencyLedger(current,capture);});
    },
  };
}
