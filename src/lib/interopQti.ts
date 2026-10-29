import { SaxesParser } from 'saxes';
import type { Bank, Question } from './courseContentTypes';

/** Deliberately bounded QTI 3 item exchange profile, not a QTI certification claim.
 * No XML, scripts, URLs, response programs or imported learner results are executed.
 * Exact string items remain exchange items: the native text grader is intentionally
 * more forgiving and must not silently substitute for QTI match_correct semantics. */
export const QTI_NAMESPACE = 'http://www.imsglobal.org/xsd/imsqtiasi_v3p0';
export const QTI_MATCH_CORRECT = 'https://purl.imsglobal.org/spec/qti/v3p0/rptemplates/match_correct';
export const QTI_LIMITS = { bytes: 256 * 1024, nodes: 1000, depth: 12, text: 32000, choices: 100 } as const;
interface BaseItem { id: string; title: string; prompt: string; language?: string }
export type QtiItem = BaseItem & (
  { kind: 'choice'; multiple: boolean; shuffle: boolean; choices: { id: string; text: string }[]; correct: string[] }
  | { kind: 'text'; suffix: string; correct: string }
);
interface Node { name: string; attrs: Record<string,string>; children: Node[]; text: string; parts: (Node | string)[] }
const identifier = /^[A-Za-z_][A-Za-z0-9_.-]{0,99}$/;
const fail = (reason: string): never => { throw Error(`Unsupported or invalid QTI item: ${reason}`); };
const plainText = (value: unknown, name: string, empty = false): string => {
  if (typeof value !== 'string' || value.length > QTI_LIMITS.text || (!empty && !value.trim()) || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) return fail(name);
  return value;
};
const xmlEscape = (s: string) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;').replace(/\r/g,'&#13;').replace(/\n/g,'&#10;').replace(/\t/g,'&#9;');
function parse(source: string): Node {
  if (typeof source !== 'string' || new TextEncoder().encode(source).length > QTI_LIMITS.bytes) fail('byte limit');
  const stack: Node[] = []; let root: Node | undefined, count = 0;
  const parser = new SaxesParser({ xmlns: true });
  parser.on('error', () => fail('malformed XML'));
  parser.on('doctype', () => fail('document types and entities are forbidden'));
  parser.on('processinginstruction', () => fail('processing instructions are forbidden'));
  parser.on('opentag', tag => {
    if (++count > QTI_LIMITS.nodes || stack.length >= QTI_LIMITS.depth) fail('structure limit');
    if (tag.uri !== QTI_NAMESPACE) fail('element namespace');
    const attrs: Record<string,string> = Object.create(null);
    for (const a of Object.values(tag.attributes)) {
      if (a.uri === 'http://www.w3.org/2000/xmlns/') continue;
      if (a.uri === 'http://www.w3.org/2001/XMLSchema-instance' && a.local === 'schemaLocation' && stack.length === 0) continue;
      if (a.uri && !(a.uri === 'http://www.w3.org/XML/1998/namespace' && a.local === 'lang' && stack.length === 0)) fail('attribute namespace');
      attrs[a.uri ? 'xml:lang' : a.local] = a.value;
    }
    const n: Node = { name: tag.local, attrs, children: [], text: '', parts: [] };
    if (stack.length) { stack[stack.length - 1].children.push(n); stack[stack.length - 1].parts.push(n); } else { if (root) fail('multiple roots'); root = n; }
    stack.push(n);
  });
  const append = (text: string) => { if (stack.length) { const n = stack[stack.length - 1]; n.text += text; n.parts.push(text); if(n.text.length > QTI_LIMITS.text) fail('text limit'); } else if(text.trim()) fail('text outside root'); };
  parser.on('text', append); parser.on('cdata', append); parser.on('closetag', () => { stack.pop(); });
  parser.write(source).close();
  if (!root) return fail('missing root');
  return root;
}
function attrs(n: Node, permitted: string[], required: string[] = []) {
  if (Object.keys(n.attrs).some(k => !permitted.includes(k)) || required.some(k => n.attrs[k] === undefined)) fail(`${n.name} attributes`);
}
function children(n: Node, names: string[]) {
  if (n.text.trim() || n.children.map(x => x.name).join('|') !== names.join('|')) fail(`${n.name} content`);
}
function textOnly(n: Node, empty = false): string { attrs(n, []); if (n.children.length) fail('rich content is not supported'); return plainText(n.text, n.name, empty); }
function id(s: unknown): string { return typeof s === 'string' && identifier.test(s) ? s : fail('identifier'); }

