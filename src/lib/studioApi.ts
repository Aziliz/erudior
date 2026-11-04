import { API, type Me } from './community';
import type { StudioApproval, StudioDocument, StudioInventory, StudioKind, studioLearnerView } from './adminStudio';
export interface StudioEnvelope { document: StudioDocument; approval: StudioApproval | null; problems: string[] }
export interface StudioSummary { id: string; title: string; kind: StudioKind; revision: number; approved: boolean; reviewRecorded?: boolean; updated: string }
export interface StudioSourceSummary { id: string; title: string; version: number; sourceType?: 'official'|'community' }
export type StudioDelivery = { view: ReturnType<typeof studioLearnerView> } | { document: StudioDocument };
export class StudioApiError extends Error { constructor(message: string, public status: number) { super(message); } }
/** Private responses are never stored in a browser cache. Server authorization is authoritative. */
export async function studioRequest<T>(path: string, options: { method?: string; body?: unknown; signal?: AbortSignal } = {}): Promise<T> {
  let response: Response;
  try { response = await fetch(API + path, { method: options.method ?? 'GET', credentials: 'include', cache: 'no-store', signal: options.signal, headers: options.body === undefined ? {} : {'Content-Type':'application/json'}, body: options.body === undefined ? undefined : JSON.stringify(options.body) }); }
  catch (error) { if ((error as Error).name === 'AbortError') throw error; throw new StudioApiError('Connection lost. The operation may have completed. Retry the same request to reconcile it.', 0); }
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new StudioApiError(data?.error ?? `Studio request failed (${response.status}).`, response.status);
  if (!data) throw new StudioApiError('The server response was incomplete. Retry the same request.', 0);
  return data as T;
}
const root = '/admin/studio';
export const studioApi = {
  session: (signal?:AbortSignal) => studioRequest<{userId:string;sessionKey:string}>(`${root}/session`,{signal}),
  logout: (signal?:AbortSignal) => studioRequest<unknown>('/auth/logout',{method:'POST',signal}),
  me: (signal?: AbortSignal) => studioRequest<Me>('/me', {signal}),
  sources: (cursor = '', signal?: AbortSignal) => studioRequest<{sources:StudioSourceSummary[];nextCursor:string|null;warning?:string|null;scope?:string}>(`${root}/sources${cursor ? '?cursor='+encodeURIComponent(cursor) : ''}`, {signal}),
  source: (id:string,signal?:AbortSignal) => studioRequest<{inventory:StudioInventory;exclusions:number}>(`${root}/sources/${encodeURIComponent(id)}`,{signal}),
  list: (cursor='',signal?:AbortSignal,archived=false) => studioRequest<{materials:StudioSummary[];nextCursor:string|null}>(`${root}/materials?archived=${archived?'1':'0'}${cursor?'&cursor='+encodeURIComponent(cursor):''}`,{signal}),
  read: (id:string,signal?:AbortSignal) => studioRequest<StudioEnvelope>(`${root}/materials/${encodeURIComponent(id)}`,{signal}),
  create: (requestId:string,document:StudioDocument,signal?:AbortSignal) => studioRequest<StudioEnvelope>(`${root}/materials`,{method:'POST',body:{requestId,document},signal}),
  save: (requestId:string,expectedRevision:number,document:StudioDocument,signal?:AbortSignal) => studioRequest<StudioEnvelope>(`${root}/materials/${encodeURIComponent(document.id)}`,{method:'PUT',body:{requestId,expectedRevision,document},signal}),
  approve: (requestId:string,document:StudioDocument,digest:string,signal?:AbortSignal) => studioRequest<StudioEnvelope>(`${root}/materials/${encodeURIComponent(document.id)}/approve`,{method:'POST',body:{requestId,expectedRevision:document.revision,digest},signal}),
  remove: (requestId:string,document:StudioDocument,signal?:AbortSignal) => studioRequest<{deleted:true;id:string;revision:number}>(`${root}/materials/${encodeURIComponent(document.id)}`,{method:'DELETE',body:{requestId,expectedRevision:document.revision},signal}),
  restore: (requestId:string,id:string,expectedRevision:number,signal?:AbortSignal) => studioRequest<StudioEnvelope>(`${root}/materials/${encodeURIComponent(id)}/restore`,{method:'POST',body:{requestId,expectedRevision},signal}),
  deliver: (id:string,audience:'learner'|'teacher',operation:'present'|'export',signal?:AbortSignal) => studioRequest<StudioDelivery>(`${root}/materials/${encodeURIComponent(id)}/${operation}?audience=${audience}`,{signal}),
};
export type StudioClient = typeof studioApi;
