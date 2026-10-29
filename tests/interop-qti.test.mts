import assert from 'node:assert/strict';
import { importQtiItem,exportQtiItem,evaluateQtiItem,questionToQtiItem,qtiItemToQuestion,qtiChoiceToBank,QTI_NAMESPACE,QTI_LIMITS,type QtiItem } from '../src/lib/interopQti.ts';
const choice: QtiItem={ id:'test_item',title:'Test only item',language:'en-US',prompt:'Select <this> & that.',kind:'choice',multiple:true,shuffle:false,choices:[{id:'A',text:'First & foremost'},{id:'B',text:'Other'},{id:'C',text:'Last'}],correct:['A','C'] };
const source=exportQtiItem(choice);
assert.deepEqual(importQtiItem(source),choice);
assert.equal(evaluateQtiItem(choice,['C','A']),true);
assert.equal(evaluateQtiItem(choice,['A']),false);
assert.equal(evaluateQtiItem(choice,['A','A','C']),false);
assert.equal(evaluateQtiItem(choice,'A'),false);
const single:QtiItem={...choice,multiple:false,correct:['B']};
assert.deepEqual(importQtiItem(exportQtiItem(single)),single);
const text:QtiItem={id:'text_one',title:'Exact matching test',prompt:'Before ',kind:'text',suffix:' after.',correct:'Test.'};
assert.deepEqual(importQtiItem(exportQtiItem(text)),text);
assert.equal(evaluateQtiItem(text,'Test.'),true);
for(const invalid of ['test.','Test',' Test.','Test. ']) assert.equal(evaluateQtiItem(text,invalid),false);
assert.throws(()=>qtiItemToQuestion(text,'Test'),/native text grading/);
const native={id:'q1',topic:'Test',type:'choice' as const,stem:'Synthetic prompt',choices:['x','y'],answer:[1]};
assert.deepEqual(qtiItemToQuestion(questionToQtiItem(native,'Synthetic title'),'Test'),native);
assert.throws(()=>questionToQtiItem({...native,explanation:'Must not disappear'},'x'),/metadata/);
assert.throws(()=>questionToQtiItem({...native,answer:[0,0]},'x'),/identifiers/);
const bad = [
 source.replace(QTI_NAMESPACE,'https://example.invalid/qti'),
 source.replace('match_correct','map_response'),
 source.replace('adaptive="false"','adaptive="true"'),
 source.replace('shuffle="false"','shuffle="maybe"'),
 source.replace('max-choices="0"','max-choices="2"'),
 source.replace('<qti-prompt>','<qti-prompt onclick="alert(1)">'),
 source.replace('Select &lt;this&gt; &amp; that.','<script>alert(1)</script>'),
 source.replace('<qti-value>A</qti-value>','<qti-value>NO_SUCH_CHOICE</qti-value>'),
 source.replace('identifier="C"','identifier="A"'),
 source.replace('<qti-correct-response>','<qti-correct-response><qti-value>A</qti-value>'),
 source.replace('<qti-response-processing','<qti-mapping/><qti-response-processing'),
 source.replace('</qti-assessment-item>',''),
 '<?xml version="1.0"?><!DOCTYPE x [<!ENTITY ext SYSTEM "file:///etc/passwd">]>'+source.slice(source.indexOf('<qti-assessment-item')).replace('Other','&ext;'),
 source.replace('<qti-item-body>','<?unsafe url="https://example.invalid"?><qti-item-body>'),
 source.replace('title="Test only item"','title="Test only item" onload="bad"'),
 source.replace('<qti-simple-choice identifier="A">','<qti-simple-choice identifier="A" fixed="true">'),
 source.replace('First &amp; foremost','<img src="https://example.invalid/x"/>'),
];
for(const xml of bad) assert.throws(()=>importQtiItem(xml),/QTI/);
assert.throws(()=>importQtiItem(' '.repeat(QTI_LIMITS.bytes+1)),/byte limit/);
assert.throws(()=>exportQtiItem({...choice,unknown:true} as QtiItem),/unsupported item fields/);
assert.throws(()=>exportQtiItem({...choice,choices:[{id:'A',text:'x'}]}),/identifiers/);
assert.throws(()=>exportQtiItem({...choice,id:'../evil'}),/identifier/);
// Prefix aliases are accepted based on namespace identity, never the prefix spelling.
const prefixed=source.replaceAll('<qti-','<x:qti-').replaceAll('</qti-','</x:qti-').replace(`xmlns="${QTI_NAMESPACE}"`,`xmlns:x="${QTI_NAMESPACE}"`);
assert.deepEqual(importQtiItem(prefixed),choice);
console.log('QTI bounded exchange, exact preview, semantic rejection and adversarial tests passed');