export function importQtiItem(source: string): QtiItem {
  const root = parse(source);
  if (root.name !== 'qti-assessment-item') fail('assessment-item required');
  attrs(root, ['identifier','title','adaptive','time-dependent','xml:lang'], ['identifier','title']);
  if ((root.attrs.adaptive !== undefined && root.attrs.adaptive !== 'false') || (root.attrs['time-dependent'] !== undefined && root.attrs['time-dependent'] !== 'false')) fail('adaptive/timed items');
  children(root, ['qti-response-declaration','qti-outcome-declaration','qti-item-body','qti-response-processing']);
  const base: BaseItem = { id: id(root.attrs.identifier), title: plainText(root.attrs.title,'title'), prompt: '' };
  if (root.attrs['xml:lang'] !== undefined) { if(!/^[A-Za-z]{2,8}(?:-[A-Za-z0-9]{1,8})*$/.test(root.attrs['xml:lang'])) fail('language'); base.language = root.attrs['xml:lang']; }
  const response = root.children[0];
  attrs(response,['identifier','cardinality','base-type'],['identifier','cardinality','base-type']);
  if (response.attrs.identifier !== 'RESPONSE') fail('response identifier must be RESPONSE for match_correct');
  children(response,['qti-correct-response']);
  const correct = response.children[0]; attrs(correct,[]);
  if(correct.text.trim() || !correct.children.length || correct.children.some(x => x.name !== 'qti-value')) fail('correct response');
  const values = correct.children.map(x => textOnly(x));
  const outcome = root.children[1]; attrs(outcome,['identifier','cardinality','base-type'],['identifier','cardinality','base-type']);
  if(outcome.attrs.identifier !== 'SCORE' || outcome.attrs.cardinality !== 'single' || outcome.attrs['base-type'] !== 'float') fail('SCORE outcome');
  if(outcome.children.length) {
    children(outcome,['qti-default-value']); const def=outcome.children[0]; attrs(def,[]); children(def,['qti-value']);
    if(textOnly(def.children[0]) !== '0') fail('nonzero default score');
  } else children(outcome,[]);
  const processing = root.children[3]; attrs(processing,['template'],['template']); children(processing,[]);
  if(![QTI_MATCH_CORRECT, QTI_MATCH_CORRECT+'.xml'].includes(processing.attrs.template)) fail('only match_correct response processing is supported');
  const body = root.children[2]; attrs(body,[]);
  if(body.children.at(-1)?.name === 'qti-choice-interaction') {
    const leading=body.children.length===2;
    children(body,leading?['p','qti-choice-interaction']:['qti-choice-interaction']); const interaction=body.children[leading?1:0];
    attrs(interaction,['response-identifier','shuffle','max-choices','min-choices'],['response-identifier']);
    interaction.attrs.shuffle ??= 'false'; interaction.attrs['max-choices'] ??= '1';
    if(interaction.attrs['response-identifier'] !== 'RESPONSE' || !['true','false'].includes(interaction.attrs.shuffle) || (interaction.attrs['min-choices'] !== undefined && interaction.attrs['min-choices'] !== '0')) fail('choice constraints');
    const multiple = response.attrs.cardinality === 'multiple';
    if(response.attrs['base-type'] !== 'identifier' || !['single','multiple'].includes(response.attrs.cardinality) || interaction.attrs['max-choices'] !== (multiple ? '0' : '1')) fail('choice response semantics');
    if(interaction.text.trim() || (!leading && interaction.children[0]?.name !== 'qti-prompt') || interaction.children.slice(leading?0:1).some(x => x.name !== 'qti-simple-choice')) fail('choice content');
    base.prompt=textOnly(leading?body.children[0]:interaction.children[0]);
    const choices=interaction.children.slice(leading?0:1).map(n => { attrs(n,['identifier'],['identifier']); if(n.children.length) fail('rich choice content'); return { id:id(n.attrs.identifier),text:plainText(n.text,'choice text') }; });
    if(choices.length < 2 || choices.length > QTI_LIMITS.choices || new Set(choices.map(x=>x.id)).size !== choices.length || new Set(values).size !== values.length || values.some(v=>!choices.some(c=>c.id===v)) || (!multiple && values.length !== 1)) fail('choice identifiers/answers');
    return { ...base, kind:'choice', multiple, shuffle:interaction.attrs.shuffle==='true', choices,correct:values };
  }
  // Plain prompt, then one exact string response, then a plain suffix. No HTML
  // coercion or whitespace normalization is performed on either correct value.
  children(body,['p']);
  const paragraph=body.children[0]; attrs(paragraph,[]);
  if(paragraph.children.length!==1 || paragraph.children[0].name!=='qti-text-entry-interaction') fail('one inline text entry required');
  const interaction=paragraph.children[0]; const split=paragraph.parts.indexOf(interaction);
  base.prompt=plainText(paragraph.parts.slice(0,split).join(''),'prompt');
  const suffix=plainText(paragraph.parts.slice(split+1).join(''),'suffix',true);
  attrs(interaction,['response-identifier'],['response-identifier']); children(interaction,[]);
  if(interaction.attrs['response-identifier'] !== 'RESPONSE' || response.attrs.cardinality !== 'single' || response.attrs['base-type'] !== 'string' || values.length !== 1) fail('exact string response required');
  return { ...base,kind:'text',suffix,correct:values[0] };
}

