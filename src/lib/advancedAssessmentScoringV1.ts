/** Frozen V1 educational response matching. Never import changing legacy grading semantics. */
import type { AdvancedAssessmentAssignment, AdvancedAssessmentState, AdvancedAssessmentExpected } from './advancedAssessment';
export interface AdvancedAssessmentComputedFeedback {
    scoringVersion: 1;
    steps: {
        questionId: string;
        stepId: string;
        status: 'unanswered' | 'matched' | 'not_matched' | 'human_review';
        misconceptionIds: string[];
    }[];
    oral: {
        questionId: string;
        status: 'unanswered' | 'human_review';
        audioPresent: boolean;
    }[];
    complete: boolean;
}
export function normalizeAdvancedAssessmentTextV1(text: string): string { return text.normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase(); }
export function matchAdvancedAssessmentV1(answer: string, expected: AdvancedAssessmentExpected): boolean {
    if (expected.kind === 'text')
        return expected.accepted.some(a => normalizeAdvancedAssessmentTextV1(a) === normalizeAdvancedAssessmentTextV1(answer));
    const value = answer.trim();
    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value))
        return false;
    const n = Number(value);
    return Number.isFinite(n) && Math.abs(n - expected.value) <= expected.tolerance;
}
export function scoreAdvancedAssessmentV1(a: AdvancedAssessmentAssignment, s: AdvancedAssessmentState): AdvancedAssessmentComputedFeedback {
    const out: AdvancedAssessmentComputedFeedback = { scoringVersion: 1, steps: [], oral: [], complete: s.complete };
    for (const q of a.pack.variants.find(v => v.id === a.variantId)!.questions) {
        if (q.kind === 'oral') {
            const r = s.responses.find(r => r.kind === 'oral' && r.questionId === q.id);
            out.oral.push({ questionId: q.id, status: r ? 'human_review' : 'unanswered', audioPresent: !!(r && r.kind === 'oral' && r.audio) });
            continue;
        }
        for (const step of q.steps) {
            const r = s.responses.find(r => r.kind === 'math' && r.questionId === q.id && r.stepId === step.id);
            const answer = r?.kind === 'math' ? r.answer : undefined;
            out.steps.push({ questionId: q.id, stepId: step.id, status: answer === undefined ? 'unanswered' : !step.expected ? 'human_review' : matchAdvancedAssessmentV1(answer, step.expected) ? 'matched' : 'not_matched', misconceptionIds: answer === undefined ? [] : step.misconceptions.filter(m => m.accepted.some(x => normalizeAdvancedAssessmentTextV1(x) === normalizeAdvancedAssessmentTextV1(answer))).map(m => m.misconceptionId) });
        }
    }
    return out;
}
