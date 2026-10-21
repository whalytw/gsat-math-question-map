'use strict';
(() => {
 const tree=document.getElementById('question-tree');
 const marker=document.getElementById('reading-position');
 if(!tree||!marker)return;
 const page=document.getElementById('page-content');
 const main=document.querySelector('main');
 const bookLabel=document.getElementById('reading-book');
 const unitLabel=document.getElementById('reading-unit');
 const switchButton=document.getElementById('reading-side-switch');
 const headings=[...tree.querySelectorAll('.book, .unit')];
 const storageKey='gsat-map-reading-side';
 let side='right',pending=false,currentNode=null;
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
  const docked=window.matchMedia('(max-width:899px)').matches;
  const pageRect=page.getBoundingClientRect();
  const viewportTop=docked?pageRect.top:0;
  const viewportBottom=docked?pageRect.bottom:window.innerHeight;
  if(docked){marker.style.removeProperty('left');marker.style.removeProperty('right');}
  else{
   const rect=main.getBoundingClientRect(),styles=window.getComputedStyle(main);
   const gap=12,cardWidth=marker.offsetWidth||160;
   const edge=side==='right'
    ?rect.right-parseFloat(styles.paddingRight)+gap
    :rect.left+parseFloat(styles.paddingLeft)-gap-cardWidth;
   marker.style.left=Math.max(12,Math.min(edge,document.documentElement.clientWidth-cardWidth-12))+'px';
   marker.style.right='auto';
  }
  // Measure the real card center. Its fixed height prevents text wrapping
  // from moving the switching line back and forth at a chapter boundary.
  marker.hidden=false;
  const card=marker.getBoundingClientRect();
  const baseline=card.top+card.height/2;
  const treeRect=tree.getBoundingClientRect();
  let active=null;
  if(treeRect.bottom>viewportTop&&treeRect.top<viewportBottom){
   for(const node of headings){
    const isBook=node.classList.contains('book');
    const book=isBook?node:node.closest('.book');
    if(node.hidden||book.hidden||(!isBook&&!book.open))continue;
    const header=node.querySelector(':scope > summary');
    const rect=header.getBoundingClientRect();
    if(rect.height>0&&rect.top<=baseline)active={node,book,unit:isBook?null:node};
   }
  }
  if(!active){marker.hidden=true;currentNode=null;return;}
  if(currentNode!==active.node){
   bookLabel.textContent=active.book.querySelector(':scope > summary .book-title').textContent.replace(/\s+/g,' ').trim();
   unitLabel.textContent=active.unit
    ?active.unit.querySelector(':scope > summary .unit-title').textContent.trim()
    :'冊別概覽';
   marker.style.setProperty('--reading-color',active.book.style.getPropertyValue('--book-color'));
   currentNode=active.node;
  }
 }
 function schedule(){
  if(pending)return;
  pending=true;
  window.requestAnimationFrame(update);
 }
 switchButton.addEventListener('click',()=>setSide(side==='right'?'left':'right'));
 window.addEventListener('scroll',schedule,{passive:true});
 page.addEventListener('scroll',schedule,{passive:true});
 window.addEventListener('resize',schedule,{passive:true});
 window.addEventListener('pageshow',schedule);
 tree.addEventListener('toggle',schedule,true);
 tree.addEventListener('load',schedule,true);
 document.getElementById('year-filters').addEventListener('change',schedule);
 for(const id of ['select-all','select-none','expand-all','collapse-all']){
  document.getElementById(id).addEventListener('click',schedule);
 }
 if(typeof ResizeObserver!=='undefined'){
  const observer=new ResizeObserver(schedule);
  observer.observe(tree);observer.observe(marker);observer.observe(page);
 }
 setSide(side);
})();