export function exportQtiItem(item: QtiItem): string {
  // Round-trip through the same strict parser below also validates generated shape.
  if(!item || typeof item !== 'object') return fail('item');
  const common=['id','title','prompt','language','kind'];
  const keys=item.kind==='choice' ? [...common,'multiple','shuffle','choices','correct'] : [...common,'suffix','correct'];
  if(Object.keys(item).some(k=>!keys.includes(k))) fail('unsupported item fields');
  id(item.id); plainText(item.title,'title'); plainText(item.prompt,'prompt');
  let cardinality: string, type: string, correct: string[], body: string;
  if(item.kind==='choice') {
    if(typeof item.multiple !== 'boolean' || typeof item.shuffle !== 'boolean' || !Array.isArray(item.choices) || item.choices.length>QTI_LIMITS.choices || !Array.isArray(item.correct) || item.correct.length>QTI_LIMITS.choices) fail('choice shape');
    cardinality=item.multiple?'multiple':'single'; type='identifier'; correct=item.correct;
    body=`<qti-choice-interaction response-identifier="RESPONSE" shuffle="${item.shuffle}" max-choices="${item.multiple?0:1}"><qti-prompt>${xmlEscape(item.prompt)}</qti-prompt>${item.choices.map(c=>{ if(Object.keys(c).some(k=>!['id','text'].includes(k))) fail('choice fields'); return `<qti-simple-choice identifier="${xmlEscape(id(c.id))}">${xmlEscape(plainText(c.text,'choice'))}</qti-simple-choice>`; }).join('')}</qti-choice-interaction>`;
  } else if(item.kind==='text') { cardinality='single'; type='string'; correct=[plainText(item.correct,'correct')]; body=`<p>${xmlEscape(item.prompt)}<qti-text-entry-interaction response-identifier="RESPONSE"/>${xmlEscape(plainText(item.suffix,'suffix',true))}</p>`; }
  else return fail('interaction kind');
  const source=`<?xml version="1.0" encoding="UTF-8"?>\n<qti-assessment-item xmlns="${QTI_NAMESPACE}" identifier="${xmlEscape(item.id)}" title="${xmlEscape(item.title)}" adaptive="false" time-dependent="false"${item.language===undefined?'':` xml:lang="${xmlEscape(item.language)}"`}><qti-response-declaration identifier="RESPONSE" cardinality="${cardinality}" base-type="${type}"><qti-correct-response>${correct.map(v=>`<qti-value>${xmlEscape(plainText(v,'correct'))}</qti-value>`).join('')}</qti-correct-response></qti-response-declaration><qti-outcome-declaration identifier="SCORE" cardinality="single" base-type="float"/><qti-item-body>${body}</qti-item-body><qti-response-processing template="${QTI_MATCH_CORRECT}"/></qti-assessment-item>`;
  importQtiItem(source); return source;
}

