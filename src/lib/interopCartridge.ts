import { SaxesParser } from 'saxes';
import { readExchangeZip, writeExchangeZip, exchangePath, type ExchangeFile } from './interopZip';
/** Deliberately limited CC 1.3 static-content adapter, not conformance certification. */
export const CC_NS='http://www.imsglobal.org/xsd/imsccv1p3/imscp_v1p1';
export const CC_LINK_NS='http://www.imsglobal.org/xsd/imsccv1p3/imswl_v1p3';
const LOM='http://ltsc.ieee.org/xsd/imsccv1p3/LOM/manifest';
interface Node { name:string; uri:string; attrs:Record<string,string>; children:Node[]; text:string; parts:(string|Node)[] }
function xml(source:string):Node {
  if(source.length>512*1024) throw Error('XML size limit exceeded');
  const parser=new SaxesParser({xmlns:true}), stack:Node[]=[]; let root:Node|undefined, count=0;
  parser.on('error',e=>{throw e;}); parser.on('doctype',()=>{throw Error('Document types and entities are forbidden');}); parser.on('processinginstruction',()=>{throw Error('Processing instructions are forbidden');});
  parser.on('opentag',tag=>{
    if(++count>10000 || stack.length>=32) throw Error('XML structural limit exceeded');
    const attrs:Record<string,string>=Object.create(null);
    for(const a of Object.values(tag.attributes)) {
      if(a.uri==='http://www.w3.org/2000/xmlns/') continue;
      // Namespace-qualified schema hints are retained in the original bytes, never fetched.
      attrs[a.uri ? `{${a.uri}}${a.local}` : a.local]=a.value;
    }
    const n:Node={name:tag.local,uri:tag.uri,attrs,children:[],text:'',parts:[]};
    if(stack.length) { stack[stack.length-1].children.push(n); stack[stack.length-1].parts.push(n); } else {if(root) throw Error('Multiple XML roots');root=n;} stack.push(n);
  });
  const chars=(value:string)=>{if(stack.length) { stack[stack.length-1].text+=value; stack[stack.length-1].parts.push(value); }};
  parser.on('text',chars); parser.on('cdata',chars); parser.on('closetag',()=>{stack.pop();}); parser.write(source).close();
  if(!root) throw Error('Missing XML root'); return root;
}
const children=(n:Node,name:string,uri=n.uri)=>n.children.filter(c=>c.name===name && c.uri===uri);
const one=(n:Node,name:string,uri=n.uri)=>{const found=children(n,name,uri); if(found.length!==1)throw Error(`Expected one ${name}`);return found[0];};
const text=(n:Node):string=>n.parts.map(p=>typeof p==='string'?p:text(p)).join('');
const escape=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]!)).replace(/\r/g,'&#13;');
function label(s:unknown,max=2000):string { if(typeof s!=='string'||!s.trim()||s.length>max||/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(s))throw Error('Invalid cartridge text');return s; }
function id(s:unknown):string { if(typeof s!=='string'||!/^[A-Za-z_][A-Za-z0-9_.-]{0,127}$/.test(s))throw Error('Invalid cartridge identifier');return s; }
function url(s:unknown):string {label(s);const u=new URL(s as string);if(u.protocol!=='https:'||u.username||u.password)throw Error('Only credential-free HTTPS web links are supported');return s as string;}
export interface CartridgeItem { identifier:string; title:string; resourceId?:string; children:CartridgeItem[] }
export type CartridgeResource = { identifier:string; kind:'text'; title:string; text:string } | { identifier:string; kind:'link'; title:string; url:string };
export interface CartridgeContent { identifier:string; title:string; items:CartridgeItem[]; resources:CartridgeResource[] }
export interface CartridgePreview extends CartridgeContent { sourceFiles:ExchangeFile[]; notice:string }
/** Only inert XHTML is accepted. Render returned text as text, never as HTML. */
function staticText(source:string):string {
  const root=xml(source), allowed=new Set('html head title body p div span h1 h2 h3 h4 h5 h6 pre br ul ol li strong em b i blockquote hr'.split(' '));
  if(root.name!=='html'||!['','http://www.w3.org/1999/xhtml'].includes(root.uri))throw Error('Static XHTML html root required');
  function visit(n:Node):string {
    if(!allowed.has(n.name)||n.uri!==root.uri)throw Error('Unsupported or active HTML element');
    for(const k of Object.keys(n.attrs)) if(!['lang','{http://www.w3.org/XML/1998/namespace}lang'].includes(k))throw Error('Unsupported or active HTML attribute');
    const value=n.parts.map(p=>typeof p==='string'?p:visit(p)).join('');
    return ['p','div','li','pre','h1','h2','h3','h4','h5','h6','br','hr','blockquote'].includes(n.name)?value+'\n':value;
  }
  // Validate the entire document, including head, even though only body is shown.
  visit(root);const body=one(root,'body');
  if(body.children.length===1&&body.children[0].name==='pre'&&!body.text.trim())return text(body.children[0]);
  return visit(body).trim();
}
function inspect(files:ExchangeFile[]):CartridgePreview {
  if(!Array.isArray(files)||files.length>128)throw Error('Archive entry limit exceeded');
  const byPath=new Map(files.map(f=>[f.path,f.text])); if(byPath.size!==files.length)throw Error('Duplicate files');
  const manifest=byPath.get('imsmanifest.xml');if(manifest===undefined)throw Error('Root imsmanifest.xml required');
  const root=xml(manifest);if(root.name!=='manifest'||root.uri!==CC_NS)throw Error('Only Common Cartridge 1.3 is supported');
  if(Object.keys(root.attrs).some(k=>!['identifier','{http://www.w3.org/2001/XMLSchema-instance}schemaLocation'].includes(k)))throw Error('Unsupported manifest attributes');
  const identifier=id(root.attrs.identifier), metadata=one(root,'metadata');
  const documentIds=new Set<string>([identifier]);
  const uniqueId=(value:unknown)=>{const key=id(value);if(documentIds.has(key))throw Error('Duplicate document-wide XML identifier');documentIds.add(key);return key;};
  if(text(one(metadata,'schema')).trim()!=='IMS Common Cartridge'||text(one(metadata,'schemaversion')).trim()!=='1.3.0')throw Error('Common Cartridge 1.3.0 metadata required');
  const lom=one(metadata,'lom',LOM), title=label(text(one(one(lom,'general',LOM),'title',LOM)).trim());
  if(root.children.some(n=>n.uri!==CC_NS||!['metadata','organizations','resources'].includes(n.name)))throw Error('Unsupported manifest extension');
  const resourceNodes=one(root,'resources').children, resources:CartridgeResource[]=[], ids=new Set<string>(), used=new Set(['imsmanifest.xml']);
  for(const n of resourceNodes) {
    if(n.name!=='resource'||n.uri!==CC_NS)throw Error('Unsupported resource element');
    const identifier=uniqueId(n.attrs.identifier);ids.add(identifier);
    if(n.children.some(c=>c.uri!==CC_NS||c.name!=='file'))throw Error('Unsupported resource dependency, metadata or inline descriptor');
    const file=one(n,'file'), path=exchangePath(file.attrs.href);
    if(file.children.length||file.text.trim()||Object.keys(file.attrs).some(k=>k!=='href'))throw Error('Unsupported file metadata');
    const source=byPath.get(path);if(source===undefined||path==='imsmanifest.xml')throw Error('Missing resource file');used.add(path);
    if(n.attrs.type==='webcontent') {
      if(n.attrs.href!==path||Object.keys(n.attrs).some(k=>!['identifier','type','href'].includes(k)))throw Error('Unsupported web content attributes');
      const content= /\.txt$/i.test(path)?source:/\.(html|xhtml|htm)$/i.test(path)?staticText(source):(()=>{throw Error('Only plain text or inert XHTML web content is supported');})();
      resources.push({identifier,kind:'text',title:identifier,text:content});
    } else if(n.attrs.type==='imswl_xmlv1p3') {
      if(Object.keys(n.attrs).some(k=>!['identifier','type'].includes(k)))throw Error('Unsupported link resource attributes');
      const link=xml(source);if(link.name!=='webLink'||link.uri!==CC_LINK_NS)throw Error('Invalid CC1.3 web link');
      if(Object.keys(link.attrs).some(k=>k!=='{http://www.w3.org/2001/XMLSchema-instance}schemaLocation'))throw Error('Unsupported web link attributes');
      if(link.children.some(c=>!['title','url'].includes(c.name)||c.uri!==CC_LINK_NS))throw Error('Unsupported web link content');
      const target=one(link,'url');if(target.children.length||target.text.trim()||Object.keys(target.attrs).some(k=>!['href','target','windowFeatures'].includes(k)))throw Error('Unsupported link metadata');
      resources.push({identifier,kind:'link',title:label(text(one(link,'title'))),url:url(target.attrs.href)});
    } else throw Error(`Unsupported Common Cartridge resource type: ${n.attrs.type ?? '(missing)'}. No content was converted.`);
  }
  if(!resources.length||resources.length>100)throw Error('Cartridge resource limit exceeded');
  if(files.some(f=>!used.has(f.path)))throw Error('Unreferenced archive file is not supported');
  let itemCount=0;
  function item(n:Node):CartridgeItem {
    if(++itemCount>200||n.name!=='item'||n.uri!==CC_NS)throw Error('Invalid organization item');
    const identifier=uniqueId(n.attrs.identifier);
    if(Object.keys(n.attrs).some(k=>!['identifier','identifierref'].includes(k))||n.children.some(c=>c.uri!==CC_NS||!['title','item'].includes(c.name)))throw Error('Unsupported item semantics');
    const titles=children(n,'title');if(titles.length!==1)throw Error('Exactly one item title required');if(titles.some(t=>t.children.length||Object.keys(t.attrs).length))throw Error('Unsupported item title markup');const title=titles.length?label(text(titles[0])):identifier;
    const resourceId=n.attrs.identifierref;if(resourceId!==undefined&&!ids.has(resourceId))throw Error('Dangling resource reference');
    if(resourceId) {const r=resources.find(r=>r.identifier===resourceId)!;if(r.title===r.identifier)r.title=title;}
    return {identifier,title,...(resourceId?{resourceId}:{}),children:children(n,'item').map(item)};
  }
  const orgs=one(root,'organizations');if(Object.keys(orgs.attrs).length||orgs.children.length>1)throw Error('Only one organization is supported');
  const org=orgs.children[0];let items:CartridgeItem[]=[];
  if(org) {
    if(org.name!=='organization'||org.uri!==CC_NS||org.attrs.structure!=='rooted-hierarchy'||Object.keys(org.attrs).some(k=>!['identifier','structure'].includes(k)))throw Error('Unsupported organization');uniqueId(org.attrs.identifier);
    if(org.children.length!==1)throw Error('CC organization requires one root item');
    const rootItem=org.children[0];if(rootItem.name!=='item'||rootItem.uri!==CC_NS||Object.keys(rootItem.attrs).some(k=>k!=='identifier')||rootItem.text.trim())throw Error('Unsupported organization root item');uniqueId(rootItem.attrs.identifier);items=rootItem.children.map(item);
  }
  return {identifier,title,items,resources,sourceFiles:files.map(f=>({...f})),notice:'CC 1.3 static text and HTTPS web links only. Original files are retained; no remote content is fetched, no course is installed, and no certification is claimed.'};
}
export async function importCartridge(bytes:Uint8Array):Promise<CartridgePreview> {return inspect(await readExchangeZip(bytes));}
/** Lossless passthrough for an imported supported cartridge, with fresh validation. */
export function reexportCartridge(preview:CartridgePreview):Uint8Array {inspect(preview.sourceFiles);return writeExchangeZip(preview.sourceFiles);}
/** Export a selected static snapshot, not a full course or assessment conversion. */
export function exportCartridge(content:CartridgeContent):Uint8Array {
  const keys=(value:unknown,allowed:string[])=>{if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).some(k=>!allowed.includes(k)))throw Error('Unsupported export field or object');};
  keys(content,['identifier','title','items','resources']);
  id(content.identifier);label(content.title);if(!Array.isArray(content.resources)||!content.resources.length||content.resources.length>100)throw Error('Invalid resource count');
  const files:ExchangeFile[]=[], declarations:string[]=[];
  for(const [i,r] of content.resources.entries()) {
    keys(r,r.kind==='text'?['identifier','kind','title','text']:['identifier','kind','title','url']);
    id(r.identifier);label(r.title);const path=`resources/r${i}.${r.kind==='text'?'html':'xml'}`;
    if(r.kind==='text') {
      if(typeof r.text!=='string'||r.text.length>400000)throw Error('Invalid text resource');
      files.push({path,text:`<?xml version="1.0" encoding="UTF-8"?><html xmlns="http://www.w3.org/1999/xhtml"><head><title>${escape(r.title)}</title></head><body><pre>${escape(r.text)}</pre></body></html>`});
      declarations.push(`<resource identifier="${r.identifier}" type="webcontent" href="${path}"><file href="${path}"/></resource>`);
    } else if(r.kind==='link') {
      files.push({path,text:`<?xml version="1.0" encoding="UTF-8"?><webLink xmlns="${CC_LINK_NS}"><title>${escape(r.title)}</title><url href="${escape(url(r.url))}"/></webLink>`});
      declarations.push(`<resource identifier="${r.identifier}" type="imswl_xmlv1p3"><file href="${path}"/></resource>`);
    } else throw Error('Unsupported resource kind');
  }
  let count=0;const seen=new Set<object>();
  function emit(item:CartridgeItem,depth=0):string {
    if(!item||seen.has(item)||depth>25||++count>200)throw Error('Invalid item hierarchy');keys(item,['identifier','title','resourceId','children']);seen.add(item);id(item.identifier);label(item.title);if(item.resourceId)id(item.resourceId);if(!Array.isArray(item.children))throw Error('Invalid item children');
    return `<item identifier="${item.identifier}"${item.resourceId?` identifierref="${item.resourceId}"`:''}><title>${escape(item.title)}</title>${item.children.map(c=>emit(c,depth+1)).join('')}</item>`;
  }
  if(!Array.isArray(content.items))throw Error('Invalid organization');
  files.unshift({path:'imsmanifest.xml',text:`<?xml version="1.0" encoding="UTF-8"?><manifest xmlns="${CC_NS}" identifier="${content.identifier}"><metadata><schema>IMS Common Cartridge</schema><schemaversion>1.3.0</schemaversion><lom xmlns="${LOM}"><general><title><string>${escape(content.title)}</string></title></general></lom></metadata><organizations><organization identifier="org" structure="rooted-hierarchy"><item identifier="org_root">${content.items.map(i=>emit(i)).join('')}</item></organization></organizations><resources>${declarations.join('')}</resources></manifest>`});
  inspect(files);return writeExchangeZip(files);
}
