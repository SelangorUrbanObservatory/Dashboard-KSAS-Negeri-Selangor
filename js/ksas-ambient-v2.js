(function(){
'use strict';
var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var css=[
/* Geospatial visual backdrop - intentionally stronger than V1 */
'html,body{background:#e9f2f0!important}',
'body{background:radial-gradient(ellipse at 92% 12%,#d7eae3 0%,transparent 40%),radial-gradient(ellipse at 5% 75%,#f4e3de 0%,transparent 42%),linear-gradient(165deg,#e9f3f2,#f9f9f4 45%,#eaf0ed)!important}',
'#suo-geo-canvas{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:.98}',
'body:before,body:after{display:none!important}',
'.topstripe,body>header,body>main{position:relative;z-index:2}',
'body>main{isolation:auto}',
'main>.intro{position:relative;isolation:isolate;overflow:hidden;min-height:220px;display:flex;align-items:center;padding:34px clamp(25px,4vw,55px);margin:15px 0 27px;border-radius:24px;border:1px solid #174b49;box-shadow:0 20px 45px rgba(16,63,68,.23);background:radial-gradient(ellipse at 85% 35%,rgba(49,172,145,.45),transparent 56%),linear-gradient(116deg,#10393e 0%,#155c58 62%,#1c7164 100%)}',
'main>.intro:before{content:none!important}',
'main>.intro:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(12,38,44,.30),rgba(12,38,44,.02) 66%),repeating-linear-gradient(115deg,transparent 0 49px,rgba(255,255,255,.025) 50px 51px,transparent 52px 101px);z-index:-1;pointer-events:none}',
'.intro>.ks-hero-art{position:absolute;inset:0 0 0 auto;width:56%;height:100%;z-index:-1;pointer-events:none;opacity:.95}',
'.ks-hero-art svg{width:100%;height:100%;display:block}',
'.ks-wave-1,.ks-wave-2{transform-origin:70% 50%;animation:ksGeoRotate 45s linear infinite}',
'.ks-wave-2{animation-direction:reverse;animation-duration:59s}',
'.ks-route{stroke-dasharray:7 13;animation:ksRouteFlow 10s linear infinite}',
'.ks-node{transform-box:fill-box;transform-origin:center;animation:ksNodePulse 4s ease-in-out infinite alternate}',
'.ks-node:nth-of-type(2n){animation-delay:-2s}',
'.ks-orbit{transform-origin:70% 52%;animation:ksGeoRotate 22s linear infinite}',
'.intro h1{color:#fff!important;font-size:clamp(29px,3.2vw,45px)!important;letter-spacing:-1.5px!important;line-height:1.16!important;max-width:670px}',
'.intro p{color:#cfe3df!important;font-size:13px!important;line-height:1.75!important;max-width:560px!important}',
'.intro .eyebrow{color:#f5d37d!important;letter-spacing:2.1px}',
'.intro .meta-pill{position:relative;z-index:1;border:1px solid rgba(255,231,161,.48)!important;background:rgba(6,42,44,.50)!important;backdrop-filter:blur(12px);color:#ffe8a1!important;box-shadow:0 0 24px rgba(237,196,95,.16);white-space:normal!important;text-align:center}',
'.intro>div:first-child{position:relative;z-index:1;max-width:730px}',
'.kpis,.workspace,.ks-nav,.ks-hero,.ks-infographics,.footer,.breadcrumb{position:relative}',
'.kpi{border:1px solid rgba(204,226,221,.9)!important;box-shadow:0 13px 28px rgba(24,85,83,.10)!important}',
'.kpi:after{content:"";position:absolute;inset:auto -30px -58px auto;width:140px;height:140px;background:radial-gradient(circle,rgba(46,163,145,.085),transparent 68%);pointer-events:none}',
'@keyframes ksGeoRotate{to{transform:rotate(360deg)}}',
'@keyframes ksRouteFlow{to{stroke-dashoffset:-260}}',
'@keyframes ksNodePulse{0%{opacity:.45;transform:scale(.8)}100%{opacity:1;transform:scale(1.32)}}',
'@media(max-width:850px){main>.intro{min-height:215px;padding:29px 26px}.intro>.ks-hero-art{width:85%;opacity:.45}.intro .meta-pill{display:none}}',
'@media(max-width:600px){main>.intro{min-height:220px;padding:28px 21px;margin-top:8px;border-radius:18px}.intro>.ks-hero-art{width:100%;opacity:.32}.intro h1{font-size:29px!important}.intro p{font-size:12px!important}#suo-geo-canvas{opacity:.7}}',
'@media(prefers-reduced-motion:reduce){.ks-wave-1,.ks-wave-2,.ks-route,.ks-node,.ks-orbit{animation:none!important}}'
].join('\n');
var style=document.createElement('style');style.id='suo-geo-visual-v2';style.textContent=css;document.head.appendChild(style);
var hero=document.querySelector('main>.intro');
if(hero){
 var art=document.createElement('div');art.className='ks-hero-art';art.setAttribute('aria-hidden','true');
 art.innerHTML='<svg viewBox="0 0 720 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="ksglow"><stop stop-color="#66d8b2" stop-opacity=".55"/><stop offset=".65" stop-color="#3ab18e" stop-opacity=".15"/><stop offset="1" stop-color="#2fa183" stop-opacity="0"/></radialGradient><filter id="ksblur"><feGaussianBlur stdDeviation="2"/></filter></defs>'+
 '<ellipse cx="503" cy="145" rx="245" ry="205" fill="url(#ksglow)"/>'+
 '<g class="ks-wave-1" fill="none" stroke="#bbf5de" stroke-width="1" opacity=".23">'+
 '<ellipse cx="510" cy="145" rx="150" ry="56" transform="rotate(-22 510 145)"/><ellipse cx="510" cy="145" rx="188" ry="83" transform="rotate(-22 510 145)"/><ellipse cx="510" cy="145" rx="227" ry="109" transform="rotate(-22 510 145)"/><ellipse cx="510" cy="145" rx="266" ry="136" transform="rotate(-22 510 145)"/>'+
 '</g><g class="ks-wave-2" fill="none" stroke="#eac861" stroke-width="1.3" opacity=".35">'+
 '<ellipse cx="510" cy="145" rx="112" ry="164" transform="rotate(19 510 145)"/><ellipse cx="510" cy="145" rx="157" ry="211" transform="rotate(19 510 145)"/><ellipse cx="510" cy="145" rx="203" ry="260" transform="rotate(19 510 145)"/></g>'+
 '<g fill="none" stroke="#dfffea" stroke-width="1.5" opacity=".7"><path class="ks-route" d="M330 178L405 124L477 157L570 75L640 114L690 59"/><path class="ks-route" d="M389 241L477 157L546 213L640 114" stroke="#f9d56f"/></g>'+
 '<g fill="#f7d777"><circle class="ks-node" cx="405" cy="124" r="5"/><circle class="ks-node" cx="570" cy="75" r="4"/><circle class="ks-node" cx="640" cy="114" r="5"/></g>'+
 '<g fill="#b7f5da"><circle class="ks-node" cx="330" cy="178" r="4"/><circle class="ks-node" cx="477" cy="157" r="7"/><circle class="ks-node" cx="546" cy="213" r="4"/><circle class="ks-node" cx="389" cy="241" r="4"/></g>'+
 '<g class="ks-orbit"><circle cx="510" cy="145" r="95" fill="none" stroke="#e4cc76" stroke-dasharray="3 12" opacity=".38"/><circle cx="605" cy="145" r="5" fill="#fce18e"/></g>'+
 '</svg>';
 hero.appendChild(art);
}
if(reduce)return;
var canvas=document.createElement('canvas');canvas.id='suo-geo-canvas';canvas.setAttribute('aria-hidden','true');document.body.insertBefore(canvas,document.body.firstChild);
var ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return;
var width=0,height=0,dpr=1,points=[],running=true,last=0;
function resize(){
 width=window.innerWidth;height=window.innerHeight;
 dpr=Math.min(window.devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
 ctx.setTransform(dpr,0,0,dpr,0,0);
 var count=Math.min(56,Math.max(26,Math.round(width*height/23000)));
 points=Array.from({length:count},function(_,i){
   var seed=((i*7919)%997)/997,seed2=((i*3571+73)%991)/991;
   return {x:seed*width,y:seed2*height,vx:(((i*31)%9)-4)*.025,vy:(((i*47)%11)-5)*.020,r:1.6+(i%4)*.42,color:i%7===0?'#ce6b61':i%5===0?'#d6ae4f':'#3caa93'};
 });
}
resize();window.addEventListener('resize',resize,{passive:true});
function frame(t){
 if(!running)return;
 requestAnimationFrame(frame);
 if(t-last<35)return;
 var elapsed=Math.min(t-last||35,65);last=t;
 ctx.clearRect(0,0,width,height);
 // Prominent but soft technical grid
 ctx.strokeStyle='rgba(34,123,117,.085)';ctx.lineWidth=.8;
 var gap=78,offset=(t*.002)%gap;
 for(var x=offset;x<width;x+=gap){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,height);ctx.stroke()}
 for(var y=offset;y<height;y+=gap){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(width,y);ctx.stroke()}
 // Network connectors
 for(var i=0;i<points.length;i++){
  var a=points[i];a.x+=a.vx*(elapsed/25);a.y+=a.vy*(elapsed/25);
  if(a.x<0)a.x=width;if(a.x>width)a.x=0;if(a.y<0)a.y=height;if(a.y>height)a.y=0;
  for(var j=i+1;j<points.length;j++){
   var b=points[j],dx=a.x-b.x,dy=a.y-b.y,d2=dx*dx+dy*dy;
   if(d2<19000){ctx.strokeStyle='rgba(26,127,113,'+(.27*(1-d2/19000)).toFixed(3)+')';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}
  }
  ctx.fillStyle=a.color;ctx.globalAlpha=.46;ctx.beginPath();ctx.arc(a.x,a.y,a.r,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
  if(i%9===0){ctx.strokeStyle='rgba(43,151,132,.24)';ctx.beginPath();ctx.arc(a.x,a.y,7+2*Math.sin(t/1400+i),0,Math.PI*2);ctx.stroke()}
 }
}
document.addEventListener('visibilitychange',function(){running=!document.hidden;if(running){last=0;requestAnimationFrame(frame)}});
requestAnimationFrame(frame);
})();