/** Preview only; does not create academic evidence or native grades. */
export function evaluateQtiItem(item: QtiItem, response: string | readonly string[]): boolean {
  const checked=importQtiItem(exportQtiItem(item));
  if(checked.kind==='text') return typeof response==='string' && response===checked.correct;
  if(!Array.isArray(response) || new Set(response).size!==response.length || response.some(v=>typeof v!=='string')) return false;
  return response.length===checked.correct.length && response.every(v=>checked.correct.includes(v));
}

/** Author-approved choice projection only. Caller must preserve title/identity in
 * its exchange envelope; neither import nor conversion grants installation trust. */
export function qtiItemToQuestion(item: QtiItem, topic: string): Question {
  const checked=importQtiItem(exportQtiItem(item));
  if(checked.kind!=='choice') return fail('native text grading is not exact QTI string matching; keep this item in exchange preview');
  if(!/^[A-Za-z0-9_-]{1,100}$/.test(checked.id)) fail('external identifier needs explicit local mapping');
  return {id:checked.id,topic:plainText(topic,'topic'),type:'choice',stem:checked.prompt,choices:checked.choices.map(c=>c.text),answer:checked.correct.map(c=>checked.choices.findIndex(x=>x.id===c))};
}
export function questionToQtiItem(question: Question, title: string = question.topic): QtiItem {
  if(Object.keys(question).some(k=>!['id','topic','type','stem','choices','answer'].includes(k))) fail('native question has metadata/media/explanation that this QTI profile cannot preserve');
  if([question.stem,...(question.choices??[])].some(t=>typeof t!=='string'||/[`$\\<>]|!?\[[^\]]*\]\(|(?:^|\n)\s*[#>*]|\*\*|__/.test(t))) fail('formatted native text needs explicit plain-text adaptation');
  if(question.type!==undefined && question.type!=='choice') fail('only native choice questions can be exported without changing grading');
  if(!Array.isArray(question.choices)||!Array.isArray(question.answer)||question.answer.some(i=>!Number.isInteger(i)||i<0||i>=question.choices.length)) fail('native answers');
  const item: QtiItem={id:question.id,title,prompt:question.stem,kind:'choice',multiple:question.answer.length>1,shuffle:false,choices:question.choices.map((text,i)=>({id:`choice_${i+1}`,text})),correct:question.answer.map(i=>`choice_${i+1}`)};
  return importQtiItem(exportQtiItem(item));
}

/** Explicit new local adaptation, not a lossless QTI installation. The caller must
 * obtain review/confirmation and retain the original exchange artifact separately. */
export function qtiChoiceToBank(item: QtiItem, newBankId: string): Bank {
  if(!/^[A-Za-z0-9_-]{1,100}$/.test(newBankId) || ['__proto__','constructor','prototype'].includes(newBankId)) fail('new local bank identifier');
  const checked=importQtiItem(exportQtiItem(item));
  if(checked.kind!=='choice') return fail('exact text items cannot become native bank questions');
  if(checked.shuffle) fail('required QTI choice shuffling cannot be enforced by the native bank');
  if(checked.multiple && checked.correct.length===1) fail('multiple-selection mode with one correct answer cannot be preserved by native choice controls');
  if(checked.language) fail('QTI item language cannot be preserved by the native bank');
  const question=qtiItemToQuestion(checked,checked.title);
  if([question.stem,...question.choices].some(t=>/[`$\\<>]|!?\[[^\]]*\]\(|(?:^|\n)\s*[#>*]|\*\*|__/.test(t))) fail('plain QTI text would be interpreted as native formatting');
  return {format:'examiner-bank',version:1,id:newBankId,title:checked.title,description:`Reviewed local adaptation of QTI item ${checked.id}. Choice identifiers become local indices; native study settings may reorder choices. Keep the original QTI XML for lossless exchange. This copy is not a signed or verified course.`,sections:[],exam:{questionCount:1,timeLimitMinutes:1,passingPercent:100},questions:[question]};
}
