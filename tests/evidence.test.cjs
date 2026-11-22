const assert = require('node:assert/strict');
const {test} = require('node:test');
const {safeUrl, csvCell, toCsv, validate} = require('../evidence.js');
const row = {date:'2026-11-20',project:'交付 A',contribution:'负责上线交付',outcome:'数字尚待核实',source:''};
test('valid real entry preserves fields', () => assert.equal(validate(row,'2026-11-22').project,'交付 A'));
test('future dates cannot become past achievements', () => assert.throws(() => validate({...row,date:'2027-01-01'},'2026-11-22'),/日期/));
test('invalid calendar date is rejected', () => assert.throws(() => validate({...row,date:'2026-02-30'},'2026-11-22'),/日期/));
test('blank fields rejected', () => assert.throws(() => validate({...row,contribution:' '},'2026-11-22'),/填写/));
test('HTTPS evidence only', () => {
  assert.equal(safeUrl('https://example.org/a'),'https://example.org/a');
  assert.equal(safeUrl('javascript:alert(1)'),'');
  assert.throws(() => validate({...row,source:'http://example.org'},'2026-11-22'),/HTTPS/);
});
test('CSV fields with quotes and commas escaped', () => assert.equal(csvCell('a,"b"'),'"a,""b"""'));
test('formula-injection protection works for =,+,-,@ and whitespace', () => {
  for (const s of ['=1+1','  +SUM(A1)','\t-2','@cmd']) assert.ok(csvCell(s).startsWith('"\''));
});
test('CSV export includes a header and one real row', () => {
  const text = toCsv([row]);
  assert.equal(text.trim().split('\r\n').length,2);
  assert.match(text,/负责上线交付/);
  assert.match(text,/成果日期/);
});
