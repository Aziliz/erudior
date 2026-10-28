/** Worker-safe structural checks. Never executes a submitted program or renders untrusted geometry. */
import { parse, FUNCTION_NAMES, type Node } from "./expr";
import { normalizeCodeSpec } from "./code";
import { validateStaticSvg } from "./imageAssets";
import { parseMapSpec } from "./mapSpec";
export const INTERACTIVE_LIMITS = { sourceBytes: 1024 * 1024, blockBytes: 256 * 1024, blocks: 200, nodes: 20000, depth: 24, items: 500, expression: 2000 } as const;
export const plainInteractiveObject = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value) && [Object.prototype,null].includes(Object.getPrototypeOf(value));
export function boundedInteractiveJSON(value: unknown): string[] {
 let nodes=0, chars=0;const seen=new Set<object>();
 const walk=(v:unknown,depth:number)=>{
  if(++nodes>INTERACTIVE_LIMITS.nodes||depth>INTERACTIVE_LIMITS.depth)throw Error("Interactive data exceeds structural limit");
  if(typeof v==="string"){chars+=v.length;if(chars>INTERACTIVE_LIMITS.blockBytes)throw Error("Interactive data exceeds text limit");return;}
  if(v===null||typeof v==="boolean"||typeof v==="number"&&Number.isFinite(v))return;
  if(typeof v!=="object"||seen.has(v)||!Array.isArray(v)&&!plainInteractiveObject(v))throw Error("Interactive data must be finite acyclic JSON");
  seen.add(v);for(const [key,item]of Object.entries(v)){if(["__proto__","constructor","prototype"].includes(key))throw Error("Unsafe interactive data key");walk(item,depth+1);}seen.delete(v);
 };
 try{walk(value,0);if(new TextEncoder().encode(JSON.stringify(value)).length>INTERACTIVE_LIMITS.blockBytes)throw Error("Interactive data exceeds byte limit");return [];}catch(error){return [(error as Error).message];}
}
function shape(v:unknown,keys:string[],at:string,errors:string[]):v is Record<string,unknown>{if(!plainInteractiveObject(v)){errors.push(`${at}: expected an object`);return false;}for(const key of Object.keys(v))if(!keys.includes(key))errors.push(`${at}.${key}: unsupported field`);return true;}
const str=(v:unknown)=>typeof v==="string"&&v.length<=50000;
export function validateCodeQuestionSpec(raw:unknown):string[]{
 const errors=boundedInteractiveJSON(raw);if(errors.length)return errors;
 if(!shape(raw,["language","starter","solution","function","tests","hints","timeLimit"],"code",errors))return errors;
 if(!["python","py","python3","javascript","js"].includes(raw.language as string))errors.push("code.language: unsupported language");
 for(const key of ["starter","solution","function"])if(raw[key]!==undefined&&!str(raw[key]))errors.push(`code.${key}: expected text`);
 if(raw.hints!==undefined&&(!Array.isArray(raw.hints)||raw.hints.length>100||raw.hints.some(v=>!str(v))))errors.push("code.hints: expected bounded text list");
 if(raw.timeLimit!==undefined&&(typeof raw.timeLimit!=="number"||!Number.isFinite(raw.timeLimit)||raw.timeLimit<1||raw.timeLimit>30))errors.push("code.timeLimit: expected 1–30 seconds");
 if(!Array.isArray(raw.tests)||!raw.tests.length||raw.tests.length>100)errors.push("code.tests: needs 1–100 tests");
 else for(const [i,test]of raw.tests.entries())if(shape(test,["name","call","args","expect","stdin","stdout","hidden","tolerance"],`code.tests[${i}]`,errors)){
  for(const key of ["name","call","stdin","stdout"])if(test[key]!==undefined&&!str(test[key]))errors.push(`code.tests[${i}].${key}: expected text`);
  if(test.args!==undefined&&(!Array.isArray(test.args)||test.args.length>100))errors.push("code test args: expected bounded list");
  if(test.hidden!==undefined&&typeof test.hidden!=="boolean")errors.push("code test hidden: expected boolean");
  if(test.tolerance!==undefined&&(typeof test.tolerance!=="number"||!Number.isFinite(test.tolerance)||test.tolerance<0))errors.push("code test tolerance: expected finite nonnegative number");
 }
 if(!errors.length)try{normalizeCodeSpec(raw);}catch(error){errors.push((error as Error).message);}
 return errors;
}
export function validateFigureSpec(raw:unknown,context:{variables?:readonly string[];functions?:readonly string[]}={}):string[]{
 const errors=boundedInteractiveJSON(raw);if(errors.length)return errors;
 const keys=["type","equal","xLabel","yLabel","x","y","grid","yAxisAt","xAxisAt","functions","points","segments","polygons","circles","labels","shade","tangents","rightAngles","curves","slopeField","vectorField","bars","width","caption"];
 if(!shape(raw,keys,"figure",errors))return errors;
 if(!["plot","shape","numberline"].includes(raw.type as string))errors.push("figure.type: unsupported kind");
 const expression=(v:unknown,at:string,allowFunctionName=false)=>{
  if(typeof v==="number"){if(!Number.isFinite(v)||Math.abs(v)>1e6)errors.push(`${at}: number outside finite geometry bound`);return;}
  if(allowFunctionName&&typeof v==="string"&&context.functions?.includes(v))return;
  if(typeof v!=="string"||!v.trim()||v.length>INTERACTIVE_LIMITS.expression){errors.push(`${at}: expected bounded math expression`);return;}
  try{const ast=parse(v,{implicit:true,vars:["x","y","t",...(context.variables??[])],funcNames:[...(context.functions??[])]});let nodes=0;const walk=(n:Node,depth:number)=>{if(++nodes>500||depth>32)throw Error("expression too complex");if(n.k==="num"&&!Number.isFinite(n.v))throw Error("nonfinite literal");if(n.k==="var"&&!["x","y","t","pi","e","tau",...(context.variables??[])].includes(n.name))throw Error(`unknown variable ${n.name}`);if(n.k==="call"){if(!FUNCTION_NAMES.includes(n.name)&&!context.functions?.includes(n.name))throw Error(`unknown function ${n.name}`);n.args.forEach(a=>walk(a,depth+1));}if(n.k==="bin"){walk(n.a,depth+1);walk(n.b,depth+1);}if(n.k==="un")walk(n.a,depth+1);};walk(ast,0);}catch(error){errors.push(`${at}: ${(error as Error).message}`);}
 };
 const pair=(v:unknown,at:string)=>{if(!Array.isArray(v)||v.length!==2)errors.push(`${at}: expected coordinate pair`);else v.forEach((n,i)=>expression(n,`${at}[${i}]`));};
 const opt=(o:Record<string,unknown>,key:string,check:(v:unknown,at:string)=>void,at:string)=>{if(o[key]!==undefined)check(o[key],`${at}.${key}`);};
 const string=(v:unknown,at:string)=>{if(!str(v))errors.push(`${at}: expected text`);};
 const bool=(v:unknown,at:string)=>{if(typeof v!=="boolean")errors.push(`${at}: expected boolean`);};
 const color=(v:unknown,at:string)=>{if(typeof v!=="string"||!/^(?:#[0-9a-fA-F]{3,8}|[a-zA-Z][a-zA-Z0-9_-]{0,39}|var\(--fig-[0-5]\))$/.test(v))errors.push(`${at}: unsafe color`);};
 for(const k of ["equal","grid"])opt(raw,k,bool,"figure");for(const k of ["xLabel","yLabel","caption"])opt(raw,k,string,"figure");
 for(const k of ["x","y"]){opt(raw,k,pair,"figure");const r=raw[k];if(Array.isArray(r)&&r.every(n=>typeof n==="number")&&(!(r[1]>r[0])||r[1]-r[0]<1e-6))errors.push(`figure.${k}: range must increase and have usable span`);}
 if(raw.width!==undefined&&(typeof raw.width!=="number"||raw.width<100||raw.width>2000))errors.push("figure.width: expected 100–2000");
 if(raw.yAxisAt!==undefined&&!["zero","left"].includes(raw.yAxisAt as string))errors.push("figure.yAxisAt: invalid position");if(raw.xAxisAt!==undefined&&!["zero","bottom"].includes(raw.xAxisAt as string))errors.push("figure.xAxisAt: invalid position");
 const arrays:Record<string,{fields:string[];required:string[];pairs?:string[];expr?:string[];texts?:string[];bools?:string[]}>= {
  segments:{fields:["from","to","label","arrow","dashed","color"],required:["from","to"],pairs:["from","to"],texts:["label"],bools:["arrow","dashed"]},
  circles:{fields:["center","r","fill","color"],required:["center","r"],pairs:["center"],expr:["r"],bools:["fill"]},
  labels:{fields:["at","text"],required:["at","text"],pairs:["at"],texts:["text"]},
  shade:{fields:["f","g","from","to","color"],required:["f","from","to"],expr:["f","g","from","to"]},
  tangents:{fields:["f","at","color"],required:["f","at"],expr:["f","at"]},
  curves:{fields:["x","y","t","label","color","dashed"],required:["x","y","t"],expr:["x","y"],pairs:["t"],texts:["label"],bools:["dashed"]},
  bars:{fields:["x","height","width","label","color"],required:["x","height"],expr:["x","height","width"],texts:["label"]},
 };
 const list=(v:unknown,at:string,check:(v:unknown,at:string)=>void)=>{if(!Array.isArray(v)||v.length>100)errors.push(`${at}: expected at most 100 items`);else v.forEach((item,i)=>check(item,`${at}[${i}]`));};
 for(const [key,rule]of Object.entries(arrays))if(raw[key]!==undefined)list(raw[key],`figure.${key}`,(item,at)=>{if(!shape(item,rule.fields,at,errors))return;for(const required of rule.required)if(item[required]===undefined)errors.push(`${at}.${required}: required`);for(const name of rule.pairs??[])opt(item,name,pair,at);for(const name of rule.expr??[])opt(item,name,(v,p)=>expression(v,p,name==="f"||name==="g"),at);for(const name of rule.texts??[])opt(item,name,string,at);for(const name of rule.bools??[])opt(item,name,bool,at);opt(item,"color",color,at);});
 if(raw.functions!==undefined)list(raw.functions,"figure.functions",(item,at)=>{if(typeof item==="string")expression(item,at,true);else if(shape(item,["f","label","color","dashed","from","to"],at,errors)){expression(item.f,at+".f",true);opt(item,"label",string,at);opt(item,"color",color,at);opt(item,"dashed",bool,at);opt(item,"from",expression,at);opt(item,"to",expression,at);}});
 if(raw.points!==undefined)list(raw.points,"figure.points",(item,at)=>{if(Array.isArray(item))pair(item,at);else if(shape(item,["at","label","open","color"],at,errors)){pair(item.at,at+".at");opt(item,"label",string,at);opt(item,"open",bool,at);opt(item,"color",color,at);}});
 if(raw.polygons!==undefined)list(raw.polygons,"figure.polygons",(item,at)=>{if(shape(item,["points","fill","color"],at,errors)){list(item.points,at+".points",pair);if(Array.isArray(item.points)&&item.points.length<3)errors.push(`${at}: polygon needs 3 points`);opt(item,"fill",bool,at);opt(item,"color",color,at);}});
 if(raw.rightAngles!==undefined)list(raw.rightAngles,"figure.rightAngles",(item,at)=>{if(!Array.isArray(item)||item.length!==3)errors.push(`${at}: expected 3 coordinates`);else item.forEach((p,i)=>pair(p,at+"."+i));});
 for(const k of ["slopeField","vectorField"])if(raw[k]!==undefined){const item=raw[k],keys=k==="slopeField"?["f","step"]:["u","v","step"];if(shape(item,keys,`figure.${k}`,errors)){for(const field of keys.filter(v=>v!=="step"))expression(item[field],`figure.${k}.${field}`);opt(item,"step",expression,`figure.${k}`);if(typeof item.step==="number"&&item.step<=0)errors.push(`figure.${k}.step: must be positive`);}}
 return errors;
}
/** A custom map is inert geometry, never a remote request or executable SVG. */
function mapInlineData(source:string,kind:"svg"|"json"):string {
 if(!source.startsWith("data:"))return source;
 const match=/^data:([^;,]+)(?:;charset=utf-8)?(;base64)?,([\s\S]*)$/i.exec(source);
 const allowed=kind==="svg"?["image/svg+xml"]:["application/json","application/geo+json","application/geojson"];
 if(!match||!allowed.includes(match[1].toLowerCase()))throw Error("Unsupported embedded map MIME type");
 let decoded:string;
 if(match[2]){
  const encoded=match[3].replace(/\s+/g, "");
  if(!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(encoded))throw Error("Invalid embedded map base64");
  decoded=new TextDecoder("utf-8",{fatal:true,ignoreBOM:false}).decode(Uint8Array.from(atob(encoded),c=>c.charCodeAt(0)));
 }else decoded=decodeURIComponent(match[3]);
 if(new TextEncoder().encode(decoded).length>INTERACTIVE_LIMITS.blockBytes)throw Error("Embedded map exceeds limit");
 return decoded;
}
export function validateMapSource(body:string):string[]{
 if(typeof body!=="string"||new TextEncoder().encode(body).length>INTERACTIVE_LIMITS.blockBytes)return ["Map source must be bounded text"];
 const spec=parseMapSpec(body), errors=[...spec.problems];
 if(spec.svg){
  try {
   const value=mapInlineData(spec.svg,"svg");
   errors.push(...validateStaticSvg(value,{allowFragmentNamespace:true}));
   if(!/^\s*<svg\b/i.test(value)||!/<\/svg>\s*$/i.test(value))errors.push("Map SVG requires one complete svg element");
   if(/<!|<\?|\bon\w+\s*=|(?:href|src|style)\s*=|<\s*(?:script|foreignObject|iframe|use|image|animate)\b/i.test(value))errors.push("Map SVG contains unsupported active or external content");
   const allowed=new Set(["svg","g","title","path","polygon","polyline","rect","circle","ellipse"]);
   for(const tag of value.matchAll(/<\/?([A-Za-z][\w:-]*)\b/g))if(!allowed.has(tag[1].toLowerCase()))errors.push(`Unsupported SVG element ${tag[1]}`);
   if(!/<(?:path|polygon|polyline|rect|circle|ellipse)\b[^>]*(?:id|data-name|aria-label)=/i.test(value)&&!/<title>/i.test(value))errors.push("Map SVG needs a named shape");
  }catch(error){errors.push(`Map SVG: ${(error as Error).message}`);}
 }
 if(spec.geojson){try{const raw=JSON.parse(mapInlineData(spec.geojson,"json"));errors.push(...boundedInteractiveJSON(raw));const geometry=(g:unknown,depth=0):void=>{
 if(depth>8||!plainInteractiveObject(g))throw Error("Invalid geometry");
 if(Object.keys(g).some(key=>!["type","coordinates","geometries","bbox"].includes(key)))throw Error("Unknown geometry field");
 if(g.type==="GeometryCollection"){
  if(g.coordinates!==undefined||!Array.isArray(g.geometries)||g.geometries.length>100)throw Error("Invalid geometry list");g.geometries.forEach(v=>geometry(v,depth+1));return;
 }
 const depths:Record<string,number>={Point:0,MultiPoint:1,LineString:1,MultiLineString:2,Polygon:2,MultiPolygon:3};
 if(typeof g.type!=="string"||!Object.prototype.hasOwnProperty.call(depths,g.type)||g.geometries!==undefined)throw Error("Unsupported geometry type");
 let count=0;
 const position=(v:unknown)=>{if(!Array.isArray(v)||v.length<2||v.length>3||v.some(n=>typeof n!=="number"||!Number.isFinite(n)||Math.abs(n)>1e6))throw Error("Invalid coordinate");if(spec.projection!=="plain"&&(Math.abs(v[0])>180||Math.abs(v[1])>90))throw Error("Geographic coordinate outside longitude/latitude bounds");};
 const coords=(v:unknown,d:number):void=>{if(++count>10000||!Array.isArray(v)||!v.length)throw Error("Invalid geometry coordinates");if(d===0)position(v);else v.forEach(c=>coords(c,d-1));};coords(g.coordinates,depths[g.type]);
 const line=(v:unknown)=>{if(!Array.isArray(v)||v.length<2)throw Error("LineString needs two positions");};
 const ring=(v:unknown)=>{if(!Array.isArray(v)||v.length<4||JSON.stringify(v[0])!==JSON.stringify(v[v.length-1]))throw Error("Polygon rings require four positions and a closed boundary");};
 if(g.type==="LineString")line(g.coordinates);
 if(g.type==="MultiLineString")(g.coordinates as unknown[]).forEach(line);
 if(g.type==="Polygon")(g.coordinates as unknown[]).forEach(ring);
 if(g.type==="MultiPolygon")(g.coordinates as unknown[][]).forEach(polygon=>polygon.forEach(ring));
};const feature=(f:unknown)=>{if(!plainInteractiveObject(f)||f.type!=="Feature"||Object.keys(f).some(key=>!["type","geometry","properties","id","bbox"].includes(key)))throw Error("Invalid GeoJSON feature");if(f.properties!==undefined&&f.properties!==null&&!plainInteractiveObject(f.properties))throw Error("Invalid feature properties");geometry(f.geometry);};if(!plainInteractiveObject(raw))throw Error("Invalid GeoJSON");if(raw.type==="FeatureCollection"){if(Object.keys(raw).some(key=>!["type","features","bbox"].includes(key)))throw Error("Unknown feature collection field");if(!Array.isArray(raw.features)||!raw.features.length||raw.features.length>100)throw Error("Invalid feature list");raw.features.forEach(feature);}else if(raw.type==="Feature")feature(raw);else geometry(raw);}catch(error){errors.push(`Map GeoJSON: ${(error as Error).message}`);}}
 if(spec.points.length+spec.routes.length+spec.regions.length+spec.labels.length>500)errors.push("Map has too many items");
 for(const route of spec.routes)if(route.path.length>1000)errors.push("Map route has too many points");
 return errors;
}
