'use strict';
(() => {
 const tree=document.getElementById('question-tree');
 const marker=document.getElementById('reading-position');
 if(!tree||!marker)return;
 const bookLabel=document.getElementById('reading-book');
 const unitLabel=document.getElementById('reading-unit');
 const switchButton=document.getElementById('reading-side-switch');
 const questions=[...tree.querySelectorAll('.question')];
 const storageKey='gsat-map-reading-side';
 let side='right',pending=false,currentUnit=null;
 try{if(localStorage.getItem(storageKey)==='left')side='left';}catch(_){}
 function setSide(next){
  side=next;
  document.body.dataset.readingSide=side;
  switchButton.textContent=side==='right'?'← 移到左側':'移到右側 →';
  switchButton.setAttribute('aria-label','將閱讀位置標記移到'+(side==='right'?'左':'右')+'側');
  try{localStorage.setItem(storageKey,side);}catch(_){}
  schedule();
 }
 function update(){
  pending=false;
  const viewportHeight=window.innerHeight;
  let active=null;
  for(const question of questions){
   if(question.hidden)continue;
   const rect=question.getBoundingClientRect();
   if(rect.height>0&&rect.bottom>0&&rect.top<viewportHeight){
    const unit=question.closest('.unit'),book=question.closest('.book');
    // A closed ancestor can suppress painting while descendants retain layout boxes.
    if(!unit||!book||!unit.open||!book.open||unit.hidden||book.hidden)continue;
    active={unit,book};break;
   }
  }
  if(!active){marker.hidden=true;currentUnit=null;return;}
  if(currentUnit!==active.unit){
   bookLabel.textContent=active.book.querySelector(':scope > summary .book-title').textContent.replace(/\s+/g,' ').trim();
   unitLabel.textContent=active.unit.querySelector(':scope > summary .unit-title').textContent.trim();
   marker.style.setProperty('--reading-color',active.book.style.getPropertyValue('--book-color'));
   currentUnit=active.unit;
  }
  marker.hidden=false;
 }
 function schedule(){
  if(pending)return;
  pending=true;
  window.requestAnimationFrame(update);
 }
 switchButton.addEventListener('click',()=>setSide(side==='right'?'left':'right'));
 window.addEventListener('scroll',schedule,{passive:true});
 window.addEventListener('resize',schedule,{passive:true});
 window.addEventListener('pageshow',schedule);
 tree.addEventListener('toggle',schedule,true);
 tree.addEventListener('load',schedule,true);
 document.getElementById('year-filters').addEventListener('change',schedule);
 for(const id of ['select-all','select-none','expand-all','collapse-all']){
  document.getElementById(id).addEventListener('click',schedule);
 }
 if(typeof ResizeObserver!=='undefined')new ResizeObserver(schedule).observe(tree);
 setSide(side);
})();