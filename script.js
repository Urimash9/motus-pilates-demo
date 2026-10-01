const header=document.getElementById('siteHeader');
const menuBtn=document.getElementById('menuBtn');
const mobileMenu=document.getElementById('mobileMenu');
const mobileCta=document.getElementById('mobileCta');
const finalCta=document.getElementById('finalCta');
const threeNumber=document.getElementById('threeNumber');

menuBtn?.addEventListener('click',()=>{
  const open=!mobileMenu.classList.contains('open');
  mobileMenu.classList.toggle('open',open);menuBtn.classList.toggle('open',open);
  menuBtn.setAttribute('aria-expanded',String(open));menuBtn.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');
});
document.querySelectorAll('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>{
  mobileMenu.classList.remove('open');menuBtn.classList.remove('open');menuBtn.setAttribute('aria-expanded','false');
}));

const onScroll=()=>{
  header?.classList.toggle('scrolled',window.scrollY>34);
  if(threeNumber&&window.innerWidth>900&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
    const r=threeNumber.getBoundingClientRect();
    const p=Math.max(-1,Math.min(1,(innerHeight/2-r.top)/innerHeight));
    threeNumber.style.transform=`translate3d(0,${p*8}px,0)`;
  }
  if(window.innerWidth<=640&&mobileCta&&finalCta){
    const top=finalCta.getBoundingClientRect().top;
    mobileCta.classList.toggle('visible',window.scrollY>innerHeight*.72&&top>innerHeight*.82);
  }
};
window.addEventListener('scroll',onScroll,{passive:true});onScroll();

const intent=document.querySelector('.intent-reveal');
if(intent){
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.22});
  io.observe(intent);
}

const stage=document.getElementById('movementStage');
const cards=[...document.querySelectorAll('.movement-card')];
const counter=document.getElementById('movementCounter');
const labels=['Controle','Precisão','Fluidez','Flexibilidade'];
let active=0,dragging=false,startX=0,dragX=0;
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

function slotFor(index){
  let d=(index-active+cards.length)%cards.length;
  if(d>cards.length/2)d-=cards.length;
  return d;
}
function renderMovement(animate=true){
  if(!stage||!cards.length)return;
  const mobile=window.innerWidth<=640;
  const width=Math.max(stage.clientWidth*(mobile?.7:.44),1);
  const progress=clamp(-dragX/width,-.95,.95);
  cards.forEach((card,index)=>{
    let slot=slotFor(index)-progress;
    let x,y,rot,scale,opacity,blur,z;
    if(mobile){
      x=slot*58;
      y=slot<0?Math.abs(slot)*54:slot* -43;
      rot=slot*5.4;
      scale=1-Math.min(Math.abs(slot),2)*.06;
      opacity=Math.abs(slot)>1.7?.12:1-Math.min(Math.abs(slot),1.8)*.19;
      blur=Math.max(0,Math.abs(slot)-1)*.7;
    }else{
      x=slot*57;
      y=slot===0?0:(slot>0?-54+Math.min(slot,2)*18:48+Math.abs(slot)*10);
      rot=slot*4.4;
      scale=1-Math.min(Math.abs(slot),2)*.075;
      opacity=Math.abs(slot)>1.8?.08:1-Math.min(Math.abs(slot),1.6)*.2;
      blur=Math.max(0,Math.abs(slot)-1)*.55;
    }
    z=40-Math.round(Math.abs(slot)*10);
    card.classList.toggle('dragging',dragging&&!animate);
    if(animate)card.style.transition='';else card.style.transition='none';
    card.style.zIndex=String(z);card.style.opacity=String(Math.max(opacity,.06));card.style.filter=`blur(${blur}px)`;
    card.style.transform=`translate3d(calc(-50% + ${x}%), calc(-50% + ${y}px), 0) rotate(${rot}deg) scale(${scale})`;
    card.setAttribute('aria-hidden',Math.abs(slot)>.55?'true':'false');
  });
  if(counter)counter.textContent=`0${active+1} / 04 · ${labels[active]}`;
}
function move(d){active=(active+d+cards.length)%cards.length;dragX=0;renderMovement(true)}
function finish(e){
  if(!dragging)return;dragging=false;
  const threshold=Math.min(72,(stage?.clientWidth||360)*.16);
  if(Math.abs(dragX)>threshold)active=(active+(dragX<0?1:-1)+cards.length)%cards.length;
  dragX=0;renderMovement(true);
  if(e&&stage?.hasPointerCapture?.(e.pointerId))stage.releasePointerCapture(e.pointerId);
}
stage?.addEventListener('pointerdown',e=>{dragging=true;startX=e.clientX;stage.setPointerCapture?.(e.pointerId);renderMovement(false)});
stage?.addEventListener('pointermove',e=>{if(!dragging)return;dragX=e.clientX-startX;renderMovement(false)});
stage?.addEventListener('pointerup',finish);stage?.addEventListener('pointercancel',finish);
stage?.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();move(1)}if(e.key==='ArrowLeft'){e.preventDefault();move(-1)}});
document.getElementById('nextMovement')?.addEventListener('click',()=>move(1));
document.getElementById('prevMovement')?.addEventListener('click',()=>move(-1));
window.addEventListener('resize',()=>renderMovement(true));
renderMovement(true);
