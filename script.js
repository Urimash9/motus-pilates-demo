const header=document.getElementById('siteHeader');
const menuBtn=document.getElementById('menuBtn');
const mobileMenu=document.getElementById('mobileMenu');
const mobileCta=document.getElementById('mobileCta');
const finalCta=document.getElementById('finalCta');

menuBtn?.addEventListener('click',()=>{
  const open=!mobileMenu.classList.contains('open');
  mobileMenu.classList.toggle('open',open);
  menuBtn.classList.toggle('open',open);
  menuBtn.setAttribute('aria-expanded',String(open));
});
document.querySelectorAll('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>{
  mobileMenu.classList.remove('open');menuBtn.classList.remove('open');menuBtn.setAttribute('aria-expanded','false');
}));

function onScroll(){
  header?.classList.toggle('scrolled',scrollY>24);
  if(innerWidth<=640&&mobileCta&&finalCta){
    const top=finalCta.getBoundingClientRect().top;
    mobileCta.classList.toggle('visible',scrollY>innerHeight*.7&&top>innerHeight*.8);
  }
}
addEventListener('scroll',onScroll,{passive:true});onScroll();

const benefits=[
  ['01','Força','Construção gradual de estabilidade e controle para os movimentos do dia a dia.'],
  ['02','Mobilidade','Prática que explora amplitudes de movimento com atenção e respeito ao corpo.'],
  ['03','Equilíbrio','Exercícios que estimulam coordenação, estabilidade e segurança corporal.'],
  ['04','Postura','Mais percepção sobre alinhamentos e hábitos durante a rotina.'],
  ['05','Consciência corporal','Uma relação mais presente entre respiração, atenção e movimento.']
];
const bNum=document.getElementById('benefitNumber');
const bTitle=document.getElementById('benefitTitle');
const bText=document.getElementById('benefitText');
const bPanel=document.getElementById('benefitActive');
const orbit=document.querySelector('.benefits-orbit');
const dots=[...document.querySelectorAll('.benefit-dot')];
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const baseAngles=[210,300,20,92,150].map(v=>v*Math.PI/180);
const trackType=[0,1,0,1,0];
let orbitStart=performance.now();
let pauseUntil=0;

function selectBenefit(i){
  dots.forEach((x,j)=>{x.classList.toggle('is-active',j===i);x.setAttribute('aria-selected',String(j===i))});
  bPanel?.classList.add('is-changing');
  setTimeout(()=>{
    if(bNum)bNum.textContent=benefits[i][0];
    if(bTitle)bTitle.textContent=benefits[i][1];
    if(bText)bText.textContent=benefits[i][2];
    bPanel?.classList.remove('is-changing');
  },140);
  pauseUntil=performance.now()+2200;
}
dots.forEach((btn,i)=>{
  btn.setAttribute('role','tab');
  btn.setAttribute('aria-selected',String(i===0));
  btn.addEventListener('click',()=>selectBenefit(i));
  btn.addEventListener('keydown',e=>{
    if(e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault();const n=(i+1)%dots.length;dots[n].focus();selectBenefit(n)}
    if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();const n=(i-1+dots.length)%dots.length;dots[n].focus();selectBenefit(n)}
  });
});
function renderOrbit(now){
  if(!orbit||!dots.length)return;
  const r=orbit.getBoundingClientRect();
  const isMobile=innerWidth<=640;
  const outer={rx:r.width*(isMobile?.38:.36),ry:r.height*(isMobile?.23:.25)};
  const inner={rx:r.width*(isMobile?.25:.22),ry:r.height*(isMobile?.39:.40)};
  const elapsed=(now-orbitStart)/1000;
  const t=reduced||now<pauseUntil?0:elapsed*.07;
  dots.forEach((dot,i)=>{
    const a=baseAngles[i]+t*(i%2===0?1:-1);
    const rad=trackType[i]===0?outer:inner;
    const x=Math.cos(a)*rad.rx;
    const y=Math.sin(a)*rad.ry;
    dot.style.transform=`translate(-50%,-50%) translate(${x}px,${y}px)`;
  });
  if(!reduced)requestAnimationFrame(renderOrbit);
}
requestAnimationFrame(renderOrbit);

