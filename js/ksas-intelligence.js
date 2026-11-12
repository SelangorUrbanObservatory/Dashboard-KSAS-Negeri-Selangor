(function(){
'use strict';
const PBT=['MBSA','MBPJ','MBSJ','MBDK','MPS','MPAJ','MPKJ','MPSp','MPKL','MPKS','MPHS','MDSB'];
const DIST=['Petaling','Klang','Gombak','Hulu Langat','Sepang','Kuala Langat','Kuala Selangor','Hulu Selangor','Sabak Bernam'];
const format=n=>Number(n||0).toLocaleString('ms-MY',{maximumFractionDigits:2});
const styles=[
'.ki-ranking-only{grid-template-columns:1fr!important}.ki-section{margin:35px 0;scroll-margin-top:20px}.ki-heading{font:800 clamp(23px,2.5vw,32px) "Plus Jakarta Sans",sans-serif;letter-spacing:-1px;margin:8px 0}.ki-kicker{font-size:10px;font-weight:900;letter-spacing:2px;color:#b52f42}.ki-muted{font-size:11px;line-height:1.7;color:#7b8e8a}.ki-grid{display:grid;grid-template-columns:1fr 1fr;gap:17px;margin-top:19px}.ki-card{border:1px solid #e0e9e5;background:#fff;border-radius:17px;padding:22px;box-shadow:0 10px 26px #284e4109}.ki-card h3{font:800 16px "Plus Jakarta Sans",sans-serif;margin:0 0 8px;color:#2b4940}.ki-modes{display:flex;gap:6px;background:#f4f7f5;border-radius:10px;padding:5px;margin:16px 0}.ki-modes button{flex:1;border:0;border-radius:8px;background:transparent;padding:10px;font-weight:800;color:#617a6d;cursor:pointer}.ki-modes button[aria-pressed=true]{background:#fff;color:#246e52;box-shadow:0 2px 8px #1232}.ki-select{width:100%;padding:12px;border:1px solid #dce8df;background:#fcfefd;border-radius:10px;color:#34574b}.ki-placeholder{background:#f7faf8;border:1px dashed #cfdfd3;border-radius:11px;padding:18px;color:#768c80;font-size:11px;line-height:1.8;margin-top:14px}.ki-indicators{display:grid;grid-template-columns:repeat(4,1fr);gap:13px;margin-top:13px}.ki-metric{padding:17px;background:#f8fbf9;border:1px solid #e3ece6;border-radius:13px}.ki-metric small{font-size:10px;color:#718a7a}.ki-metric strong{display:block;margin:12px 0 5px;font:800 clamp(17px,2vw,27px) "Plus Jakarta Sans",sans-serif;color:#276f54}.ki-rank{display:grid;grid-template-columns:82px 1fr 86px;align-items:center;gap:9px;margin:12px 0;font-size:11px}.ki-rank b{font-size:11px;color:#4c6a59}.ki-track{height:9px;background:#eef4ef;border-radius:9px;overflow:hidden}.ki-fill{height:100%;background:#85b596;border-radius:9px}.ki-policy-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:15px}.ki-policy-grid button{text-align:left;border:1px solid #dfe9e1;border-radius:12px;padding:15px;background:#fcfefd;color:#426450;font-weight:800;cursor:pointer}.ki-policy-grid button[aria-pressed=true]{background:#eef8f1;border-color:#73ae8a}.ki-policy-content{padding:20px;background:#f5faf7;border:1px solid #dfece3;border-left:4px solid #7db490;margin-top:13px;border-radius:11px;font-size:12px;line-height:1.8;color:#42604d}.ki-rank-val{text-align:right;color:#3a7057;font-weight:800}.ki-small{font-size:10px;color:#869a8d;line-height:1.6;margin-top:12px}@media(max-width:940px){.ki-grid{grid-template-columns:1fr}.ki-indicators{grid-template-columns:repeat(2,1fr)}}@media(max-width:520px){.ki-card{padding:15px}.ki-policy-grid{grid-template-columns:1fr}.ki-rank{grid-template-columns:70px 1fr 75px;gap:5px}}'
].join('');
styles.push([
'.ki-section{margin:20px 0!important}',
'.ki-section>.ki-heading{font-size:clamp(20px,2vw,27px);margin:5px 0}',
'.ki-summary-grid{display:grid!important;grid-template-columns:minmax(320px,.9fr) minmax(0,1.1fr);gap:14px;align-items:stretch;margin-top:14px;width:100%}',
'.ki-summary-grid>.ki-ranking-card,.ki-summary-grid>.ki-conservation-card{display:block!important;min-width:0}',
'.ki-ranking-card #ki-ranking{margin-top:9px;max-width:none}',
'.ki-summary-grid{display:grid;grid-template-columns:minmax(320px,.9fr) minmax(0,1.1fr);gap:14px;align-items:stretch;margin-top:14px}',
'.ki-summary-grid>.ki-card{min-width:0;margin:0!important;padding:17px 19px}',
'.ki-ranking-card h3 small{font-size:11px;font-weight:600;color:#87958d}',
'.ki-conservation-card .ki-indicators{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin-top:10px}',
'.ki-conservation-card .ki-metric{padding:12px;min-height:104px}',
'.ki-conservation-card .ki-metric strong{font-size:clamp(18px,1.9vw,23px);margin:8px 0 4px;overflow-wrap:anywhere}',
'.ki-conservation-card .ki-metric small{font-size:10px}',
'.ki-conservation-card>.ki-muted{margin:4px 0 8px}',
'.ki-conservation-card #ki-source{font-size:10px;margin-top:11px}',
'@media(max-width:1020px){.ki-summary-grid{grid-template-columns:1fr}.ki-conservation-card .ki-indicators{grid-template-columns:repeat(4,minmax(0,1fr))}}',
'@media(max-width:700px){.ki-conservation-card .ki-indicators{grid-template-columns:repeat(2,minmax(0,1fr))}}',
'@media(max-width:520px){.ki-summary-grid>.ki-card{padding:14px}.ki-conservation-card .ki-metric{min-height:98px}}'
].join('')); 
const style=document.createElement('style');style.textContent=styles;style.id='ki-styles';document.head.appendChild(style);
const root=document.createElement('section');root.className='ki-section';root.id='ksas-intelligence';
root.innerHTML='<span class="ki-kicker">SUO · ENVIRONMENTAL INTELLIGENCE</span><h2 class="ki-heading">Ringkasan Analitik KSAS</h2><p class="ki-muted">Analisis pentadbiran, statistik pemuliharaan dan penerangan dasar RSN Selangor 2035 (Pengubahan).</p>'+
'<div class="ki-summary-grid"><article class="ki-card ki-ranking-card"><h3>Ranking KSAS <small>PBT / Daerah</small></h3><div id="ki-ranking" class="ki-placeholder" aria-live="polite"></div></article>'+
'<article class="ki-card ki-conservation-card"><h3>Conservation Indicators</h3><p class="ki-muted">Ringkasan data mengikut kawasan terpilih. Luas fitur boleh bertindih.</p><div class="ki-indicators">'+
'<div class="ki-metric"><small>Bilangan objek GIS</small><strong id="ki-count">—</strong><small>Dataset aktif</small></div>'+
'<div class="ki-metric"><small>Jumlah luas fitur</small><strong id="ki-sum">—</strong><small>Hektar · mungkin bertindih</small></div>'+
'<div class="ki-metric"><small>Tahap tertinggi mengikut bilangan objek</small><strong id="ki-dominant">—</strong><small>Bukan luas unik</small></div>'+
'<div class="ki-metric"><small>Keluasan unik KSAS kawasan</small><strong id="ki-unique">—</strong><small id="ki-unique-note">Pilih PBT/daerah · kiraan union/dissolve</small></div></div><div id="ki-source" class="ki-small">Menunggu dataset KSAS dimuatkan.</div></article></div>'+
'<article class="ki-card" style="margin-top:17px"><h3>RSN Policy Intelligence</h3><p class="ki-muted">Klik tema untuk memahami pertimbangan Dasar MP16 dan kriteria KSAS. Maklumat ini bukan status pewartaan atau keputusan perancangan automatik.</p><div class="ki-policy-grid" id="ki-themes"></div><div class="ki-policy-content" id="ki-policy-content"></div><p class="ki-small">Sumber: RSN Selangor 2035 (Pengubahan), Dasar MP16, Rajah 5.3.17 dan Jadual 5.3.4. Perlu dirujuk bersama rancangan pemajuan dan agensi teknikal.</p></article>';
const rsn=document.getElementById('rsn-ksas'),workspace=document.querySelector('.workspace'),footer=document.querySelector('.footer');
// The compact metrics live directly below the map workspace, rather than being
// buried after lower-page RSN/PPPKSAS sections.
if(workspace)workspace.insertAdjacentElement('afterend',root);
else if(footer)footer.parentNode.insertBefore(root,footer);
else if(rsn)rsn.parentNode.insertBefore(root,rsn);
const $=id=>document.getElementById(id);
let mode='pbt',admin=null;const currentSelection={type:'pbt',name:''};
const places=()=>mode==='pbt'?PBT:DIST;
const rows=()=>admin&&admin[mode];
// The unique-coverage worker owns the ranking. Do not load old summed-feature rankings.
$('ki-ranking').textContent='Menunggu pengiraan keluasan unik PBT/Daerah…';
// Area selection comes exclusively from the top filter, not a duplicate Spatial Explorer.
const topics=[
 ['forest','🌳 Hutan dan biodiversiti','Kawasan perlindungan, Hutan Simpanan Kekal, habitat biodiversiti dan rangkaian ekologi. Tahap perlu ditentukan mengikut status serta kriteria lokasi sebenar.'],
 ['hills','⛰️ Tanah tinggi dan cerun','Kriteria kontur serta kawasan bukit dan cerun perlu disemak bersama data topografi, garis panduan dan pertimbangan teknikal.'],
 ['water','💧 Tadahan dan sumber air','Tadahan empangan, takat pengambilan dan imbuhan sumber air memerlukan semakan sempadan serta syarat daripada agensi berkaitan.'],
 ['coast','🌊 Pesisiran dan tanah bencah','Pesisiran, tanah bencah serta gambut perlu ditafsir menggunakan jenis KSAS, batas geografi dan langkah pengurusan berkenaan.'],
 ['food','🌾 Keterjaminan makanan','Kawasan pengeluaran makanan penting hendaklah diurus menurut ketetapan rancangan pemajuan dan prinsip guna tanah mampan.'],
 ['screen','📋 Dasar MP16 dan kawalan pembangunan','Pengurusan KSAS diintegrasikan dengan perancangan guna tanah. Saringan perlu mempertimbangkan jenis, tahap, status perlindungan, rancangan pemajuan serta ulasan agensi teknikal.']
];
const setTopic=id=>{
 let t=topics.find(x=>x[0]===id)||topics[0];
 $('ki-policy-content').textContent=t[1]+': '+t[2];
 root.querySelectorAll('[data-topic]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.topic===id)));
};
topics.forEach(t=>{
 let b=document.createElement('button');b.type='button';b.dataset.topic=t[0];b.textContent=t[1];b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>setTopic(t[0]));$('ki-themes').appendChild(b);
});
setTopic('forest');
let stateMetrics={count:null,sum:null,dominant:null,source:null};
function updateAreaMetrics(detail){
 const d=detail||{};
 if(d.status==='state'){
  if(stateMetrics.count!==null)$('ki-count').textContent=stateMetrics.count;
  if(stateMetrics.sum!==null)$('ki-sum').textContent=stateMetrics.sum;
  if(stateMetrics.dominant!==null)$('ki-dominant').textContent=stateMetrics.dominant;
  if(stateMetrics.source!==null)$('ki-source').textContent=stateMetrics.source;
  return;
 }
 if(!d.name)return;
 if(d.status!=='ready'){
  $('ki-count').textContent='—';$('ki-sum').textContent='—';$('ki-dominant').textContent='—';
  $('ki-source').textContent='Menunggu pengiraan spatial untuk '+d.name+'.';
  return;
 }
 $('ki-count').textContent=format(d.count);
 $('ki-sum').textContent=format(d.totalHa)+' ha';
 const values=Object.entries(d.counts||{}).sort((a,b)=>b[1]-a[1]);
 $('ki-dominant').textContent=values.length&&values[0][1]?'Tahap '+values[0][0]:'—';
 $('ki-source').textContent='Kawasan '+d.name+' ('+d.type.toUpperCase()+') · luas hasil persilangan setiap fitur, mungkin bertindih. Bilangan menunjukkan fitur terpotong, bukan kawasan unik.';
}
document.addEventListener('suo-ksas-admin-metrics',e=>updateAreaMetrics(e.detail));
document.addEventListener('suo-ksas-unique-selected',function(e){
 const d=e.detail||{},v=$('ki-unique'),note=$('ki-unique-note');
 if(!v||!note)return;
 if(d.name&&Number.isFinite(d.unique_ha)){
  v.textContent=format(d.unique_ha)+' ha';
  note.textContent=d.name+' · '+format(d.coverage_pct)+'% daripada luas pentadbiran';
 }else{
  v.textContent='—';
  note.textContent='Pilih PBT/daerah untuk paparan keluasan unik; bukan jumlah fitur';
 }
});

document.addEventListener('suo-ksas-data',e=>{
 const d=e.detail||{},n=Number(d.total||0),c=d.counts||{};
 stateMetrics.count=format(n);
 $('ki-count').textContent=format(n);
 let levels=['1','2','3'].map(k=>({k,n:Number(c[k]||0)})).sort((a,b)=>b.n-a.n);
 $('ki-dominant').textContent=levels[0].n?'Tahap '+levels[0].k:'—';
 stateMetrics.dominant=$('ki-dominant').textContent;
 $('ki-source').textContent=d.source101?'Sumber: dataset utama 101 objek vektor RSN Selangor 2035 (Pengubahan).':'Perhatian: dataset arkib sedang digunakan; sahkan dataset utama sebelum melaporkan angka.';
 stateMetrics.source=$('ki-source').textContent;
});
document.addEventListener('suo-ksas-indicators',e=>{
 const n=e.detail&&e.detail.featureAreaHa;
 if(typeof n==='number'&&Number.isFinite(n)){stateMetrics.sum=format(n)+' ha';$('ki-sum').textContent=stateMetrics.sum;}
});
if(window.__suoKsasData)document.dispatchEvent(new CustomEvent('suo-ksas-data',{detail:window.__suoKsasData}));
if(window.__suoKsasIndicators)document.dispatchEvent(new CustomEvent('suo-ksas-indicators',{detail:window.__suoKsasIndicators}));
if(window.__suoKsasAdminMetrics)updateAreaMetrics(window.__suoKsasAdminMetrics);
})();