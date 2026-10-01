const header=document.getElementById('siteHeader');
const menuBtn=document.getElementById('menuBtn');
const mobileMenu=document.getElementById('mobileMenu');
const mobileCta=document.getElementById('mobileCta');
const finalCta=document.getElementById('finalCta');
const threeNumber=document.getElementById('threeNumber');

menuBtn?.addEventListener('click',()=>{const open=!mobileMenu.classList.contains('open');mobileMenu.classList.toggle('open',open);menuBtn.classList.toggle('open',open);menuBtn.setAttribute('aria-expanded',String(open));menuBtn.setAttribute('aria-label',open?'Fechar menu':'Abrir menu')});
document.querySelectorAll('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>{mobileMenu.classList.remove('open');menuBtn.classList.remove('open');menuBtn.setAttribute('aria-expanded','false')}));

const onScroll=()=>{header.classList.toggle('scrolled',window.scrollY>36);if(threeNumber&&window.innerWidth>900){const r=threeNumber.getBoundingClientRect();const p=Math.max(-1,Math.min(1,(innerHeight/2-r.top)/innerHeight));threeNumber.style.transform=`translate3d(0,${p*9}px,0)`}if(window.innerWidth<=640&&mobileCta&&finalCta){const top=finalCta.getBoundingClientRect().top;mobileCta.classList.toggle('visible',window.scrollY>innerHeight*.72&&top>innerHeight*.82)}};
window.addEventListener('scroll',onScroll,{passive:true});onScroll();

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');observer.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const stage=document.getElementById('movementStage');
const cards=[...document.querySelectorAll('.movement-card')];
const counter=document.getElementById('movementCounter');
const labels=['Controle','Precisão','Fluidez'];
let active=0,dragging=false,startX=0,dragX=0;
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
function renderMovement(animate=true){
  if(!stage||window.innerWidth>640)return;
  const w=Math.max(stage.clientWidth*.68,1);const progress=clamp(-dragX/w,-.92,.92);
  cards.forEach((card,index)=>{let slot=(index-active+cards.length)%cards.length;if(progress<0&&slot===cards.length-1)slot=-1;const pos=slot-progress;const x=pos*61;const y=pos<0?14+Math.abs(pos)*48:14-pos*42;const rot=pos*5;const scale=1-Math.min(Math.abs(pos),2)*.045;const opacity=pos<0?Math.max(.25,1+pos*.7):Math.max(.45,1-Math.max(pos-1,0)*.32);card.style.transition=animate?'transform .65s var(--ease), opacity .5s ease':'none';card.style.zIndex=String(30-Math.round(Math.abs(pos)*10));card.style.opacity=String(opacity);card.style.transform=`translate3d(${x}%,${y}px,0) rotate(${rot}deg) scale(${scale})`});
  if(counter)counter.textContent=`0${active+1} / 03 · ${labels[active]}`;
}
function move(d){active=(active+d+cards.length)%cards.length;dragX=0;renderMovement(true)}
stage?.addEventListener('pointerdown',e=>{if(innerWidth>640)return;dragging=true;startX=e.clientX;stage.setPointerCapture?.(e.pointerId);renderMovement(false)});
stage?.addEventListener('pointermove',e=>{if(!dragging||innerWidth>640)return;dragX=e.clientX-startX;renderMovement(false)});
function finish(e){if(!dragging)return;dragging=false;if(Math.abs(dragX)>Math.min(72,stage.clientWidth*.18))active=(active+(dragX<0?1:-1)+cards.length)%cards.length;dragX=0;renderMovement(true);if(stage.hasPointerCapture?.(e.pointerId))stage.releasePointerCapture(e.pointerId)}
stage?.addEventListener('pointerup',finish);stage?.addEventListener('pointercancel',finish);stage?.addEventListener('keydown',e=>{if(e.key==='ArrowRight')move(1);if(e.key==='ArrowLeft')move(-1)});
document.getElementById('nextMovement')?.addEventListener('click',()=>move(1));document.getElementById('prevMovement')?.addEventListener('click',()=>move(-1));
window.addEventListener('resize',()=>{if(innerWidth<=640)renderMovement(true);else cards.forEach(c=>{c.style.transform='';c.style.opacity='';c.style.zIndex='';c.style.transition=''})});renderMovement(true);