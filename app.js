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
    const qs=summary(item,q.label,'q-title');if(q.extra)qs.lastChild.append(node('span','q-extra',q.extra));
    const body=node('div','q-body');
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
    if(solution){
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
})();

