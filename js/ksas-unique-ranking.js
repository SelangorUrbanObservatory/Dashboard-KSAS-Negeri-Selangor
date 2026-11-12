(function(){
'use strict';
const PBT=['MBSA','MBPJ','MBSJ','MBDK','MPS','MPAJ','MPKJ','MPSp','MPKL','MPKS','MPHS','MDSB'];
const DIST=['Petaling','Klang','Gombak','Hulu Langat','Sepang','Kuala Langat','Kuala Selangor','Hulu Selangor','Sabak Bernam'];
const $=id=>document.getElementById(id),ranking=$('ki-ranking');
if(!ranking)return;
const s=document.createElement('style');s.id='ksas-unique-ranking-styles';s.textContent=[
'.ki-unique-toolbar{display:flex;justify-content:space-between;align-items:center;gap:9px;margin-bottom:13px;flex-wrap:wrap}',
'.ki-unique-toolbar b{color:#35634f;font-size:12px}',
'.ki-unique-row{display:grid;grid-template-columns:95px minmax(0,1fr) 126px;align-items:center;gap:11px;padding:9px 8px;border-radius:9px;border:1px solid transparent;background:transparent;cursor:pointer;width:100%;text-align:left;font-family:inherit}',
'.ki-unique-row:hover{background:#f1f8f4}',
'.ki-unique-row[data-active=true]{background:#fff8e9;border-color:#f2d59d}',
'.ki-unique-name{font-size:11px;font-weight:800;color:#3d5b4c}',
'.ki-unique-track{height:10px;background:#edf2ef;border-radius:12px;overflow:hidden}',
'.ki-unique-track>span{height:100%;display:block;border-radius:12px;background:#6b9c85}',
'.ki-unique-row[data-active=true] .ki-unique-track>span{background:#e69b3b}',
'.ki-unique-amount{font-size:11px;color:#35644e;text-align:right;font-weight:800}',
'.ki-unique-amount small{display:block;color:#84978e;font-size:9px;font-weight:600}',
'.ki-unique-foot{font-size:10px;color:#82968b;line-height:1.7;margin-top:12px}',
'.ki-unique-selection{background:#fff9ec;border:1px solid #f1deb6;padding:12px;border-radius:10px;margin-bottom:12px;color:#684d23;font-size:11px}',
'.ki-unique-levels{display:flex;gap:11px;flex-wrap:wrap;margin:8px 0}',
'.ki-unique-levels span{font-size:10px;color:#716447}',
'.ki-unique-selection small{color:#908265;line-height:1.5;font-size:9px}',

'.ki-unique-progress{border:1px solid #dce9df;border-radius:9px;padding:11px 13px;background:#f6faf7;font-size:11px;color:#567361}',
'@media(max-width:520px){.ki-unique-row{grid-template-columns:62px 1fr 100px;gap:6px;padding:7px 3px}.ki-unique-name,.ki-unique-amount{font-size:10px}}'
].join('\n');document.head.appendChild(s);
const cache={},running={},state={type:'pbt',name:''};
const format=n=>Number(n).toLocaleString('ms-MY',{maximumFractionDigits:2});
let worker=null,precomputed=null,precomputedChecked=false;
function types(){return state.type==='daerah'?DIST:PBT}
function label(f,t){return window.__suoKsasBoundaryLabelFor?window.__suoKsasBoundaryLabelFor(f,t):''}
function selected(){
 const t=$('ksas-area-type'),n=$('ksas-area-name');
 state.type=t&&t.value==='daerah'?'daerah':'pbt';
 state.name=n?n.value:'';
}
function setPending(text){ranking.className='ki-unique-progress';ranking.textContent=text}
function validatedInput(type){
 const data=window.__suoKsasBoundaryData,features=window.__suoKsasOriginal;
 if(!data||!data[type]||!features||!features.length)return null;
 const geo=data[type],all=type==='pbt'?PBT:DIST;
 if(geo.features.length!==all.length)return null;
 const items=all.map(name=>({name,feature:geo.features.find(f=>label(f,type)===name)}));
 if(items.some(x=>!x.feature))return null;
 return {features,areas:items};
}
function display(rows,metric){
 ranking.className='';
 const max=Math.max(1,...rows.map(r=>r.unique_ha));
 const picked=rows.find(r=>r.name===state.name);
 const intro='<div class="ki-unique-toolbar"><b>Ranking '+(state.type==='pbt'?'12 PBT':'9 Daerah')+' · keluasan unik KSAS</b><small>ha &amp; % pentadbiran</small></div>';
 const selectedDetails=picked?'<div class="ki-unique-selection"><b>'+picked.name+' · '+format(picked.unique_ha)+' ha ('+format(picked.coverage_pct)+'%)</b><div class="ki-unique-levels">'+
  ['1','2','3'].map(k=>'<span>Tahap '+k+': <strong>'+format(picked.by_level_unique_ha[k]||0)+' ha</strong></span>').join('')+'</div>'+
  '<small>Luas unik setiap tahap boleh bertindih antara tahap. Jumlah per tahap tidak semestinya sama dengan luas unik keseluruhan.</small></div>':'';

 const list=rows.map((r,i)=>{
  const pct=Math.min(100,Math.max(0,r.unique_ha/max*100));
  const active=state.name===r.name;
  return '<button class="ki-unique-row" type="button" data-ranking-name="'+r.name+'" data-active="'+active+'" aria-label="Pilih '+r.name+'">'+
   '<span class="ki-unique-name">'+(i+1)+'. '+r.name+'</span>'+
   '<span class="ki-unique-track"><span style="width:'+pct.toFixed(2)+'%"></span></span>'+
   '<span class="ki-unique-amount">'+format(r.unique_ha)+' ha<small>'+format(r.coverage_pct)+'% liputan</small></span></button>';
 }).join('');
 ranking.innerHTML=intro+selectedDetails+list+
 '<p class="ki-unique-foot">Keluasan unik = union geometri KSAS selepas dipotong sempadan PBT/daerah, bukan jumlah keluasan fitur. Peratus = keluasan unik KSAS ÷ keluasan geometri sempadan × 100. Asas: semua tahap daripada dataset aktif. Data dikira melalui GEOS/Shapely dan masih memerlukan semakan silang sebelum digunakan dalam laporan rasmi.</p>';
 ranking.querySelectorAll('[data-ranking-name]').forEach(b=>b.addEventListener('click',()=>{
  const t=$('ksas-area-type'),n=$('ksas-area-name');
  if(!n||!t)return;
  t.value=state.type;n.value=b.dataset.rankingName;
  n.dispatchEvent(new Event('change',{bubbles:true}));
  selected();display(rows,metric);
  document.getElementById('peta-ksas')?.scrollIntoView({behavior:'smooth',block:'start'});
 }));
 if(picked){
  document.dispatchEvent(new CustomEvent('suo-ksas-unique-selected',{detail:{type:state.type,name:state.name,...picked}}));
 }else{
  document.dispatchEvent(new CustomEvent('suo-ksas-unique-selected',{detail:{type:state.type,name:''}}));
 }
}
function start(){
 selected();
 const type=state.type;
 if(!precomputedChecked){setPending('Semak dataset analisis unik praproses…');return}
 if(cache[type]){display(cache[type].rows,cache[type].metric);return}
 // Clear a previous area's unique indicator until this selection has a complete result.
 document.dispatchEvent(new CustomEvent('suo-ksas-unique-selected',{detail:{type,name:''}}));
 const input=validatedInput(type);
 if(!input){setPending('Menunggu geometri KSAS dan sempadan '+(type==='pbt'?'PBT':'Daerah')+' dimuatkan…');return}
 // A precomputed complete GIS union is preferred for large datasets.
 if(precomputed&&precomputed.source_count===input.features.length&&
   precomputed.source_dataset===(window.__suoKsasData?.source101?'primary_101':'archive')){
  const list=precomputed[type],names=typesFor(type);
  if(Array.isArray(list)&&list.length===names.length&&
     list.every(r=>names.includes(r.name)&&Number.isFinite(r.unique_ha)&&Number.isFinite(r.coverage_pct)&&r.coverage_pct>=0&&r.coverage_pct<=101)){
   cache[type]={rows:list.slice().sort((a,b)=>b.unique_ha-a.unique_ha),metric:precomputed.metric};
   display(cache[type].rows,cache[type].metric);return;
  }
 }
 // Browser polygon union is deliberately disabled: Turf/JSTS SweepLine can fail on
 // complex KSAS rings. GEOS/Shapely output must be complete before display.
 setPending('Analisis keluasan unik belum tersedia untuk dataset aktif. Pengiraan GIS GEOS/Shapely sedang disediakan melalui fail analitik repo. Tiada angka dianggarkan atau dipaparkan secara separa.');
 return;
}
function typesFor(type){return type==='pbt'?PBT:DIST}
function onAreaChange(){
 selected();
 if(cache[state.type])display(cache[state.type].rows,cache[state.type].metric);
 else start();
}
document.addEventListener('suo-ksas-admin-selection',onAreaChange);
document.addEventListener('suo-ksas-boundary-data',()=>{if(!cache[state.type]&&!running[state.type])start()});
document.addEventListener('suo-ksas-original-ready',()=>{for(const k of Object.keys(cache))delete cache[k];if(worker){worker.terminate();worker=null;running.pbt=false;running.daerah=false}start()});
document.addEventListener('suo-ksas-data',()=>{if(!cache[state.type]&&!running[state.type])start()});
$('ksas-area-type')?.addEventListener('change',onAreaChange);
$('ksas-area-name')?.addEventListener('change',onAreaChange);
fetch('./data/ksas_admin_unique.json',{cache:'no-store'})
 .then(r=>r.ok?r.json():null)
 .then(data=>{
  if(data&&data.metric==='union_clipped_geometries_ha'&&
      data.source_boundary&&data.source_ksas&&data.generated_at&&
      ['computed_requires_review','verified'].includes(data.status))precomputed=data;
 }).catch(e=>console.warn('No preprocessed unique KSAS dataset; using GIS worker',e))
 .finally(()=>{precomputedChecked=true;start()});

})();