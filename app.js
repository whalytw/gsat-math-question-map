'use strict';
(() => {
 const data=window.QUESTION_MAP;
 if(!data){document.getElementById('empty-state').hidden=false;document.getElementById('empty-state').textContent='試題資料未載入，請確認 data.js 與 index.html 放在同一個資料夾。';return;}
 const solutions=window.QUESTION_SOLUTIONS;
 if(!solutions){document.getElementById('empty-state').hidden=false;document.getElementById('empty-state').textContent='詳解資料未載入，請確認新增的 solutions.js 與 index.html 放在同一個資料夾，並重新整理頁面。';return;}
 const colors=['#f8d5e2','#fbe0c7','#e5d9f5','#d6ebdd','#f7eab9','#d5e8f5'];
 const tree=document.getElementById('question-tree'), nav=document.getElementById('book-nav');
 const yearInputs=[...document.querySelectorAll('#year-filters input')], indexNodes=[];
 const node=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
 const makeDetails=(cls)=>{const e=node('details',cls);e.open=true;return e;};
 const summary=(parent,title,cls)=>{const s=node('summary');s.append(node('span','toggle-box'));s.firstChild.setAttribute('aria-hidden','true');s.append(node('span',cls,title));parent.append(s);return s;};
 const models=[];
 const questionTargets=new Map();
 const questionId=(bi,ui,key)=>'q-'+(bi+1)+'-'+(ui+1)+'-'+key;
 const overviewId=(bi,key)=>'overview-'+(bi+1)+'-'+key;
 data.books.forEach((book,bi)=>{
  const b=makeDetails('book');b.id='book-'+(bi+1);b.style.setProperty('--book-color',colors[bi]);
  const bs=summary(b,book.title,'book-title'),bc=node('span','node-count');bs.append(bc);
  const link=node('a','',book.title.replace(/\s*數學\s*\S+$/,''));link.href='#'+b.id;link.style.setProperty('--book-color',colors[bi]);link.addEventListener('click',()=>{b.open=true;});nav.append(link);
  const units=node('div','units');b.append(units);const um=[];
  book.units.forEach((unit,ui)=>{
   const u=makeDetails('unit');u.id=b.id+'-unit-'+(ui+1);const us=summary(u,unit.title,'unit-title'),uc=node('span','node-count');us.append(uc);
   const questions=node('div','questions');u.append(questions);const qm=[];
   unit.questions.forEach(q=>{
    const item=makeDetails('question');item.dataset.year=String(q.year);item.dataset.key=q.key;
    item.id=questionId(bi,ui,q.key);
    if(!questionTargets.has(bi+':'+q.key))questionTargets.set(bi+':'+q.key,{item,unit:u,book:b,q});
    const qs=summary(item,q.label,'q-title');if(q.extra)qs.lastChild.append(node('span','q-extra',q.extra));
    const body=node('div','q-body');
    const back=node('a','back-overview','↑ 回總表');back.href='#'+overviewId(bi,q.key);back.setAttribute('aria-label',q.label+'，回總表 '+book.title);body.append(back);
    q.blocks.forEach(block=>{
     if(block.type==='text'){const p=node('p',block.text==='題組共用題幹'||block.text==='前題條件'?'context-label':'',block.text);body.append(p);}
     else {const fig=node('figure');const img=node('img');img.src=block.src;img.alt=q.label+' 原卷題目或題組條件';img.loading='lazy';img.decoding='async';fig.append(img);body.append(fig);}
    });
    const solution=solutions.records[bi+':'+(ui+1)+':'+q.key];
    const answerDetails=node('details','solution');
    answerDetails.open=false;
    answerDetails.dataset.solutionFor=q.key;
    const answerSummary=summary(answerDetails,'查看本題詳解','solution-title');
    answerSummary.setAttribute('aria-label',q.label+'，'+book.title+'，'+unit.title+'，詳解');
    const content=node('div','solution-content');
    const richSolution=window.RICH_SOLUTIONS?.records[bi+':'+(ui+1)+':'+q.key];
    if(richSolution){
     // Build MathML/SVG only when requested, so hundreds of closed answers
     // don't slow down filtering or scrolling on phones and older computers.
     answerDetails.addEventListener('toggle',()=>{
      if(answerDetails.open&&!content.dataset.loaded){content.innerHTML=richSolution;content.dataset.loaded='true';}
     });
    }
    else if(solution){
     content.append(node('p','solution-scope',solution.scope));
     content.append(node('h4','','本單元切入'));
     content.append(node('p','solution-method',solution.method));
     if(solution.focus)content.append(node('p','solution-focus',solution.focus));
     content.append(node('h4','','解題步驟'));
     const steps=node('ol','solution-steps');
     solution.steps.forEach(text=>{const li=node('li');li.append(node('p','',text));steps.append(li);});
     content.append(steps);
     if(solution.diagram){const fig=node('figure','solution-diagram');const img=node('img');img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(solution.diagram);img.alt=q.label+' 詳解作圖：斜線為掃描棒掃過的區域 R';fig.append(img,node('figcaption','','作圖示意：斜線部分為所求區域 R。'));content.append(fig);}
     content.append(node('h4','','答案'),node('p','solution-answer',solution.answer));
    }else{
     content.append(node('p','','此單元詳解未載入，請確認 solutions.js 已完整更新。'));
    }
    answerDetails.append(content);body.append(answerDetails);
    const backBottom=back.cloneNode(true);backBottom.classList.add('back-overview-bottom');body.append(backBottom);
    item.append(body);questions.append(item);qm.push({el:item,data:q});
   });
   units.append(u);um.push({el:u,count:uc,questions:qm});
  });
  tree.append(b);models.push({el:b,count:bc,link,units:um});
 });
 const index=document.getElementById('paper-index');
 data.indices.forEach(paper=>{
  const p=node('section','index-paper');p.dataset.year=String(paper.year);p.append(node('h3','',paper.year+' 年 '+paper.track));
  const scroll=node('div','table-scroll');scroll.tabIndex=0;scroll.setAttribute('role','region');scroll.setAttribute('aria-label',paper.year+' 年 '+paper.track+' 索引表');
  const table=node('table'),head=node('thead'),body=node('tbody');
  paper.rows.forEach((row,i)=>{const tr=node('tr');row.forEach(txt=>{const cell=node(i===0?'th':'td','',txt);if(i===0)cell.scope='col';tr.append(cell);});(i===0?head:body).append(tr);});
  table.append(head,body);scroll.append(table);p.append(scroll);index.append(p);indexNodes.push(p);
 });
 function filter(){
  const selected=new Set(yearInputs.filter(e=>e.checked).map(e=>Number(e.value)));const unique=new Set();let total=0,unitCount=0;
  models.forEach(book=>{
   let bookCount=0;
   book.units.forEach(unit=>{
    let count=0;
    unit.questions.forEach(q=>{const show=selected.has(q.data.year);q.el.hidden=!show;if(show){count++;unique.add(q.data.key);}});
    unit.el.hidden=count===0;unit.count.textContent='共 '+count+' 題';bookCount+=count;if(count)unitCount++;
   });
   book.el.hidden=bookCount===0;book.link.hidden=bookCount===0;book.count.textContent='共 '+bookCount+' 題';total+=bookCount;
  });
  indexNodes.forEach(e=>{e.hidden=!selected.has(Number(e.dataset.year));});
  document.getElementById('index-section').hidden=selected.size===0;
  document.getElementById('empty-state').hidden=total!==0;
  document.getElementById('result-status').textContent='顯示 '+unique.size+' 道原題 · '+total+' 筆單元認列 · '+unitCount+' 個單元';
 }
 yearInputs.forEach(e=>e.addEventListener('change',filter));
 document.getElementById('select-all').addEventListener('click',()=>{yearInputs.forEach(e=>e.checked=true);filter();});
 document.getElementById('select-none').addEventListener('click',()=>{yearInputs.forEach(e=>e.checked=false);filter();});
 document.getElementById('expand-all').addEventListener('click',()=>{tree.querySelectorAll('details').forEach(d=>d.open=d.className!=='solution');});
 document.getElementById('collapse-all').addEventListener('click',()=>{tree.querySelectorAll('details').forEach(d=>d.open=false);});
 filter();
 // Native fragment links are permanent, shareable and work with Back/Forward.
 const overview=window.QUESTION_OVERVIEW;
 if(overview){
  const table=node('table','classification-table');const caption=node('caption','','110 至 115 年學測試題分類：依年度、卷別與冊別對照');table.append(caption);
  const head=node('thead'),hr=node('tr');const corner=node('th','','年度／卷別');corner.scope='col';hr.append(corner);
  overview.columns.forEach(bi=>{const th=node('th');th.scope='col';th.style.setProperty('--book-color',colors[bi]);th.append(node('span','',data.books[bi].title.replace(/\s*數學\s*\S+$/,'')),node('small','','數學 '+['1','2','3A','3B','4A','4B'][bi]));hr.append(th);});head.append(hr);table.append(head);
  const tbody=node('tbody');
  overview.rows.forEach(row=>{
   const tr=node('tr');tr.dataset.year=String(row.year);const th=node('th');th.scope='row';th.append(node('span','',row.year+' 年'),node('small','',row.track==='數學'?'未分卷':row.track.replace('數','數 ')));tr.append(th);
   row.cells.forEach(cell=>{
    const td=node('td');const wrap=node('div','overview-numbers');
    cell.questions.forEach(ref=>{const target=questionTargets.get(cell.book+':'+ref.key);if(!target)return;const a=node('a','question-number',ref.number);a.id=overviewId(cell.book,ref.key);a.href='#'+target.item.id;a.setAttribute('aria-label',row.year+' 年 '+row.track+' 第 '+ref.number+' 題，'+data.books[cell.book].title);wrap.append(a);});
    if(!cell.questions.length){wrap.textContent='—';wrap.classList.add('not-applicable');}td.append(wrap);tr.append(td);
   });tbody.append(tr);
  });table.append(tbody);document.getElementById('overview-table').append(table);
 }
 let lastHighlight;
 function goToFragment(){
  let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
  if(!id)return;const target=document.getElementById(id);if(!target)return;
  if(target.matches('.question')){
   const input=yearInputs.find(e=>e.value===target.dataset.year);
   if(input&&!input.checked){input.checked=true;filter();}
   let parent=target;while(parent&&parent!==tree){if(parent.tagName==='DETAILS')parent.open=true;parent=parent.parentElement;}
  }
  if(lastHighlight)lastHighlight.classList.remove('jump-highlight');
  target.classList.add('jump-highlight');lastHighlight=target;
  requestAnimationFrame(()=>{target.scrollIntoView({block:'start',inline:'nearest'});if(target.matches('.question'))target.querySelector(':scope > summary').focus({preventScroll:true});else if(target.matches('a'))target.focus({preventScroll:true});});
 }
 // An already-active fragment still needs reopening after the user collapses it.
 document.addEventListener('click',event=>{const a=event.target.closest('a[href^="#"]');if(a&&a.hash===location.hash){event.preventDefault();goToFragment();}});
 window.addEventListener('hashchange',goToFragment);goToFragment();
})();