const motionCards=[...document.querySelectorAll('.motion-card')];
const motionCounter=document.getElementById('movementCounter');
const motionLabels=['Controle','Precisão','Fluidez','Flexibilidade'];
const stage=document.getElementById('movementStage');
let active=0,startX=null,motionBusy=false;

function circularDelta(i,a,n){let d=i-a;if(d>n/2)d-=n;if(d<-n/2)d+=n;return d}
function motionPosition(delta){
  const mobile=innerWidth<=640;
  const tablet=innerWidth<=900;
  const x=delta*(mobile?285:tablet?430:540);
  const abs=Math.abs(delta);
  return {
    x,
    y:abs*(mobile?13:22),
    z:abs===0?42:0,
    scale:abs===0?1:abs===1?(mobile?.84:.8):.7,
    opacity:abs===0?1:abs===1?(mobile?.48:.38):.025,
    blur:abs===0?0:abs===1?.65:2,
    rot:delta*(mobile?2.2:3.4)
  };
}
function renderMotion(){
  const n=motionCards.length;
  motionCards.forEach((card,i)=>{
    const d=circularDelta(i,active,n),p=motionPosition(d),abs=Math.abs(d);
    card.style.zIndex=String(30-abs*6);
    card.style.opacity=String(p.opacity);
    card.style.filter=`blur(${p.blur}px)`;
    card.style.transform=`translate3d(calc(-50% + ${p.x}px),calc(-50% + ${p.y}px),${p.z}px) scale(${p.scale}) rotate(${p.rot}deg)`;
    card.setAttribute('aria-hidden',String(abs!==0));
  });
  if(motionCounter)motionCounter.textContent=`0${active+1} / 04 · ${motionLabels[active]}`;
}
async function moveMotion(dir){
  if(motionBusy||motionCards.length<2)return;
  motionBusy=true;
  const n=motionCards.length;
  const outgoing=motionCards[active];
  const next=(active+dir+n)%n;
  const incoming=motionCards[next];
  const mobile=innerWidth<=640;
  const tablet=innerWidth<=900;
  const side=mobile?285:tablet?430:540;
  const outX=dir>0?-side*.82:side*.82;
  const inX=dir>0?side:-side;
  const duration=reduced?360:820;
  incoming.style.zIndex='38';incoming.style.opacity=mobile?'.48':'.38';incoming.style.filter='blur(.65px)';
  outgoing.style.zIndex='42';
  const outAnim=outgoing.animate([
    {transform:'translate3d(-50%,-50%,42px) scale(1) rotateY(0deg) rotateZ(0deg)',filter:'blur(0)',opacity:1},
    {transform:reduced?`translate3d(calc(-50% + ${outX*.42}px),-50%,20px) scale(.96)`: `translate3d(calc(-50% + ${outX*.23}px),calc(-50% - 18px),54px) scale(.985) rotateY(${dir>0?-7:7}deg) rotateZ(${dir>0?-1.2:1.2}deg) skewY(${dir>0?-.7:.7}deg)`,offset:.3,opacity:.96},
    {transform:reduced?`translate3d(calc(-50% + ${outX}px),-50%,0) scale(.9)`: `translate3d(calc(-50% + ${outX*.64}px),calc(-50% - 4px),22px) scale(.91) rotateY(${dir>0?-14:14}deg) rotateZ(${dir>0?-3:3}deg) skewY(${dir>0?-1.5:1.5}deg)`,offset:.68,opacity:.52},
    {transform:`translate3d(calc(-50% + ${outX}px),calc(-50% + ${mobile?13:24}px),0) scale(${mobile?.84:.8}) rotateY(0deg) rotateZ(${dir>0?-3.4:3.4}deg)`,filter:'blur(.65px)',opacity:mobile?.48:.38}
  ],{duration,easing:'cubic-bezier(.2,.68,.22,1)',fill:'forwards'});
  const inAnim=incoming.animate([
    {transform:`translate3d(calc(-50% + ${inX}px),calc(-50% + ${mobile?13:24}px),0) scale(${mobile?.84:.8}) rotateZ(${dir>0?2.2:-2.2}deg)`,opacity:mobile?.48:.38,filter:'blur(.65px)'},
    {transform:reduced?`translate3d(calc(-50% + ${inX*.25}px),-50%,28px) scale(.98)`: `translate3d(calc(-50% + ${inX*.32}px),calc(-50% - 12px),48px) scale(.97) rotateY(${dir>0?6:-6}deg) rotateZ(${dir>0?.7:-.7}deg)`,offset:.62,opacity:.9,filter:'blur(.1px)'},
    {transform:'translate3d(-50%,-50%,42px) scale(1) rotateY(0deg) rotateZ(0deg)',opacity:1,filter:'blur(0)'}
  ],{duration,easing:'cubic-bezier(.2,.68,.22,1)',fill:'forwards'});
  await Promise.allSettled([outAnim.finished,inAnim.finished]);
  active=next;outAnim.cancel();inAnim.cancel();renderMotion();motionBusy=false;
}
document.getElementById('prevMovement')?.addEventListener('click',()=>moveMotion(-1));
document.getElementById('nextMovement')?.addEventListener('click',()=>moveMotion(1));
stage?.addEventListener('pointerdown',e=>{if(motionBusy)return;startX=e.clientX;stage.setPointerCapture?.(e.pointerId)});
stage?.addEventListener('pointerup',e=>{if(startX==null)return;const dx=e.clientX-startX;if(Math.abs(dx)>38)moveMotion(dx<0?1:-1);startX=null});
stage?.addEventListener('pointercancel',()=>{startX=null});
stage?.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();moveMotion(1)}if(e.key==='ArrowLeft'){e.preventDefault();moveMotion(-1)}});
addEventListener('resize',()=>{renderMotion();if(reduced)renderOrbit(performance.now())});
renderMotion();

