import assert from 'node:assert/strict';
import { calculateCell, createWorkbookCalculator, evaluateWorkbook, validateWorkbookCellRules, workbookRangeCells, type Workbook } from '../src/lib/spreadsheet.ts';
import { calculateCellV1 } from '../src/lib/spreadsheetGradingV1.ts';
import { validateWorkbook } from '../src/lib/workbookTemplates.ts';
const b: Workbook = { engineVersion: 2, sheets: { Data: { A1: 10, A2: 20, A3: 'label', B1: 'x', B2: 'y', C1: 3, C2: 7 }, 'Results Sheet': {} }, namedRanges: { Amounts: { sheet: 'Data', range: 'A1:A3' }, Table: { sheet: 'Data', range: 'B1:C2' } } };
const calc = (formula: string) => { b.sheets['Results Sheet'].A1 = formula; return calculateCell(b, 'Results Sheet', 'A1'); };
assert.equal(calc('=SUM(Amounts)'),30);
assert.equal(calc('=AVERAGE(Data!A1:A3)'),15);
assert.equal(calc('=MIN(Amounts)+MAX(Amounts)+COUNT(Amounts)'),32);
assert.equal(calc('=IF(SUM(Amounts)>20,"over","under")'),'over');
assert.equal(calc('=IF(1,7,1/0)'),7);
assert.equal(calc('=AND(1,NOT(0),OR(0,2))'),1);
assert.equal(calc('=ROUND(-1.25,1)'),-1.3);
assert.equal(calc('=ABS(-4)+2^3'),12);
assert.equal(calc('=SUMIF(Data!A1:A2,">10")'),20);
assert.equal(calc('=SUMIF(Data!B1:B2,"y",Data!C1:C2)'),7);
assert.equal(calc('=COUNTIF(Amounts,">=10")'),2);
assert.equal(calc('=VLOOKUP("y",Table,2,FALSE)'),7);
assert.equal(calc('=Data!$A$1+Data!A$2'),30);
b.sheets['Results Sheet'].B2 = 4;
assert.equal(calc("='Results Sheet'!$B$2+Data!A1"),14);
assert.equal(calc('="Mixed Case"&" "&"text"'),'Mixed Case text');
assert.equal(calc('="a"="A"'),0);
assert.equal(calc('=1<>"1"'),1);
for(const formula of ['=EVAL("1")','=fetch("https://example.test")','=SUM(Data!A1:XFD1048576)','=Data!A2:A1','=VLOOKUP("x",Table,2,TRUE)','=ROUND(1,99)','=1/0','=2^9999','=IF(1,2)','=UnknownName','=SUM(A1:A1001)','=IF(1,2,process.exit())','=SUM(1,,2)','=SUM(1);alert(1)', '=Data!XFE1']) assert.throws(()=>calc(formula),undefined,formula);
assert.throws(()=>calc('='.repeat(1)+'('.repeat(70)+'1'+')'.repeat(70)),/limit/);
assert.throws(()=>calc('='+Array(600).fill('1').join('+')),/limit/);
assert.throws(()=>calc('=A1'),/Circular/);
b.sheets['Results Sheet'].A1='=SUM(Amounts)'; assert.equal(calculateCell(b,'Results Sheet','A1'),30);
b.sheets.Data.A1=40; assert.equal(calculateCell(b,'Results Sheet','A1'),60); // fresh dependencies, no stale cache
const old={sheets:{Sheet:{A1:'=SUM(1,2)'}}}; assert.throws(()=>calculateCell(old,'Sheet','A1')); assert.throws(()=>calculateCellV1(old,'Sheet','A1'));
assert.equal(validateWorkbook(old),true);
assert.equal(validateWorkbook({...b,engineVersion:3}),false);
assert.equal(validateWorkbook({...b,script:'alert(1)'}),false);
assert.equal(validateWorkbook({...b,namedRanges:{...b.namedRanges,amounts:{sheet:'Data',range:'A1'}}}),false);
assert.equal(validateWorkbook({...b,namedRanges:{A1:{sheet:'Data',range:'A1'}}}),false);
assert.equal(validateWorkbook({...b,namedRanges:{Bad:{sheet:'Missing',range:'A1'}}}),false);
assert.equal(validateWorkbook({...b,namedRanges:{Bad:{sheet:'Data',range:'A1:XFD1048576'}}}),false);
assert.equal(validateWorkbook({...b,namedRanges:JSON.parse('{"__proto__":{"sheet":"Data","range":"A1"}}')}),false);
assert.equal(validateWorkbook({sheets:b.sheets,namedRanges:b.namedRanges}),false);
assert.equal(workbookRangeCells('A1:B2').join(','),'A1,B1,A2,B2');
const constrained: Workbook={engineVersion:2,sheets:{Sheet:{A1:4,A2:'=A1/2',B1:'yes'}},validationRules:[{sheet:'Sheet',range:'A1:A2',kind:'integer',min:1,max:5},{sheet:'Sheet',range:'B1',kind:'list',values:['yes','no']}]};
assert.deepEqual(validateWorkbookCellRules(constrained),[]);
constrained.sheets.Sheet.A1=3; assert.match(validateWorkbookCellRules(constrained).join(' '),/A2/);
constrained.sheets.Sheet.A1=4; constrained.sheets.Sheet.B1=''; assert.match(validateWorkbookCellRules(constrained).join(' '),/B1/);
assert.deepEqual(validateWorkbookCellRules(constrained,['Sheet!A1']),[]);
constrained.validationRules![1].allowBlank=true; assert.deepEqual(validateWorkbookCellRules(constrained),[]);
for(const rules of [[{sheet:'Sheet',range:'A1',kind:'list',values:[]}],[{sheet:'Sheet',range:'A1',kind:'integer',min:10,max:1}],[{sheet:'Sheet',range:'A1',kind:'list',values:['x'],script:'evil'}]]) assert.equal(validateWorkbook({...constrained,validationRules:rules}),false);
// State-neutral synthetic fixtures, not a new course or official settlement form.
const closing:Workbook={engineVersion:2,sheets:{Scenario:{A1:1200,A2:30,A3:10},Closing:{A1:'=ROUND(Scenario!A1/Scenario!A2*Scenario!A3,2)',A2:100,A3:'=SUM(A1:A2)'}},namedRanges:{Charges:{sheet:'Closing',range:'A1:A2'}}};
assert.equal(evaluateWorkbook(closing).Closing.A3,500);
assert.equal(calculateCell({engineVersion:2,sheets:{Functions:{A1:3,A2:7,A3:'=IF(AVERAGE(A1:A2)=5,SUM(A1:A2),0)'}}},'Functions','A3'),10);
// Wide dependency and range work must be bounded; no huge allocations or recursion.
const chain:Workbook={engineVersion:2,sheets:{S:{}}}; for(let i=1;i<80;i++)chain.sheets.S['A'+i]='=A'+(i+1);chain.sheets.S.A80=1;assert.throws(()=>calculateCell(chain,'S','A1'),/depth limit/);
console.log('spreadsheet v2 formulas, bounds, legacy dispatch, validation, and reusable fixtures passed');

// A single grading/evaluation pass cannot reset its shared operation budget by
// asking for many cells, including cached or empty cells.
const boundedCalculator = createWorkbookCalculator({engineVersion:2,sheets:{S:{A1:1}}});
for(let i=0;i<100000;i++) assert.equal(boundedCalculator('S','A1'),1);
assert.throws(()=>boundedCalculator('S','A1'),/calculation limit/);
const legacyCalculator = createWorkbookCalculator({sheets:{S:{A1:'=1+2'}}});
assert.equal(legacyCalculator('S','A1'),3);