const adapted = {...single,language:undefined,prompt:'Select the synthetic answer',choices:[{id:'A',text:'Alpha'},{id:'B',text:'Beta'},{id:'C',text:'Gamma'}]};
const bank=qtiChoiceToBank(adapted,'fresh_bank');
assert.equal(bank.questions[0].id,adapted.id);
assert.match(bank.description!,/local adaptation/);
assert.throws(()=>qtiChoiceToBank({...adapted,shuffle:true},'fresh'),/shuffling/);
assert.throws(()=>qtiChoiceToBank({...adapted,language:'en'},'fresh'),/language/);
assert.throws(()=>qtiChoiceToBank({...adapted,multiple:true},'fresh'),/multiple-selection/);
assert.throws(()=>qtiChoiceToBank({...adapted,prompt:'$x$'},'fresh'),/formatting/);
assert.throws(()=>qtiChoiceToBank(adapted,'__proto__'),/identifier/);
assert.throws(()=>questionToQtiItem({...native,stem:'$x$'}),/formatted/);
assert.deepEqual(importQtiItem(exportQtiItem({...text,title:'Line\nTwo',correct:'A\rB'})),{...text,title:'Line\nTwo',correct:'A\rB'});
const defaults=exportQtiItem(single).replace(' adaptive="false"','').replace(' time-dependent="false"','').replace(' shuffle="false"','').replace(' max-choices="1"','');
assert.deepEqual(importQtiItem(defaults),single);
// Independent XML fixture using the official BPIG 3.2.2 structure (plain p
// sibling before choice, omitted default attributes). All text is synthetic.
// https://www.imsglobal.org/spec/qti/v3p0/impl
const external=`<qti-assessment-item xmlns="http://www.imsglobal.org/xsd/imsqtiasi_v3p0" identifier="external_item" title="Synthetic external item" time-dependent="false">
<qti-response-declaration base-type="identifier" cardinality="single" identifier="RESPONSE"><qti-correct-response><qti-value>option_b</qti-value></qti-correct-response></qti-response-declaration>
<qti-outcome-declaration base-type="float" cardinality="single" identifier="SCORE"><qti-default-value><qti-value>0</qti-value></qti-default-value></qti-outcome-declaration>
<qti-item-body><p>Choose the second test option.</p><qti-choice-interaction response-identifier="RESPONSE"><qti-simple-choice identifier="option_a">First</qti-simple-choice><qti-simple-choice identifier="option_b">Second</qti-simple-choice></qti-choice-interaction></qti-item-body>
<qti-response-processing template="https://purl.imsglobal.org/spec/qti/v3p0/rptemplates/match_correct.xml"/></qti-assessment-item>`;
assert.deepEqual(importQtiItem(external),{id:'external_item',title:'Synthetic external item',prompt:'Choose the second test option.',kind:'choice',multiple:false,shuffle:false,choices:[{id:'option_a',text:'First'},{id:'option_b',text:'Second'}],correct:['option_b']});
console.log('Independent official-guide-shaped QTI fixture and adapted-copy restrictions passed');
