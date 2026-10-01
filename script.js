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
const bNum=document.getElementById('benefitNumber'),bTitle=document.getElementById('benefitTitle'),bText=document.getElementById('benefitText');
document.querySelectorAll('.benefit-dot').forEach(btn=>btn.addEventListener('click',()=>{
  const i=Number(btn.dataset.benefit);
  document.querySelectorAll('.benefit-dot').forEach(x=>x.classList.remove('is-active'));
  btn.classList.add('is-active');
  if(bNum)bNum.textContent=benefits[i][0];
  if(bTitle)bTitle.textContent=benefits[i][1];
  if(bText)bText.textContent=benefits[i][2];
}));

const motionCards=[...document.querySelectorAll('.motion-card')];
const motionCounter=document.getElementById('movementCounter');
const motionLabels=['Controle','Precisão','Fluidez','Flexibilidade'];
let active=0,startX=null;
function renderMotion(){
  motionCards.forEach((card,i)=>{
    let delta=i-active; const n=motionCards.length;
    if(delta>n/2)delta-=n;
    if(delta<-n/2)delta+=n;
    const abs=Math.abs(delta);
    const mobile=innerWidth<=640;
    const x=mobile?delta*48:delta*78;
    const y=mobile?abs*18:abs*22;
    const scale=1-abs*(mobile?.08:.095);
    const opacity=abs===0?1:abs===1?.48:.12;
    const blur=abs===0?0:abs===1?.5:1.2;
    const rot=delta*(mobile?2.5:2);
    card.style.zIndex=String(20-abs*5);
    card.style.opacity=String(opacity);
    card.style.filter=`blur(${blur}px)`;
    card.style.transform=`translate3d(${x}%,${y}px,0) scale(${scale}) rotate(${rot}deg)`;
  });
  if(motionCounter)motionCounter.textContent=`0${active+1} / 04 · ${motionLabels[active]}`;
}
function moveMotion(d){active=(active+d+motionCards.length)%motionCards.length;renderMotion()}
document.getElementById('prevMovement')?.addEventListener('click',()=>moveMotion(-1));
document.getElementById('nextMovement')?.addEventListener('click',()=>moveMotion(1));
const stage=document.getElementById('movementStage');
stage?.addEventListener('pointerdown',e=>{startX=e.clientX;stage.setPointerCapture?.(e.pointerId)});
stage?.addEventListener('pointerup',e=>{if(startX==null)return;const dx=e.clientX-startX;if(Math.abs(dx)>45)moveMotion(dx<0?1:-1);startX=null});
stage?.addEventListener('keydown',e=>{if(e.key==='ArrowRight')moveMotion(1);if(e.key==='ArrowLeft')moveMotion(-1)});
addEventListener('resize',renderMotion);renderMotion();