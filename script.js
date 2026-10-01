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
  const x=mobile?delta*205:delta*330;
  const abs=Math.abs(delta);
  return {
    x,
    y:abs*(mobile?20:18),
    scale:1-abs*(mobile?.095:.09),
    opacity:abs===0?1:abs===1?.33:.07,
    blur:abs===0?0:abs===1?.8:1.8,
    rot:delta*(mobile?4:3.2)
  };
}
function renderMotion(){
  const n=motionCards.length;
  motionCards.forEach((card,i)=>{
    const d=circularDelta(i,active,n),p=motionPosition(d),abs=Math.abs(d);
    card.style.zIndex=String(30-abs*6);
    card.style.opacity=String(p.opacity);
    card.style.filter=`blur(${p.blur}px)`;
    card.style.transform=`translate3d(calc(-50% + ${p.x}px),calc(-50% + ${p.y}px),0) scale(${p.scale}) rotate(${p.rot}deg)`;
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
  const side=mobile?215:335;
  const outX=dir>0?-side*.72:side*.72;
  const inX=dir>0?side:-side;
  incoming.style.zIndex='40';incoming.style.opacity='.42';incoming.style.filter='blur(.6px)';
  const outAnim=outgoing.animate([
    {transform:'translate3d(-50%,-50%,0) scale(1) rotateY(0deg) rotate(0deg)',filter:'blur(0px)',opacity:1},
    {transform:`translate3d(calc(-50% + ${outX*.35}px),calc(-50% - 8px),40px) scale(.98) rotateY(${dir>0?-22:22}deg) skewY(${dir>0?-1.5:1.5}deg)`,offset:.34,opacity:.94},
    {transform:`translate3d(calc(-50% + ${outX}px),calc(-50% + 28px),0) scale(.9) rotateY(${dir>0?-58:58}deg) skewY(${dir>0?-3:3}deg)`,filter:'blur(1px)',opacity:.13}
  ],{duration:680,easing:'cubic-bezier(.22,.72,.25,1)',fill:'forwards'});
  const inAnim=incoming.animate([
    {transform:`translate3d(calc(-50% + ${inX}px),calc(-50% + 22px),0) scale(.9) rotateY(${dir>0?12:-12}deg) rotate(${dir>0?3:-3}deg)`,opacity:.18,filter:'blur(1px)'},
    {transform:`translate3d(calc(-50% + ${inX*.34}px),calc(-50% - 10px),28px) scale(.98) rotateY(${dir>0?-10:10}deg)`,offset:.62,opacity:.88,filter:'blur(.2px)'},
    {transform:'translate3d(-50%,-50%,0) scale(1) rotateY(0deg) rotate(0deg)',opacity:1,filter:'blur(0px)'}
  ],{duration:720,easing:'cubic-bezier(.22,.72,.25,1)',fill:'forwards'});
  await Promise.allSettled([outAnim.finished,inAnim.finished]);
  active=next;outAnim.cancel();inAnim.cancel();renderMotion();motionBusy=false;
}
document.getElementById('prevMovement')?.addEventListener('click',()=>moveMotion(-1));
document.getElementById('nextMovement')?.addEventListener('click',()=>moveMotion(1));
stage?.addEventListener('pointerdown',e=>{startX=e.clientX;stage.setPointerCapture?.(e.pointerId)});
stage?.addEventListener('pointerup',e=>{if(startX==null)return;const dx=e.clientX-startX;if(Math.abs(dx)>42)moveMotion(dx<0?1:-1);startX=null});
stage?.addEventListener('keydown',e=>{if(e.key==='ArrowRight')moveMotion(1);if(e.key==='ArrowLeft')moveMotion(-1)});
addEventListener('resize',()=>{renderMotion();if(reduced)renderOrbit(performance.now())});
renderMotion();
