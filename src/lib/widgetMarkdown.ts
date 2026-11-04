/** Source spans of the fields that map/timeline/simulation renderers pass to Markdown.
 * Keep plain labels, categories, coordinates and structured map data inert.
 */
import { readFields } from './blockUtil';
import { MAP_FIELD_KEYS } from './mapSpec';
import { SIM_KINDS } from './sims';

export function widgetMarkdownFields(kind:string, info:string, body:string):Array<{source:string;start:number;end:number}> {
 const meta=SIM_KINDS[info.trim().split(/\s+/)[0]];
 const keys=kind==='map'?MAP_FIELD_KEYS:kind==='timeline'?['title','caption','era','event']:kind==='sim'?['title','caption','fixed',...(meta?.params.map(p=>p.key)??[]),...(meta?.choices?.map(c=>c.key)??[])]:[];
 if(!keys.length)return [];
 const {fields}=readFields(body,keys,kind==='map'?['geojson','svg','caption']:['caption']);
 const lines=[...body.matchAll(/[^\r\n]*(?:\r\n|\r|\n|$)/g)].filter(line=>line[0].length);
 const result:Array<{source:string;start:number;end:number}>=[];
 for(let i=0;i<fields.length;i++){
  const field=fields[i];if(!['title','caption',...(kind==='timeline'?['era','event']:[])].includes(field.key))continue;
  const line=lines[field.line-1];if(!line)continue;
  let start=line.index!+line[0].indexOf(':')+1;
  let end=field.key==='caption'?(fields[i+1]?lines[fields[i+1].line-1].index!:body.length):line.index!+line[0].replace(/[\r\n]+$/,'').length;
  if(field.key==='era'||field.key==='event'){
   const value=body.slice(start,end),first=value.indexOf('|');if(first<0)continue;
   const second=value.indexOf('|',first+1);end=second<0?end:start+second;start+=first+1;
  }
  const value=body.slice(start,end);start+=value.length-value.trimStart().length;end-=value.length-value.trimEnd().length;
  if(end>start)result.push({source:body.slice(start,end),start,end});
 }
 return result;
}
