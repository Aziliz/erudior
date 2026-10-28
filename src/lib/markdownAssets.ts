/** The renderer's Markdown grammar, with source spans: only actual images are assets.
 * No DOM, fetch, or normalization of the authored source. Unmappable syntax fails closed.
 */
import { marked } from 'marked';
import { scanLessonFences } from './lessonFences';
import { widgetMarkdownFields } from './widgetMarkdown';
export interface MarkdownImageAsset { src:string; start:number; end:number; replace:(src:string)=>string }
const decode=(raw:string):string=>raw.replace(/&(#x[0-9a-f]+|#\d+|amp|quot|apos|lt|gt|colon);/gi,(_,entity:string)=>entity[0]==='#'?String.fromCodePoint(parseInt(entity[1].toLowerCase()==='x'?entity.slice(2):entity.slice(1),entity[1].toLowerCase()==='x'?16:10)):({amp:'&',quot:'"',apos:"'",lt:'<',gt:'>',colon:':'})[entity.toLowerCase()]!);
export function markdownImageAssets(source:string):{assets:MarkdownImageAsset[];errors:string[]} {
 const assets:MarkdownImageAsset[]=[],errors:string[]=[];
 let parseSource=source;
 const blank=(text:string)=>text.replace(/[^\n\r]/g,' ');
 for(const fence of scanLessonFences(source).reverse()) {
  const region=source.slice(fence.start,fence.end);
  if(fence.interactive&&['map','timeline','sim'].includes(fence.kind)){
   const bodyStart=fence.start+region.indexOf('\n')+1;
   for(const field of widgetMarkdownFields(fence.kind,fence.info,fence.body)){
    const parsed=markdownImageAssets(field.source);errors.push(...parsed.errors);
    assets.push(...parsed.assets.map(asset=>({...asset,start:asset.start+bodyStart+field.start,end:asset.end+bodyStart+field.start})));
   }
  }
  if(!fence.interactive||!['example','dialogue','speak'].includes(fence.kind))parseSource=parseSource.slice(0,fence.start)+blank(region)+parseSource.slice(fence.end);
  else {const first=region.indexOf('\n');const closing=/^```[ \t]*\r?$/m.exec(region.slice(first+1));const last=closing?first+1+closing.index:region.length;parseSource=parseSource.slice(0,fence.start)+blank(region.slice(0,first))+region.slice(first,last)+blank(region.slice(last))+parseSource.slice(fence.end);}
 }
 function mapRaw(raw:string,parent:number[],from:number,text:string):number[]|null {
  const direct=text.indexOf(raw,from);
  if(direct>=0)return parent.slice(direct,direct+raw.length);
  const result:number[]=[];let at=from;
  for(const char of raw){const next=text.indexOf(char,at);if(next<0||!/^[\s>]*$/.test(text.slice(at,next)))return null;result.push(parent[next]);at=next+1;}
  return result;
 }
 function html(raw:string,map:number[]) {
  let at=0;
  while(at<raw.length){const begin=raw.indexOf('<',at);if(begin<0)break;if(raw.startsWith('<!--',begin)){const end=raw.indexOf('-->',begin+4);at=end<0?raw.length:end+3;continue;}
   let end=begin+1,quote='';for(;end<raw.length;end++){const c=raw[end];if(quote){if(c===quote)quote='';}else if(c==='"'||c==="'")quote=c;else if(c==='>')break;}at=end+1;
   const tag=raw.slice(begin,end+1);const name=/^<\s*img\b/i.exec(tag);if(!name)continue;
   let pos=name[0].length;const attrs=new Map<string,{value:string;start:number;end:number}>();
   while(pos<tag.length-1){while(/\s/.test(tag[pos]??''))pos++;if(tag[pos]==='/'||tag[pos]==='>')break;const key=/^[^\s=/>]+/.exec(tag.slice(pos));if(!key){errors.push('Malformed image HTML');break;}pos+=key[0].length;while(/\s/.test(tag[pos]??''))pos++;if(tag[pos]!=='=')continue;pos++;while(/\s/.test(tag[pos]??''))pos++;const quote=tag[pos]==='"'||tag[pos]==="'"?tag[pos++]:'';const start=pos;while(pos<tag.length&&(quote?tag[pos]!==quote:!/[\s>]/.test(tag[pos])))pos++;const value=tag.slice(start,pos);if(quote)pos++;const lower=key[0].toLowerCase();if(attrs.has(lower))errors.push('Duplicate image HTML attribute');attrs.set(lower,{value,start:begin+start,end:begin+pos-(quote?1:0)});}
   if(attrs.has('srcset'))errors.push('Image srcset is not a canonical embedded asset');const src=attrs.get('src');if(!src){errors.push('Image HTML requires a src');continue;}
   try { const decoded=decode(src.value);if(/&(?:#|[a-z])/i.test(decoded))errors.push('Unsupported image source entity');assets.push({src:decoded,start:map[src.start],end:map[src.end-1]+1,replace:value=>value}); }catch{errors.push('Invalid image source entity');}
  }
 }
 function walk(tokens:any[],parent:number[]) {
  let cursor=0;const parentText=parent.map(i=>parseSource[i]).join('');
  for(const token of tokens){if(!token||typeof token!=='object')continue;
   const tokenRaw=typeof token.raw==='string'?token.raw:typeof token.text==='string'?token.text:undefined;
   let map=parent;if(tokenRaw!==undefined){const found=mapRaw(tokenRaw,parent,cursor,parentText);if(!found){if(token.type==='image'||token.type==='html')errors.push('Image syntax cannot be mapped losslessly');map=parent;}else{map=found;cursor=parent.indexOf(found[found.length-1],cursor)+1;}}
   if(token.type==='image'){
    if(!map.length||typeof token.raw!=='string')continue;
    let depth=1,endAlt=2;for(;endAlt<token.raw.length;endAlt++){if(token.raw[endAlt]==='\\'){endAlt++;continue;}if(token.raw[endAlt]==='[')depth++;if(token.raw[endAlt]===']'&&!--depth)break;}
    if(depth){errors.push('Malformed image alternative text');continue;}
    const end=map[map.length-1]+1,start=endAlt+1===token.raw.length?end:map[endAlt+1];
    if(start===undefined){errors.push('Unmappable image reference');continue;}
    try {const src=decode(token.href);if(/&(?:#|[a-z])/i.test(src))errors.push('Unsupported image source entity');const title=token.title==null?'':` "${String(token.title).replace(/\\/g,'\\\\').replace(/"/g,'\\"')}"`;assets.push({src,start,end,replace:value=>`(${value}${title})`});}catch{errors.push('Invalid image source entity');}
   }else if(token.type==='html')html(token.raw,map);
   else if(token.type!=='code'&&token.type!=='codespan'){
    if(Array.isArray(token.tokens))walk(token.tokens,map);
    if(Array.isArray(token.items))walk(token.items,map);
    if(Array.isArray(token.header)||Array.isArray(token.rows))walk([...(token.header??[]),...(token.rows??[]).flat()],map);
   }
  }
 }
 try{walk(marked.lexer(parseSource),Array.from({length:parseSource.length},(_,i)=>i));}catch{errors.push('Malformed Markdown image source');}
 return {assets,errors:[...new Set(errors)]};
}
export function transformMarkdownImages(source:string,transform:(src:string)=>string, beforeReplace?:(previous:string,next:string)=>void):string {
 const {assets,errors}=markdownImageAssets(source);if(errors.length)throw Error(errors.join('; '));
 let result=source;for(const asset of [...assets].sort((a,b)=>b.start-a.start)){const next=transform(asset.src);if(next!==asset.src){const replacement=asset.replace(next);beforeReplace?.(source.slice(asset.start,asset.end),replacement);result=result.slice(0,asset.start)+replacement+result.slice(asset.end);}}return result;
}
