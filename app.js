(() => {
  'use strict';
  const catalog = Array.isArray(window.INFJ_CATALOG) ? window.INFJ_CATALOG : [];
  const skills = ['职业定位','价值表达','向上管理','边界与谈判','影响力与协作','带队与晋升'];
  const state = {q:'',skill:'',type:'',onlySaved:false,hideDone:false};
  const storeKey = 'infj-career-guide-v1';
  let persisted = {saved:[],done:[],tasks:[]};
  try { const raw = JSON.parse(localStorage.getItem(storeKey) || '{}');
    if (raw && typeof raw === 'object') for(const k of Object.keys(persisted)) if(Array.isArray(raw[k])) persisted[k]=raw[k].filter(x=>typeof x==='string');
  } catch(_) { /* localStorage may be unavailable in private browsers */ }
  const $ = sel => document.querySelector(sel);
  const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const has = (key,id) => persisted[key].includes(id);
  const save = () => { try { localStorage.setItem(storeKey,JSON.stringify(persisted)); } catch(_){} };
  const toggle = (key,id) => { persisted[key] = has(key,id) ? persisted[key].filter(x=>x!==id) : [...persisted[key],id]; save(); };
  const typeIcons = {'电影':'◈','电视剧':'▥','书籍':'▤','纪录片':'◎'};
  const results = () => catalog.filter(w => {
    const hay = [w.title,w.original,w.problem,w.insight,w.action,w.skill,w.type].join(' ').toLocaleLowerCase();
    return (!state.q || hay.includes(state.q.toLocaleLowerCase())) && (!state.skill || state.skill===w.skill) && (!state.type || state.type===w.type) && (!state.onlySaved || has('saved',w.id)) && (!state.hideDone || !has('done',w.id));
  });
  function renderChips(){
    $('#skillChips').innerHTML=['',...skills].map(s=>`<button type="button" data-skill="${esc(s)}" class="chip ${state.skill===s?'active':''}">${s?esc(s):'全部方向'}</button>`).join('');
    $('#skillFilter').value=state.skill;
  }
  function render(){
    const shown=results();
    $('#matchCount').textContent=`${shown.length} / ${catalog.length} 个结果`;
    $('#empty').hidden=shown.length!==0;
    $('#cards').innerHTML=shown.map((w,i)=>`<article class="work-card" data-id="${esc(w.id)}"><div class="card-top"><span class="work-type">${esc(typeIcons[w.type])} ${esc(w.type)}</span><span class="card-num">${String(catalog.indexOf(w)+1).padStart(2,'0')} / ${catalog.length}</span></div><div class="card-main" role="button" tabindex="0" data-open="${esc(w.id)}" aria-label="查看${esc(w.title)}的职场实践"><h3>${esc(w.title)}</h3><p class="original">${esc(w.original)}</p><p class="work-question">${esc(w.problem)}</p></div><div class="card-footer"><span class="skill-tag">↗ ${esc(w.skill)}</span><div class="card-buttons"><button type="button" data-save="${esc(w.id)}" class="icon-btn ${has('saved',w.id)?'active':''}" aria-pressed="${has('saved',w.id)}" title="收藏${esc(w.title)}">${has('saved',w.id)?'♥':'♡'}</button><button type="button" data-done="${esc(w.id)}" class="icon-btn ${has('done',w.id)?'active':''}" aria-pressed="${has('done',w.id)}" title="标记已完成">${has('done',w.id)?'☑':'☐'}</button></div></div></article>`).join('');
    renderChips();
  }
  const tasks7=['写下你想争取的下一个岗位，以及三个判断标准','整理近期三个贡献，补齐可核实的结果证据','挑一部作品，只学一个动作并写成一句行动计划','把一份工作汇报改成「结论—证据—请求」','向上级确认当前目标与晋升评价标准','对一项额外需求做优先级沟通，练习边界表达','复盘本周行动，预约一次正式职业发展沟通'];
  const tasks30=['第 1 周｜形成一页晋升证据清单：指标、结果、本人贡献、链接','第 2 周｜完成一次结构化工作汇报，收集听众反馈并改稿','第 3 周｜推动一次跨团队协作，记录目标、角色与最终产出','第 4 周｜准备谈薪/晋升方案：客观依据、目标、底线和替代选项'];
  function renderPlans(){
    for(const [key,tasks,container] of [['7',tasks7,'#plan7'],['30',tasks30,'#plan30']]){
      $(container).innerHTML=tasks.map((t,i)=>{let id=`${key}-${i+1}`,checked=has('tasks',id);return `<label class="plan-task ${checked?'checked':''}"><input type="checkbox" data-task="${id}" ${checked?'checked':''}><span>${esc(key==='7'?`DAY ${i+1} · ${t}`:t)}</span></label>`}).join('');
    }
  }
  function showDetail(id){
    const w=catalog.find(w=>w.id===id);if(!w)return;
    $('#detailContent').innerHTML=`<div class="dialog-inner"><button type="button" class="dialog-close" data-close aria-label="关闭详情">×</button><p class="dialog-eyebrow">${esc(w.type)} &nbsp;/&nbsp; ${esc(w.skill)}</p><h2 id="dialogTitle">${esc(w.title)}</h2><p class="dialog-en">${esc(w.original)}</p><div class="dialog-panel"><h3>01 · 你可能遇到的问题</h3><p>${esc(w.problem)}</p></div><div class="dialog-panel"><h3>02 · 值得借鉴的思路</h3><p>${esc(w.insight)}</p></div><div class="dialog-panel"><h3>03 · 今天就能做的事</h3><p>${esc(w.action)}</p></div><div class="dialog-panel"><h3>04 · 别学偏了</h3><p>${esc(w.caution)}</p></div><div class="dialog-actions"><button type="button" data-save="${esc(w.id)}" class="${has('saved',w.id)?'selected':''}">${has('saved',w.id)?'♥ 已收藏':'♡ 加入收藏'}</button><button type="button" data-done="${esc(w.id)}" class="${has('done',w.id)?'selected':''}">${has('done',w.id)?'☑ 已完成':'☐ 标记完成'}</button><button type="button" data-copy="${esc(w.id)}">复制此作品链接 ↗</button></div><div class="detail-contact"><p>想把这条方法用到自己的晋升、谈薪或职业选择中？可以联系 Andy 讨论具体问题。</p><div class="detail-contact-actions"><button type="button" class="copy-wechat" data-copy-wechat>复制微信 AIPMAndy</button><a href="https://metaver.vip/services" target="_blank" rel="noopener noreferrer">查看官网咨询服务 ↗</a></div></div></div>`;
    const d=$('#detailDialog'); if(!d.open) d.showModal();
    d.querySelector('[data-close]').focus();
  }
  const change = (key,id) => { toggle(key,id);render(); const dlg=$('#detailDialog');if(dlg.open && catalog.some(w=>w.id===id))showDetail(id); };
  function clearFilters(){ state.q='';state.skill='';state.type='';state.onlySaved=false;state.hideDone=false;$('#search').value='';$('#typeFilter').value='';$('#onlySaved').checked=false;$('#hideDone').checked=false;render(); }
  function copyWechat(button){
    const id='AIPMAndy';
    const notify=()=>{
      const status=$('#copyStatus'); if(status)status.textContent='微信号已复制：'+id;
      const original=button.textContent;
      button.textContent='✓ 已复制：'+id;
      setTimeout(()=>{if(button.isConnected)button.textContent=original;},1900);
    };
    const fallback=()=>window.prompt('复制微信号，在微信里搜索添加：',id);
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(id).then(notify).catch(fallback);
    } else fallback();
  }
  document.addEventListener('click',event=>{
    const t=event.target.closest('[data-save],[data-done],[data-open],[data-close],[data-skill],[data-copy],[data-copy-wechat]');if(!t)return;
    if(t.hasAttribute('data-copy-wechat')){copyWechat(t);return;}
    if(t.dataset.save){change('saved',t.dataset.save);return;}
    if(t.dataset.done){change('done',t.dataset.done);return;}
    if(t.hasAttribute('data-open')){showDetail(t.dataset.open);return;}
    if(t.hasAttribute('data-close')){$('#detailDialog').close();return;}
    if(t.hasAttribute('data-skill')){state.skill=t.dataset.skill;render();return;}
    if(t.hasAttribute('data-copy')){const url=location.href.split('#')[0].split('?')[0]+'#work='+encodeURIComponent(t.dataset.copy); if(navigator.clipboard?.writeText)navigator.clipboard.writeText(url).then(()=>{t.textContent='✓ 已复制';}).catch(()=>{window.prompt('复制链接：',url);});else window.prompt('复制链接：',url);}
  });
  document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-open]')){e.preventDefault();showDetail(e.target.dataset.open);}});
  $('#detailDialog').addEventListener('click',e=>{if(e.target===$('#detailDialog'))$('#detailDialog').close();});
  $('#search').addEventListener('input',e=>{state.q=e.target.value.trim();render();});
  $('#skillFilter').addEventListener('change',e=>{state.skill=e.target.value;render();});
  $('#typeFilter').addEventListener('change',e=>{state.type=e.target.value;render();});
  $('#onlySaved').addEventListener('change',e=>{state.onlySaved=e.target.checked;render();});
  $('#hideDone').addEventListener('change',e=>{state.hideDone=e.target.checked;render();});
  $('#resetBtn').addEventListener('click',clearFilters);
  $('#randomBtn').addEventListener('click',()=>{let pool=results();if(pool.length===0)pool=catalog;showDetail(pool[Math.floor(Math.random()*pool.length)].id);});
  $('#roadmap').addEventListener('change',e=>{if(e.target.dataset.task){toggle('tasks',e.target.dataset.task);renderPlans();}});
  $('#exportBtn').addEventListener('click',()=>{
    const titles=catalog.filter(w=>has('done',w.id)).map(w=>`- ${w.title}（${w.skill}）`);
    const tasks=[...tasks7.map((t,i)=>[String('7-'+(i+1)),t]),...tasks30.map((t,i)=>[String('30-'+(i+1)),t])].filter(([id])=>has('tasks',id)).map(([,v])=>'- '+v);
    const content=['# INFJ 职场成长记录','导出日期：'+new Date().toLocaleDateString('zh-CN'),'','## 已完成作品',...(titles.length?titles:['（暂无）']),'','## 已完成行动',...(tasks.length?tasks:['（暂无）']),'','数据只来自当前浏览器；结果不构成晋升保证。'].join('\n');
    const a=document.createElement('a'),url=URL.createObjectURL(new Blob([content],{type:'text/markdown;charset=utf-8'}));a.href=url;a.download='INFJ-职场成长记录.md';a.click();setTimeout(()=>URL.revokeObjectURL(url),2500);
  });
  render();renderPlans();
  if(location.hash.startsWith('#work=')){let id=decodeURIComponent(location.hash.slice(6));showDetail(id);}
})();
