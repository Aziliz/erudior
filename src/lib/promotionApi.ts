import { API, type Me } from './community';
import type { PromotionCandidate } from './promotionCandidate';
import type { PromotionReviewInput, PromotionReviewRecord, PromotionHandoff } from './promotionReview';

export interface PromotionSourceSummary { communityId:string; title:string; publishedVersion:number }
export interface PromotionSource extends PromotionSourceSummary { ownerId:string; reviewedAt:string; publishedAt:string; packageSha256:string }
export interface PromotionPreview { source:PromotionSource; candidate:PromotionCandidate; digest:string }
export type PromotionState = 'prepared'|'reviewed'|'rejected'|'revoked';
export interface PromotionSummary { id:string; title:string; revision:number; state:PromotionState; updatedAt:string }
export interface PromotionEnvelope extends PromotionPreview, PromotionSummary { review:PromotionReviewRecord|null; history:PromotionReviewRecord[]; problems:string[]; canExport:boolean; createdAt:string }
export class PromotionApiError extends Error { constructor(message:string, public status:number) { super(message); this.name='PromotionApiError'; } }
/** Cookies authorize the request. The session fingerprint is a nonauthorizing comparison value only.
 * Private responses and handoffs are never placed in browser storage or an HTTP cache. */
export async function promotionRequest<T>(path:string, options:{method?:string;body?:unknown;signal?:AbortSignal}={}):Promise<T> {
  let response:Response;
  try { response=await fetch(API+path,{method:options.method??'GET',credentials:'include',cache:'no-store',signal:options.signal,headers:options.body===undefined?{}:{'Content-Type':'application/json'},body:options.body===undefined?undefined:JSON.stringify(options.body)}); }
  catch(error) { if((error as Error).name==='AbortError')throw error;throw new PromotionApiError('Connection lost. The operation may have completed. Retry the pending request to reconcile its exact outcome.',0); }
  let data:unknown;try { data=await response.json(); }catch { data=null; }
  if(!response.ok)throw new PromotionApiError(data&&typeof data==='object'&&'error'in data&&typeof data.error==='string'?data.error:`Promotion request failed (${response.status}).`,response.status);
  if(!data||typeof data!=='object')throw new PromotionApiError('The server response was incomplete. Retry the same pending request.',0);
  return data as T;
}
const root='/admin/promotions';
export const promotionApi={
  me:(signal?:AbortSignal)=>promotionRequest<Me>('/me',{signal}),
  session:(signal?:AbortSignal)=>promotionRequest<{userId:string;sessionKey:string}>(`${root}/session`,{signal}),
  logout:(signal?:AbortSignal)=>promotionRequest<unknown>('/auth/logout',{method:'POST',signal}),
  sources:(cursor='',signal?:AbortSignal)=>promotionRequest<{sources:PromotionSourceSummary[];nextCursor:string|null}>(`${root}/sources${cursor?'?cursor='+encodeURIComponent(cursor):''}`,{signal}),
  source:(id:string,version:number,signal?:AbortSignal)=>promotionRequest<PromotionPreview>(`${root}/sources/${encodeURIComponent(id)}?version=${version}`,{signal}),
  list:(cursor='',signal?:AbortSignal)=>promotionRequest<{candidates:PromotionSummary[];nextCursor:string|null}>(`${root}/candidates${cursor?'?cursor='+encodeURIComponent(cursor):''}`,{signal}),
  read:(id:string,signal?:AbortSignal)=>promotionRequest<PromotionEnvelope>(`${root}/candidates/${encodeURIComponent(id)}`,{signal}),
  prepare:(requestId:string,preview:PromotionPreview,signal?:AbortSignal)=>promotionRequest<PromotionEnvelope>(`${root}/candidates`,{method:'POST',body:{requestId,communityId:preview.source.communityId,publishedVersion:preview.source.publishedVersion,sourceDigest:preview.source.packageSha256,digest:preview.digest},signal}),
  decide:(requestId:string,envelope:PromotionEnvelope,review:PromotionReviewInput,signal?:AbortSignal)=>promotionRequest<PromotionEnvelope>(`${root}/candidates/${encodeURIComponent(envelope.id)}/${review.decision==='approved-for-handoff'?'review':review.decision==='rejected'?'reject':'revoke'}`,{method:'POST',body:{requestId,expectedRevision:envelope.revision,digest:envelope.digest,review},signal}),
  export:(id:string,signal?:AbortSignal)=>promotionRequest<PromotionHandoff>(`${root}/candidates/${encodeURIComponent(id)}/export`,{signal}),
};
export type PromotionClient=typeof promotionApi;
