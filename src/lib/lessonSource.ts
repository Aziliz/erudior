import { markdownImageAssets } from "./markdownAssets";
import { widgetMarkdownFields } from "./widgetMarkdown";
/** Canonical interactive lesson syntax: validation only, no normalization or execution. */
import { INTERACTIVE_LESSON_KINDS, scanLessonFences } from "./lessonFences";
import { parseSounds, parseBlend, parseTrace } from "./phonicsSpec";
import { parseTimeline, parseSpan } from "./timelineSpec";
import { parseSim } from "./sims";
import { parseManipBlock, readSpec, targetProblems } from "./manip";
import { parseCodeBlock } from "./code";
import { parseExample } from "./exampleSpec";
import { parseAssignBlock } from "./courseWork";
import { mermaidA11y } from "./diagram";
import { parseMedia } from "./dialogueContent";
import { validateImageAsset } from "./imageAssets";
import { validateEmbeddedAudio } from "./courseAudio";
import { INTERACTIVE_LIMITS, boundedInteractiveJSON, plainInteractiveObject, validateFigureSpec, validateCodeQuestionSpec, validateMapSource } from "./interactiveContent";
export { validateFigureSpec, validateCodeQuestionSpec, validateMapSource } from "./interactiveContent";
export interface LessonSourceContext {
 strict?: boolean;
 course?: { writing?: readonly { id: string }[]; labs?: readonly { id: string }[]; activityLog?: unknown; audio?: unknown };
 mode?: "source" | "publication";
 /** Trusted caller configuration, never a course-authored authority field. */
 communityImageOrigin?: string;
}
const plain=plainInteractiveObject;
function soundProblems(sound:string,context:LessonSourceContext):string[]{
 if(sound.startsWith("data:"))return validateEmbeddedAudio(sound,"phonics sound",{mode:context.mode});
 if(/^(?:https?|file|javascript|vbscript|blob):|^\/\//i.test(sound)||/[\u0000-\u001f]/.test(sound))return ["Phonics sound must be an embedded audio value or course library key"];
 return [];
}
export function validateLessonSource(raw:unknown,context:LessonSourceContext={}):string[]{
 if(typeof raw!=="string")return ["Lesson body must be text"];
 if(raw.length>INTERACTIVE_LIMITS.sourceBytes||new TextEncoder().encode(raw).length>INTERACTIVE_LIMITS.sourceBytes)return ["Lesson body exceeds byte limit"];
 const fences=scanLessonFences(raw);if(fences.length>INTERACTIVE_LIMITS.blocks)return ["Lesson has too many fenced blocks"];
 const errors:string[]=validateMarkdownAssets(raw,{mode:context.mode,communityImageOrigin:context.communityImageOrigin});
 const markerPattern=new RegExp("```("+INTERACTIVE_LESSON_KINDS.join("|")+")\\b[^\\n]*\\r?\\n","g");
 for(const marker of raw.matchAll(markerPattern)){
  const index=marker.index!, enclosing=fences.find(fence=>index>=fence.start&&index<fence.end);
  if(!enclosing||!enclosing.interactive||enclosing.kind==="code")continue;
  if(index!==enclosing.start)errors.push("Interactive markers must be top-level fences, not nested inside another active block");
 }

 for(const [index,fence]of fences.entries()){
  if(!fence.interactive)continue;
  const {kind,info,body}=fence, at=`${kind} block ${index+1}`;
  if(!fence.closed||fence.closeMarker!=="```"){errors.push(`${at}: must close with an unindented three-backtick fence`);continue;}
  if(new TextEncoder().encode(body).length>INTERACTIVE_LIMITS.blockBytes){errors.push(`${at}: block exceeds byte limit`);continue;}
  const problems:string[]=[];
  try{
   if(kind==="sounds"){const parsed=parseSounds(info,body);problems.push(...parsed.problems);for(const tile of parsed.tiles)problems.push(...soundProblems(tile.sound,context));if(parsed.tiles.length>200)problems.push("too many sound tiles");}
   else if(kind==="blend"){const parsed=parseBlend(info,body);problems.push(...parsed.problems);for(const word of parsed.words)for(const unit of word.units)problems.push(...soundProblems(unit.sound,context));if(parsed.words.length>200)problems.push("too many blend words");}
   else if(kind==="trace"){if(info && !/^tolerance=(?:loose|normal|tight)$/.test(info))problems.push("trace tolerance must be loose, normal or tight");const parsed=parseTrace(info,body);problems.push(...parsed.problems);if(parsed.letters.length>200)problems.push("too many tracing letters");}
   else if(kind==="map"){if(info)problems.push("map takes no options");problems.push(...validateMapSource(body));}
   else if(kind==="timeline"){if(info)problems.push("timeline takes no options");const parsed=parseTimeline(body);problems.push(...parsed.problems);if(parsed.events.length+parsed.eras.length>500)problems.push("too many timeline entries");}
   else if(kind==="sim"){problems.push(...parseSim(info,body).problems);const fields=body.split(/\r?\n/).filter(line=>/^\w+\s*:/.test(line)).map(line=>line.slice(0,line.indexOf(":")).toLowerCase());if(new Set(fields).size!==fields.length)problems.push("duplicate simulation field");}
   else if(kind==="mermaid"){
    if(info)problems.push("mermaid takes no fence options");
    const content=body.split(/\r?\n/).filter(line=>!/^\s*%%(?!\s*\{)/.test(line)).join("\n").trim();
    const header=/^(?:graph|flowchart(?:-elk)?|swimlane-beta|erDiagram|gitGraph|gantt|info|pie|quadrantChart|xychart(?:-beta)?|requirement(?:Diagram)?|sequenceDiagram|classDiagram(?:-v2)?|stateDiagram(?:-v2)?|journey|timeline|mindmap|kanban|sankey(?:-beta)?|packet(?:-beta)?|radar-beta|block(?:-beta)?|treeView-beta|architecture(?:-beta)?|eventmodeling|ishikawa(?:-beta)?|venn-beta|treemap(?:-beta)?|wardley-beta|cynefin-beta|railroad(?:-ebnf|-abnf|-peg)?-beta|C4Context|C4Container|C4Component|C4Dynamic|C4Deployment)(?:\s|:|$)/i;
    if(!header.test(content))problems.push("unsupported or missing Mermaid diagram header");
    if(content.split("\n").length>1000)problems.push("too many Mermaid diagram lines");
    // Accessibility descriptions are plain text, not executable Mermaid directives.
    const executable=content.replace(/^\s*accDescr\s*\{[^}]*\}/gm, "").replace(/^\s*acc(?:Title|Descr)\s*:[^\n]*$/gm, "");
    if(/%%\s*\{|^---|^\s*(?:click|link|links)\s|(?:javascript|vbscript|file)\s*:|data:\s*(?:[a-z][a-z0-9.+-]*\/[a-z0-9.+-]+)?[;,]|<\s*(?:script|iframe|object|foreignObject)|<[^>\n]*\son[a-z]+\s*=|url\s*\(/im.test(executable))problems.push("Mermaid configuration, executable links or external resources are not supported");
    const a11y=mermaidA11y(body);if(a11y.title.length>1000||a11y.description.length>10000)problems.push("Mermaid accessible description exceeds limit");
   }
   else if(kind==="code")problems.push(...parseCodeBlock(info,body).problems);
   else if(kind==="example"){const example=parseExample(info,body);problems.push(...example.problems);if(example.steps.length>100)problems.push("too many example steps");}
   else if(["figure","plot","shape","numberline"].includes(kind)){
    if(info)problems.push("figure takes JSON in its body, not fence options");
    const value=JSON.parse(body);if(!plain(value))problems.push("figure must be an object");else problems.push(...validateFigureSpec({...(value.type===undefined?{type:kind==="figure"?"plot":kind}:{}),...value}));
   }else if(kind==="manipulative"){
    if(body.trim().startsWith("{")){const value=JSON.parse(body);problems.push(...boundedInteractiveJSON(value));if(!plain(value))problems.push("manipulative must be an object");if(plain(value)&&value.caption!==undefined&&typeof value.caption!=="string")problems.push("manipulative.caption must be text");if(plain(value)&&value.kind!==undefined&&info.trim()&&value.kind!==info.trim())problems.push("conflicting manipulative kind");}
    if(!problems.length)problems.push(...parseManipBlock(info,body).problems);
   }else if(kind==="assignment"){
    if(info)problems.push("assignment takes no fence options");const result=parseAssignBlock(body);problems.push(...result.problems);
    if(context.course)for(const link of result.links){if(link.kind==="log"?!context.course.activityLog:!(link.kind==="writing"?context.course.writing:context.course.labs)?.some(item=>item.id===link.id))problems.push(`unknown ${link.kind} resource${link.kind==="log"?"":` ${link.id}`}`);}
   }else if(kind==="dialogue"||kind==="speak")problems.push(...parseMedia(kind,info,body,{mode:context.mode}).problems);
  }catch(error){problems.push((error as Error).message);}
  errors.push(...problems.slice(0,50).map(problem=>`${at}: ${problem}`));if(errors.length>=200)return errors.slice(0,200);
 }
 return errors;
}
/** Deeper semantics after the canonical payload validates common fields and per-kind allowlists. */
export function validateInteractiveQuestion(raw:unknown,_context:LessonSourceContext={}):string[]{
 const bounds=boundedInteractiveJSON(raw);if(bounds.length)return bounds;if(!plain(raw))return ["Question must be an object"];
 const errors:string[]=[];const type=raw.type??"choice";
 const list=(value:unknown,name:string,min=0):string[]=>{if(!Array.isArray(value)||value.length<min||value.length>500||value.some(v=>typeof v!=="string"||!v.trim()||v.length>50000)){errors.push(`${name}: expected bounded nonempty text entries`);return [];}return value as string[];};
 const answers=(expected:number,choices:string[])=>{if(!Array.isArray(raw.answer)||raw.answer.length!==expected||raw.answer.some(v=>!Number.isInteger(v)||(v as number)<0||(v as number)>=choices.length))errors.push("answer: needs valid choice indices matching targets");};
 try {
 if(type==="map"){
  if(typeof raw.map!=="string"||!raw.map.trim())errors.push("map: source required");else errors.push(...validateMapSource(raw.map));
  const targets=raw.targets===undefined?[]:list(raw.targets,"targets",1),marks=raw.marks===undefined?[]:list(raw.marks,"marks",2);
  if(targets.length&&marks.length)errors.push("map cannot use both targets and marks");if(!targets.length&&!marks.length)errors.push("map needs targets or marks");
  if(targets.length){if(Array.isArray(raw.answer)&&raw.answer.length||Array.isArray(raw.choices)&&raw.choices.length)errors.push("map find must not carry choice answers");}
  else{const choices=list(raw.choices,"choices",2);answers(marks.length,choices);if(new Set(choices).size!==choices.length)errors.push("map choices must be unique");}
 }else if(type==="timeline"){
  const slots=list(raw.slots,"slots",2),choices=list(raw.choices,"choices",2);for(const slot of slots)if(!parseSpan(slot))errors.push(`Invalid timeline date: ${slot}`);answers(slots.length,choices);
  if(raw.timeline!==undefined){if(typeof raw.timeline!=="string")errors.push("timeline must be text");else errors.push(...parseTimeline(raw.timeline).problems.filter(p=>!p.startsWith("no event")));}
 }else if(type==="code")errors.push(...validateCodeQuestionSpec(raw.code));
 else if(type==="model"){
  if(!plain(raw.model))errors.push("model must be an object");else{
   if(typeof raw.model.kind!=="string")return ["model.kind: expected supported kind string"];
   if(raw.model.caption!==undefined&&typeof raw.model.caption!=="string")errors.push("model.caption: expected text");
   const parsed=readSpec(raw.model);errors.push(...parsed.problems);
   if(!plain(raw.target))errors.push("target must be an object");else if(Object.values(raw.target).some(v=>typeof v==="number"&&(!Number.isFinite(v)||Math.abs(v)>10000)))errors.push("model target is outside bounded solving limits");else if(!errors.length)errors.push(...targetProblems(parsed.model,raw.target));
  }
 }else if(type==="order"&&raw.dates!==undefined){const dates=list(raw.dates,"dates");if(!Array.isArray(raw.choices)||dates.length!==raw.choices.length)errors.push("dates must match choices");for(const date of dates)if(!parseSpan(date))errors.push(`Invalid order date: ${date}`);}
 } catch(error) { errors.push(`Malformed interactive question: ${(error as Error).message}`); }
 return errors;
}

/** Publication assets must be embedded. Navigation links are not fetched as assets. */
export function validateMarkdownAssets(raw:unknown,options:{mode?:"source"|"publication";communityImageOrigin?:string}={}):string[]{
 if(typeof raw!=="string")return ["Markdown must be text"];
 if(raw.length>INTERACTIVE_LIMITS.sourceBytes)return ["Markdown exceeds source limit"];
 let source=raw;
 for(const fence of scanLessonFences(raw).reverse())if(!fence.interactive||!["example","dialogue","speak"].includes(fence.kind))source=source.slice(0,fence.start)+"\n".repeat(raw.slice(fence.start,fence.end).split("\n").length-1)+source.slice(fence.end);
 // Inline code is inert too; multiline delimiters are already handled above.
 source=source.replace(/(`+)[^\n]*?\1/g,"");
 const errors:string[]=[];
 const decode=(value:string)=>value.replace(/&#(x[0-9a-f]+|\d+);?/gi,(_,digits:string)=>String.fromCharCode(parseInt(digits[0].toLowerCase()==="x"?digits.slice(1):digits,digits[0].toLowerCase()==="x"?16:10))).replace(/&colon;/gi,":").replace(/&tab;|&newline;/gi,"");
 const parsed=markdownImageAssets(raw);errors.push(...parsed.errors);
 for(const fence of scanLessonFences(raw))if(fence.interactive)for(const field of widgetMarkdownFields(fence.kind,fence.info,fence.body))errors.push(...validateMarkdownAssets(field.source,options));
 for(const asset of parsed.assets)errors.push(...validateImageAsset(asset.src,{mode:options.mode,maxBytes:INTERACTIVE_LIMITS.sourceBytes,communityImageOrigin:options.communityImageOrigin}));
 if(/<\s*(?:script|iframe|object|embed|audio|video|source|svg|style|link|meta|base)\b/i.test(source)||/<[^>]+\bon[a-z]+\s*=/i.test(source))errors.push("Unsupported executable or external HTML content");
 if(/(?:href\s*=\s*["']?|(?<!!)\[[^\]\n]*\]\(\s*)\s*(?:javascript|vbscript|file|data):/i.test(decode(source)))errors.push("Unsafe navigation target");
 return [...new Set(errors)];
}