// Build 01.5 — refino exclusivo da assinatura M na base da Hero.
// A curva deixa de ser uma wave/bloc genérico e passa a ter quatro movimentos claros:
// subida longa, primeiro pico, vale central marcado, segundo pico dominante e saída estabilizada.
const heroSignature=document.querySelector('.hero-signature');
if(heroSignature){
  heroSignature.setAttribute('viewBox','0 0 1440 180');
  const fill=heroSignature.querySelector('.m-fill');
  const thread=heroSignature.querySelector('.m-thread');
  fill?.setAttribute('d','M0 146 C150 146 268 132 388 96 C480 68 558 39 625 35 C648 34 665 42 676 61 C688 81 698 103 718 110 C738 117 758 108 780 91 C864 38 972 14 1066 18 C1103 20 1127 41 1135 72 C1145 109 1173 130 1218 139 C1288 153 1368 148 1440 146 L1440 180 L0 180 Z');
  thread?.setAttribute('d','M0 164 C168 164 290 151 420 122 C512 101 585 82 651 79 C676 78 696 88 708 105 C720 122 733 131 752 132 C774 133 798 125 825 109 C913 58 1017 45 1094 54 C1137 59 1169 79 1187 104 C1214 141 1302 157 1440 156');
  const style=document.createElement('style');
  style.id='hero-015-refine';
  style.textContent=`
    .hero-signature{position:absolute;left:0;right:0;bottom:-1px;width:100%;height:122px;z-index:3;overflow:visible;pointer-events:none}
    .hero-signature .m-fill{fill:var(--ivory)}
    .hero-signature .m-thread{fill:none;stroke:rgba(86,93,62,.20);stroke-width:1.05;vector-effect:non-scaling-stroke}
    @media (min-width:901px){.hero-signature{height:118px}}
    @media (max-width:900px){.hero-signature{height:108px}}
    @media (max-width:640px){.hero-signature{width:118%;left:-9%;height:112px}.hero-signature .m-thread{stroke:rgba(86,93,62,.16);stroke-width:.9}}
  `;
  document.head.appendChild(style);
}
