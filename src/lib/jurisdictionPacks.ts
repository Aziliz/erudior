/** Versioned jurisdiction data, separate from generic learning engine logic. */
export interface JurisdictionPack {
  id: string;
  name: string;
  authority: string;
  version: string;
  effectiveFrom: string;
  effectiveThrough?: string;
  reviewedAt: string;
  sources: string[];
  programs: Record<string, {
    subjectHours: Record<string, number>;
    totalHours: number;
    minimumAssessmentPercent?: number;
    forms?: string[];
  }>;
}
export function validateJurisdictionPack(pack: JurisdictionPack): string[] {
  const errors: string[] = [];
  if (!/^[a-z]{2}(?:-[a-z0-9]+)*$/.test(pack.id)) errors.push("Invalid jurisdiction ID");
  if (!pack.name.trim() || !pack.authority.trim() || !pack.version.trim()) errors.push("Missing jurisdiction metadata");
  const validDate=(v:string)=>/^\\d{4}-\\d{2}-\\d{2}$/.test(v) && Number.isFinite(Date.parse(v));
  if (!validDate(pack.effectiveFrom) || !validDate(pack.reviewedAt) ||
      (pack.effectiveThrough && (!validDate(pack.effectiveThrough) || pack.effectiveThrough < pack.effectiveFrom)))
    errors.push("Invalid effective or review dates");
  if (!pack.sources.length || pack.sources.some(url=>!/^https:\/\//.test(url))) errors.push("Official source URLs must be HTTPS");
  if (!Object.keys(pack.programs).length) errors.push("No programs defined");
  for (const [id, program] of Object.entries(pack.programs)) {
    const hours=Object.values(program.subjectHours);
    if (!id.trim() || !hours.length || hours.some(h=>!Number.isFinite(h)||h<0) ||
        !Number.isFinite(program.totalHours) || program.totalHours<0 ||
        Math.abs(hours.reduce((a,h)=>a+h,0)-program.totalHours)>1e-8)
      errors.push(`Invalid subject hour totals for ${id}`);
    if (program.minimumAssessmentPercent !== undefined &&
        (!Number.isFinite(program.minimumAssessmentPercent) || program.minimumAssessmentPercent<0 || program.minimumAssessmentPercent>100))
      errors.push(`Invalid assessment threshold for ${id}`);
  }
  return errors;
}
export function resolveProgram(pack: JurisdictionPack | undefined, programId: string, onDate: string) {
  if (!pack) return {status:"unavailable" as const, reason:"Jurisdiction pack unavailable"};
  const issues=validateJurisdictionPack(pack);
  if (issues.length) return {status:"unavailable" as const, reason:issues.join("; ")};
  if (onDate < pack.effectiveFrom || (pack.effectiveThrough && onDate > pack.effectiveThrough))
    return {status:"unavailable" as const,reason:"Jurisdiction rules are not effective on this date"};
  const program=pack.programs[programId];
  return program ? {status:"available" as const,packId:pack.id,version:pack.version,program} :
    {status:"unavailable" as const,reason:"Program requirements not defined for jurisdiction"};
}
