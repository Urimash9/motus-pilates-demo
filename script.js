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

function selectBenefit(i){
  dots.forEach((x,j)=>{x.classList.toggle('is-active',j===i);x.setAttribute('aria-selected',String(j===i))});
  bPanel?.classList.add('is-changing');
  setTimeout(()=>{
    if(bNum)bNum.textContent=benefits[i][0];
    if(bTitle)bTitle.textContent=benefits[i][1];
    if(bText)bText.textContent=benefits[i][2];
    bPanel?.classList.remove('is-changing');
  },140);
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
  const tracks=isMobile
    ? [{rx:r.width*.46,ry:r.height*.275,rotation:-12*Math.PI/180},{rx:r.width*.31,ry:r.height*.44,rotation:18*Math.PI/180}]
    : [{rx:r.width*.40,ry:r.height*.33,rotation:-12*Math.PI/180},{rx:r.width*.28,ry:r.height*.46,rotation:18*Math.PI/180}];
  const elapsed=(now-orbitStart)/1000;
  const t=reduced?0:elapsed*.055;
  dots.forEach((dot,i)=>{
    const a=baseAngles[i]+t*(i%2===0?1:-1);
    const track=tracks[trackType[i]];
    const ellipseX=Math.cos(a)*track.rx;
    const ellipseY=Math.sin(a)*track.ry;
    const x=ellipseX*Math.cos(track.rotation)-ellipseY*Math.sin(track.rotation);
    const y=ellipseX*Math.sin(track.rotation)+ellipseY*Math.cos(track.rotation);
    const labelOnLeft=x>0;
    dot.dataset.side=labelOnLeft?'left':'right';
    dot.style.transform=labelOnLeft
      ? `translate(calc(-100% + 4px),-50%) translate(${x}px,${y}px)`
      : `translate(-4px,-50%) translate(${x}px,${y}px)`;
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

// Build 01.8 — transplante isolado do carrossel "Movimento na prática" sobre a base 01.7 aprovada.
// O bloco abaixo substitui somente a instância do carrossel, preservando integralmente a seção orbital e o restante da página.
(()=>{
  const oldStage=document.getElementById('movementStage');
  const oldControls=document.querySelector('.movement-controls');
  if(!oldStage||!oldControls)return;

  const newStage=oldStage.cloneNode(true);
  oldStage.replaceWith(newStage);
  const newControls=oldControls.cloneNode(true);
  oldControls.replaceWith(newControls);

  newStage.setAttribute('role','region');
  newStage.setAttribute('aria-roledescription','carrossel');
  newStage.setAttribute('aria-label','Movimento na prática');

  const cards=[...newStage.querySelectorAll('.motion-card')];
  const labels=['Controle','Precisão','Fluidez','Flexibilidade'];
  const images=[
    ['assets/space_reformer_wide_deploy500.jpg','Equipamento reformer no espaço Motus'],
    ['assets/space_chair_detail.jpg','Detalhe dos aparelhos de Pilates'],
    ['assets/space_bright_wide.jpg','Área de prática iluminada da Motus'],
    ['assets/space_green_dark_deploy500.jpg','Aparelhos junto à parede verde do studio']
  ];
  cards.forEach((card,i)=>{
    card.removeAttribute('style');
    card.setAttribute('aria-label',`${i+1} de ${cards.length}: ${labels[i]}`);
    const img=card.querySelector('img');
    if(img&&images[i]){img.src=images[i][0];img.alt=images[i][1];img.removeAttribute('referrerpolicy')}
  });

  const counter=newControls.querySelector('#movementCounter');
  const prev=newControls.querySelector('#prevMovement');
  const nextBtn=newControls.querySelector('#nextMovement');
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index=0;
  let busy=false;
  let pointerStart=null;

  const delta=(i,a,n)=>{let d=i-a;if(d>n/2)d-=n;if(d<-n/2)d+=n;return d};
  const position=d=>{
    const mobile=innerWidth<=640;
    const tablet=innerWidth<=900;
    const x=d*(mobile?285:tablet?430:540);
    const abs=Math.abs(d);
    return {
      x,
      y:abs*(mobile?13:22),
      z:abs===0?42:0,
      scale:abs===0?1:abs===1?(mobile?.84:.8):.7,
      opacity:abs===0?1:abs===1?(mobile?.48:.38):.025,
      blur:abs===0?0:abs===1?.65:2,
      rot:d*(mobile?2.2:3.4)
    };
  };

  function render(){
    const n=cards.length;
    cards.forEach((card,i)=>{
      const d=delta(i,index,n),p=position(d),abs=Math.abs(d);
      card.style.zIndex=String(30-abs*6);
      card.style.opacity=String(p.opacity);
      card.style.filter=`blur(${p.blur}px)`;
      card.style.transform=`translate3d(calc(-50% + ${p.x}px),calc(-50% + ${p.y}px),${p.z}px) scale(${p.scale}) rotate(${p.rot}deg)`;
      card.setAttribute('aria-hidden',String(abs!==0));
    });
    if(counter)counter.textContent=`0${index+1} / 04 · ${labels[index]}`;
  }

  async function move(dir){
    if(busy||cards.length<2)return;
    busy=true;
    const n=cards.length;
    const outgoing=cards[index];
    const next=(index+dir+n)%n;
    const incoming=cards[next];
    const mobile=innerWidth<=640;
    const tablet=innerWidth<=900;
    const side=mobile?285:tablet?430:540;
    const outX=dir>0?-side*.82:side*.82;
    const inX=dir>0?side:-side;
    const duration=reducedMotion?360:820;

    incoming.style.zIndex='38';
    incoming.style.opacity=mobile?'.48':'.38';
    incoming.style.filter='blur(.65px)';
    outgoing.style.zIndex='42';

    const outAnim=outgoing.animate([
      {transform:'translate3d(-50%,-50%,42px) scale(1) rotateY(0deg) rotateZ(0deg)',filter:'blur(0)',opacity:1},
      {transform:reducedMotion?`translate3d(calc(-50% + ${outX*.42}px),-50%,20px) scale(.96)`:`translate3d(calc(-50% + ${outX*.23}px),calc(-50% - 18px),54px) scale(.985) rotateY(${dir>0?-7:7}deg) rotateZ(${dir>0?-1.2:1.2}deg) skewY(${dir>0?-.7:.7}deg)`,offset:.30,opacity:.96},
      {transform:reducedMotion?`translate3d(calc(-50% + ${outX}px),-50%,0) scale(.9)`:`translate3d(calc(-50% + ${outX*.64}px),calc(-50% - 4px),22px) scale(.91) rotateY(${dir>0?-14:14}deg) rotateZ(${dir>0?-3:3}deg) skewY(${dir>0?-1.5:1.5}deg)`,offset:.68,opacity:.52},
      {transform:`translate3d(calc(-50% + ${outX}px),calc(-50% + ${mobile?13:24}px),0) scale(${mobile?.84:.8}) rotateY(0deg) rotateZ(${dir>0?-3.4:3.4}deg)`,filter:'blur(.65px)',opacity:mobile?.48:.38}
    ],{duration,easing:'cubic-bezier(.2,.68,.22,1)',fill:'forwards'});

    const inAnim=incoming.animate([
      {transform:`translate3d(calc(-50% + ${inX}px),calc(-50% + ${mobile?13:24}px),0) scale(${mobile?.84:.8}) rotateZ(${dir>0?2.2:-2.2}deg)`,opacity:mobile?.48:.38,filter:'blur(.65px)'},
      {transform:reducedMotion?`translate3d(calc(-50% + ${inX*.25}px),-50%,28px) scale(.98)`:`translate3d(calc(-50% + ${inX*.32}px),calc(-50% - 12px),48px) scale(.97) rotateY(${dir>0?6:-6}deg) rotateZ(${dir>0?.7:-.7}deg)`,offset:.62,opacity:.9,filter:'blur(.1px)'},
      {transform:'translate3d(-50%,-50%,42px) scale(1) rotateY(0deg) rotateZ(0deg)',opacity:1,filter:'blur(0)'}
    ],{duration,easing:'cubic-bezier(.2,.68,.22,1)',fill:'forwards'});

    await Promise.allSettled([outAnim.finished,inAnim.finished]);
    index=next;
    outAnim.cancel();inAnim.cancel();
    render();
    busy=false;
  }

  prev?.addEventListener('click',()=>move(-1));
  nextBtn?.addEventListener('click',()=>move(1));
  newStage.addEventListener('pointerdown',e=>{if(busy)return;pointerStart=e.clientX;newStage.setPointerCapture?.(e.pointerId)});
  newStage.addEventListener('pointerup',e=>{if(pointerStart==null)return;const dx=e.clientX-pointerStart;if(Math.abs(dx)>38)move(dx<0?1:-1);pointerStart=null});
  newStage.addEventListener('pointercancel',()=>{pointerStart=null});
  newStage.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();move(1)}if(e.key==='ArrowLeft'){e.preventDefault();move(-1)}});
  addEventListener('resize',render);

  const style=document.createElement('style');
  style.id='movement-018-clean';
  style.textContent=`
    .movement-stage{height:720px!important;max-width:1440px!important;margin:52px auto 0!important;position:relative;perspective:1700px!important;transform-style:preserve-3d;touch-action:pan-y;cursor:grab;user-select:none}
    .movement-stage:active{cursor:grabbing}
    .motion-card{position:absolute;margin:0;width:min(47vw,620px)!important;height:620px!important;left:50%;top:50%;overflow:hidden;border:1px solid rgba(86,93,62,.12)!important;border-radius:26px 112px 24px 76px / 28px 82px 30px 104px!important;transform-origin:50% 54%!important;will-change:transform,opacity,filter;backface-visibility:hidden;box-shadow:0 34px 90px rgba(63,56,45,.13)!important;background:var(--sand2)}
    .motion-card:after{content:"";position:absolute;inset:0;border-radius:inherit;box-shadow:inset -18px 0 30px rgba(255,255,255,.035);pointer-events:none}
    .motion-card img{object-position:center;pointer-events:none}
    .motion-card figcaption{padding:150px 36px 32px!important;background:linear-gradient(transparent,rgba(25,27,22,.74))!important;font-size:52px!important;text-shadow:0 1px 18px rgba(0,0,0,.18)}
    .motion-card figcaption span{margin-right:16px!important;letter-spacing:.12em}
    .movement-controls button:focus-visible,.movement-stage:focus-visible{outline:2px solid var(--olive);outline-offset:4px}
    @media(max-width:900px){.movement-stage{height:640px!important}.motion-card{width:min(64vw,500px)!important;height:540px!important}}
    @media(max-width:640px){.movement-stage{height:510px!important;margin-top:30px!important;perspective:1000px!important}.motion-card{width:78vw!important;max-width:350px!important;height:450px!important;border-radius:18px 68px 16px 48px / 20px 52px 18px 72px!important}.motion-card figcaption{padding:100px 22px 22px!important;font-size:34px!important}}
  `;
  document.head.appendChild(style);
  render();
})();
