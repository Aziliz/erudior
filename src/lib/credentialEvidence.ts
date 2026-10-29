import { instructionalReport, type InstructionalLibrary } from './instructionalEvidence';
import { credentialHash } from './credentialIntegrity';
/** Exports observations only. An independently authorized instructor must attest equivalence. */
export async function credentialInstructionalEvidence(library:InstructionalLibrary,assignmentId:string,revision?:number){const report=instructionalReport(library,assignmentId,revision);return {format:'erudior-credential-evidence' as const,version:1 as const,educationalOnly:true as const,authority:'local-educational-observations-only' as const,report,evidenceDigest:await credentialHash(report),methodDigest:await credentialHash({methodNote:report.assignment.pack.methodNote,requirements:report.assignment.pack.requirements,mappings:report.assignment.pack.mappings})};}

export const prepareCredentialEvidence=credentialInstructionalEvidence;
