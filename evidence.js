/* Local-first promotion evidence ledger. No network calls or external tracking. */
(function (global) {
  'use strict';
  const KEY = 'infj-career-evidence-v1';
  const FIELDS = ['date', 'project', 'contribution', 'outcome', 'source'];
  const MAX = 100;
  const safeUrl = (value) => {
    if (!value) return '';
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && url.hostname ? url.href : '';
    } catch (_) { return ''; }
  };
  const csvCell = (value) => {
    let s = String(value == null ? '' : value);
    /* Protect spreadsheet programs from CSV formula injection, including
       leading whitespace and control characters before =, +, -, @. */
    if (/^[\s\u0000-\u001f]*[=+\-@]/u.test(s)) s = "'" + s;
    return '"' + s.replace(/"/g, '""') + '"';
  };
  const toCsv = (rows) => [
    ['成果日期', '项目/主题', '本人贡献', '实际结果', '证据 URL'].map(csvCell).join(','),
    ...rows.map(row => FIELDS.map(k => csvCell(row[k])).join(','))
  ].join('\r\n') + '\r\n';
  const localDay = () => {
    const d = new Date();
    const f = n => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + f(d.getMonth() + 1) + '-' + f(d.getDate());
  };
  const validate = (input, today = localDay()) => {
    const row = {};
    const limits = { date: 10, project: 100, contribution: 600, outcome: 600, source: 1000 };
    for (const k of FIELDS) {
      row[k] = String(input[k] == null ? '' : input[k]).trim();
      if (row[k].length > limits[k]) throw new Error('输入太长，请缩短后重试。');
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(row.date) ||
        !Number.isFinite(Date.parse(row.date)) ||
        new Date(row.date).toISOString().slice(0, 10) !== row.date ||
        row.date > today) throw new Error('请选择真实、非未来的成果日期。');
    if (!row.project || !row.contribution || !row.outcome)
      throw new Error('请填写项目、本人贡献和实际结果；未知结果请如实注明。');
    if (row.source && !safeUrl(row.source))
      throw new Error('证据链接仅接受 HTTPS 完整地址。');
    row.source = safeUrl(row.source);
    return row;
  };
  const core = { safeUrl, csvCell, toCsv, validate, localDay };
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  if (typeof document === 'undefined') return;

  const $ = id => document.getElementById(id);
  const form = $('evidenceForm');
  if (!form) return;
  const status = $('status');
  let rows = [];
  function show(message, error = false) {
    status.textContent = message;
    status.className = error ? 'error' : 'ok';
  }
  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
      if (Array.isArray(raw)) {
        rows = raw.slice(0, MAX).filter(r => r && typeof r.id === 'string')
          .map(r => { try { return { id: r.id, ...validate(r) }; } catch (_) { return null; } })
          .filter(Boolean);
      }
    } catch (_) { show('无法读取本机记录，可能是隐私模式或存储不可用。', true); }
  }
  function persist(next) {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      rows = next;
      return true;
    } catch (_) {
      show('保存失败：浏览器本机存储不可用或容量已满。请及时导出已有记录。', true);
      return false;
    }
  }
  function render() {
    const q = $('search').value.trim().toLocaleLowerCase();
    const list = rows.filter(r => [r.project, r.contribution, r.outcome, r.date]
      .join(' ').toLocaleLowerCase().includes(q))
      .sort((a, b) => b.date.localeCompare(a.date));
    $('count').textContent = list.length + ' / ' + rows.length + ' 条（最多 ' + MAX + ' 条）';
    const host = $('entries');
    host.replaceChildren();
    if (!list.length) {
      const p = document.createElement('p');
      p.className = 'muted';
      p.textContent = rows.length ? '当前筛选没有结果。' : '暂无记录。先保存一条有权公开的真实工作成果。';
      host.appendChild(p);
    }
    for (const r of list) {
      const article = document.createElement('article');
      article.className = 'entry';
      const head = document.createElement('div');
      head.className = 'entry-title';
      const h = document.createElement('h3');
      h.textContent = r.project;
      const date = document.createElement('time');
      date.dateTime = r.date;
      date.textContent = r.date;
      head.append(h, date);
      const dl = document.createElement('dl');
      for (const [label, val] of [['本人贡献', r.contribution], ['实际结果', r.outcome]]) {
        const dt = document.createElement('dt'), dd = document.createElement('dd');
        dt.textContent = label;
        dd.textContent = val;
        dl.append(dt, dd);
      }
      if (r.source && safeUrl(r.source)) {
        const dt = document.createElement('dt'), dd = document.createElement('dd');
        const a = document.createElement('a');
        dt.textContent = '证据（用户填报）';
        a.textContent = '查看原始链接';
        a.href = safeUrl(r.source);
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        dd.appendChild(a);
        dl.append(dt, dd);
      }
      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'secondary danger';
      del.textContent = '删除这条';
      del.addEventListener('click', () => {
        if (window.confirm('只删除这条本地记录？此操作无法撤销。')) {
          if (persist(rows.filter(x => x.id !== r.id))) {
            render();
            show('该条本机记录已删除。');
          }
        }
      });
      article.append(head, dl, del);
      host.appendChild(article);
    }
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    try {
      const data = Object.fromEntries(new FormData(form).entries());
      const entry = validate({ date: data.when, ...data });
      if (rows.length >= MAX) throw new Error('最多保存 100 条。先导出并清理旧记录。');
      if (rows.some(r => FIELDS.every(k => r[k] === entry[k])))
        throw new Error('相同记录已存在，无需重复保存。');
      const id = String(Date.now()) + '-' + Math.random().toString(36).slice(2, 9);
      if (persist([...rows, { id, ...entry }])) {
        form.reset();
        render();
        show('已保存到当前浏览器。建议定期导出 CSV 备份。');
      }
    } catch (error) { show(error.message || '无法保存记录。', true); }
  });
  $('search').addEventListener('input', render);
  $('export').addEventListener('click', () => {
    if (!rows.length) return show('当前没有可导出的记录。', true);
    const csv = '\ufeff' + toCsv([...rows].sort((a, b) => b.date.localeCompare(a.date)));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'infj-career-evidence-' + localDay() + '.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    show('已生成本机 CSV，请妥善保管其中的工作信息。');
  });
  $('clear').addEventListener('click', () => {
    if (!rows.length) return show('目前没有记录。');
    if (!window.confirm('确认清空所有 ' + rows.length + ' 条本机记录？请先导出备份。')) return;
    if (persist([])) { render(); show('已清空本机台账。'); }
  });
  $('when').max = localDay();
  load();
  render();
})(typeof globalThis !== 'undefined' ? globalThis : this);
