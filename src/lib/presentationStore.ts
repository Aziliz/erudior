import { bindLocalSessionAuthority } from './localSession';
import { parsePresentation, parsePresentationLibrary, type PresentationDeck, type PresentationLibrary } from './presentations';

/** The app supplies serialized storage and a live, adult-only authority check. */
export interface PresentationStoreIO {
  read(): Promise<string|null>;
  update(change:(old:string|null)=>Promise<string>): Promise<string>;
  /** Stable identity of the current unlocked adult; throw when locked or navigation changed. */
  authorize(): Promise<string>;
}
export function createPresentationStore(io:PresentationStoreIO) {
  io = bindLocalSessionAuthority(io);
  const authority=async()=>{const actor=await io.authorize();if(!actor)throw Error('Unlock the adult area first.');return actor;};
  const recheck=async(actor:string)=>{if(await authority()!==actor)throw Error('Adult access changed. Reopen the presentation library.');};
  return {
    async load():Promise<PresentationLibrary> {const actor=await authority();const text=await io.read();await recheck(actor);return parsePresentationLibrary(text);},
    async save(input:PresentationDeck,expectedRevision:number|null):Promise<PresentationDeck> {
      const candidate=parsePresentation(input),actor=await authority();
      const text=await io.update(async old=>{
        await recheck(actor);
        const library=parsePresentationLibrary(old), existing=library.decks.find(d=>d.id===candidate.id);
        if(existing ? existing.revision!==expectedRevision : expectedRevision!==null) throw Error('Presentation changed elsewhere. Reload before saving; your draft has not been discarded.');
        const revision=(existing?.revision??0)+1;
        const deck=parsePresentation({...candidate,revision});
        const next={...library,decks:existing?library.decks.map(d=>d.id===deck.id?deck:d):[...library.decks,deck]};
        const result=JSON.stringify(parsePresentationLibrary(next));
        await recheck(actor);
        return result;
      });
      return parsePresentationLibrary(text).decks.find(d=>d.id===candidate.id)!;
    },
    async remove(id:string,expectedRevision:number):Promise<void> {
      const actor=await authority();
      await io.update(async old=>{
        await recheck(actor);const library=parsePresentationLibrary(old),existing=library.decks.find(d=>d.id===id);
        if(!existing || existing.revision!==expectedRevision)throw Error('Presentation changed elsewhere. Reload before deleting.');
        const result=JSON.stringify({...library,decks:library.decks.filter(d=>d.id!==id)});await recheck(actor);return result;
      });
    },
  };
}
