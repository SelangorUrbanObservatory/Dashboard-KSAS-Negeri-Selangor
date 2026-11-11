(function(){
'use strict';
const SUO_PBT_ORDER=['MBSA','MBPJ','MBSJ','MBDK','MPS','MPAJ','MPKJ','MPSp','MPKL','MPKS','MPHS','MDSB'];
const SUO_DAERAH_ORDER=['Petaling','Klang','Gombak','Hulu Langat','Sepang','Kuala Langat','Kuala Selangor','Hulu Selangor','Sabak Bernam'];

var filterbar=document.querySelector('.ks-filterbar');
var right=document.querySelector('.workspace>.right');
if(!filterbar||!right)return;
var css=[
'.ks-filterbar{grid-template-columns:repeat(4,minmax(0,1fr))!important}',
'.ks-filterbar>label.fieldname{grid-column:1!important;grid-row:1!important}',
'.ks-filterbar>.input-wrap{grid-column:1!important;grid-row:2!important}',
'.ks-filterbar>.control:has(#cat){grid-column:2!important;grid-row:1/3!important}',
'.ks-admin-filter{margin:0;min-width:0}',
'.ks-admin-filter .fieldname{margin:0 0 9px}',
'.ks-admin-filter select{width:100%;min-width:0;height:43px;background:#fafcfa;border:1px solid #e1e9e4;border-radius:9px;padding:10px;font:700 12px "DM Sans",sans-serif;color:#344e40}',
'.ks-admin-filter.type{grid-column:3;grid-row:1/3;align-self:end}',
'.ks-admin-filter.area{grid-column:4;grid-row:1/3;align-self:end}',
'.ks-admin-result{border-top:1px solid #e7ede9;margin-top:14px;padding-top:13px}',
'.ks-admin-result h3{font:800 13px "Plus Jakarta Sans",sans-serif;margin:0 0 5px;color:#2d5748}',
'.ks-admin-result p{font-size:10px;color:#87988d;line-height:1.65;margin:6px 0 10px}',
'.ks-admin-result .ks-area-status{font-size:11px;color:#58766a;line-height:1.65;padding:10px;background:#f5faf7;border-radius:9px}',
'.ks-admin-result table{width:100%;border-collapse:collapse;font-size:10px}',
'.ks-admin-result td,.ks-admin-result th{padding:9px 5px;text-align:left;border-bottom:1px solid #e8f0ea;color:#506e5f}',
'.ks-admin-result td:last-child,.ks-admin-result th:last-child{text-align:right;white-space:nowrap}',
'.ks-admin-result th{font-weight:800;color:#37604d}',
'.ks-admin-result .ks-area-summary{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin:12px 0}',
'.ks-admin-result .ks-area-summary div{background:#eff7f1;border-radius:8px;padding:10px 7px;font-size:10px;color:#65806f}',
'.ks-admin-result .ks-area-summary b{display:block;font-size:14px;margin-top:6px;color:#28684d}',
'@media(max-width:1120px){.ks-filterbar{grid-template-columns:repeat(2,minmax(0,1fr))!important}.ks-admin-filter.type{grid-column:1;grid-row:3}.ks-admin-filter.area{grid-column:2;grid-row:3}}',
'@media(max-width:560px){.ks-filterbar{grid-template-columns:1fr!important}.ks-filterbar>label.fieldname{grid-column:1!important;grid-row:auto!important}.ks-filterbar>.input-wrap{grid-column:1!important;grid-row:auto!important}.ks-filterbar>.control:has(#cat){grid-column:1!important;grid-row:auto!important}.ks-admin-filter.type,.ks-admin-filter.area{grid-column:1;grid-row:auto}}'
].join('\n');
var style=document.createElement('style');style.id='ksas-admin-area-style';style.textContent=css;document.head.appendChild(style);
var typeBox=document.createElement('div');typeBox.className='ks-admin-filter type';
typeBox.innerHTML='<label for="ksas-area-type" class="fieldname">JENIS PENTADBIRAN</label><select id="ksas-area-type"><option value="pbt">PBT</option><option value="daerah">Daerah</option></select>';
var nameBox=document.createElement('div');nameBox.className='ks-admin-filter area';
nameBox.innerHTML='<label for="ksas-area-name" class="fieldname">PILIH KAWASAN</label><select id="ksas-area-name"><option value="">Semua Selangor</option></select>';
filterbar.appendChild(typeBox);filterbar.appendChild(nameBox);
var output=document.createElement('section');output.className='ks-admin-result';
output.innerHTML='<h3>Keluasan KSAS Mengikut Kawasan</h3><p>Pengiraan geometri berpotongan dengan sempadan yang dipilih; hektar. Jumlah fitur mungkin bertindih.</p><div id="ksas-area-output" class="ks-area-status">Pilih PBT atau daerah di bar penapis atas untuk analisis.</div>';
var info=right.querySelector('#info');
var infoPanel=info&&info.parentElement;
if(infoPanel)right.insertBefore(output,infoPanel);else right.appendChild(output);
var $=id=>document.getElementById(id), format=n=>Number(n).toLocaleString('ms-MY',{maximumFractionDigits:2});
var currentType='pbt',selected='',serial=0,cache=new Map(),turfPromise=null;
function allData(){return window.__suoKsasBoundaryData||{}}
function label(f,type){return window.__suoKsasBoundaryLabelFor?window.__suoKsasBoundaryLabelFor(f,type):''}
function source(){return window.__suoKsasOriginal||[]}
function setStatus(t){$('ksas-area-output').className='ks-area-status';$('ksas-area-output').textContent=t}
function populate(){
 var sel=$('ksas-area-name'),geo=allData()[currentType];
 sel.innerHTML='<option value="">Semua Selangor</option>';
 if(geo&&geo.features)Array.from(new Set(geo.features.map(f=>label(f,currentType)))).sort((a,b)=>{const order=currentType==='pbt'?SUO_PBT_ORDER:SUO_DAERAH_ORDER;const ai=order.indexOf(a),bi=order.indexOf(b);return (ai<0?999:ai)-(bi<0?999:bi)||a.localeCompare(b,'ms')}).forEach(n=>{
  var o=document.createElement('option');o.value=n;o.textContent=n;sel.appendChild(o);
 });
 sel.value=selected&&Array.from(sel.options).some(o=>o.value===selected)?selected:'';
 selected=sel.value;
}
function ensureTurf(){
 if(window.turf&&window.turf.intersect&&window.turf.area)return Promise.resolve(window.turf);
 if(turfPromise)return turfPromise;
 turfPromise=new Promise((resolve,reject)=>{
  var sc=document.createElement('script');
  sc.src='https://cdn.jsdelivr.net/npm/@turf/turf@6.5.0/turf.min.js';
  sc.onload=()=>window.turf&&window.turf.intersect?resolve(window.turf):reject(Error('Turf GIS tidak tersedia'));
  sc.onerror=()=>reject(Error('Pustaka spatial gagal dimuatkan'));
  document.head.appendChild(sc);
 }).catch(e=>{turfPromise=null;throw e});
 return turfPromise;
}
function bboxOverlap(a,b){return a[0]<=b[2]&&a[2]>=b[0]&&a[1]<=b[3]&&a[3]>=b[1]}
function render(result){
 var allowed=Array.from(document.querySelectorAll('.level:checked')).map(x=>String(x.value));
 var cat=document.getElementById('cat')?.value||'';
 var rows=result.records.filter(r=>allowed.includes(r.level)&&(!cat||r.cat===cat));
 var sums={},lv={'1':0,'2':0,'3':0},total=0;
 rows.forEach(r=>{sums[r.cat]=(sums[r.cat]||0)+r.area;lv[r.level]+=r.area;total+=r.area});
 var entries=Object.entries(sums).sort((a,b)=>b[1]-a[1]);
 var title=document.createElement('div');
 title.innerHTML='<b>'+currentType.toUpperCase()+' · '+selected+'</b>';
 var container=$('ksas-area-output');container.className='';container.replaceChildren(title);
 var metrics=document.createElement('div');metrics.className='ks-area-summary';
 ['1','2','3'].forEach(k=>{
  var d=document.createElement('div');d.textContent='Tahap '+k;
  var n=document.createElement('b');n.textContent=format(lv[k])+' ha';d.appendChild(n);metrics.appendChild(d);
 });
 container.appendChild(metrics);
 var amount=document.createElement('p');amount.textContent='Jumlah keluasan fitur mengikut penapis: '+format(total)+' ha. Kawasan bertindih boleh dikira lebih sekali.';container.appendChild(amount);
 var table=document.createElement('table');
 table.innerHTML='<thead><tr><th>Kategori KSAS</th><th>Keluasan (ha)</th></tr></thead>';
 var body=document.createElement('tbody');
 entries.forEach(([category,area])=>{
  var tr=document.createElement('tr'),td1=document.createElement('td'),td2=document.createElement('td');
  td1.textContent=category;td2.textContent=format(area);
  tr.append(td1,td2);body.appendChild(tr);
 });
 if(!entries.length){var tr=document.createElement('tr'),td=document.createElement('td');td.colSpan=2;td.textContent='Tiada fitur sepadan dengan pilihan tahap / kategori.';tr.appendChild(td);body.appendChild(tr)}
 table.appendChild(body);container.appendChild(table);
 var note=document.createElement('p');note.textContent='Kaedah: luas geometri persilangan (Turf GIS), bukan luas unik union/dissolve. Sumber KSAS: RSN Selangor 2035 (Pengubahan). Sempadan: SUO 3D GeoPortal.';container.appendChild(note);
}
async function run(){
 var id=++serial;
 if(!selected){setStatus('Pilih PBT atau daerah untuk melihat keluasan mengikut kategori KSAS.');return}
 var boundaries=allData()[currentType],features=source();
 if(!boundaries){setStatus('Memuatkan sempadan '+currentType.toUpperCase()+'…');return}
 if(!features.length){setStatus('Menunggu dataset KSAS dimuatkan…');return}
 var boundary=boundaries.features.find(f=>label(f,currentType)===selected);
 if(!boundary){setStatus('Sempadan kawasan tidak ditemui.');return}
 var key=currentType+'|'+selected+'|'+features.length;
 if(cache.has(key)){render(cache.get(key));return}
 setStatus('Mengira keluasan persilangan bagi '+selected+'…');
 try{
  var turf=await ensureTurf();if(id!==serial)return;
  var bb=turf.bbox(boundary),records=[],errors=0;
  for(var i=0;i<features.length;i++){
   if(id!==serial)return;
   var f=features[i],fb=turf.bbox(f);
   if(bboxOverlap(bb,fb)){
    try{
     var overlap=turf.intersect(f,boundary);
     if(overlap){var area=turf.area(overlap)/10000;if(area>0)records.push({level:String((f.properties||{}).tahap||''),cat:String((f.properties||{}).kategori_ksas||'Tidak dinyatakan'),area:area});}
    }catch(e){errors++;console.warn('KSAS clipping error',i,e)}
   }
   if(i%4===0)await new Promise(resolve=>setTimeout(resolve,0));
  }
  if(id!==serial)return;
  if(errors){setStatus('Pengiraan tidak lengkap: '+errors+' geometri gagal diproses. Tiada jumlah dipaparkan supaya keputusan tidak mengelirukan.');return}
  var result={records:records};
  cache.set(key,result);render(result);
 }catch(e){if(id===serial)setStatus('Tidak dapat menjalankan analisis: '+e.message)}
}
function syncMap(){
 if(!selected)return;
 var dropdown=document.getElementById(currentType==='pbt'?'ks-b-pbt-select':'ks-b-daerah-select');
 if(dropdown&&Array.from(dropdown.options).some(o=>o.value===selected)){
  dropdown.value=selected;dropdown.dispatchEvent(new Event('change',{bubbles:true}));
 }
}
$('ksas-area-type').addEventListener('change',e=>{currentType=e.target.value;selected='';populate();run()});
$('ksas-area-name').addEventListener('change',e=>{selected=e.target.value;syncMap();run()});
document.addEventListener('suo-ksas-boundary-data',e=>{if(e.detail.type===currentType){populate();run()}});
document.addEventListener('suo-ksas-original-ready',()=>{cache.clear();run()});
document.addEventListener('suo-ksas-boundary-selected',e=>{if(!e.detail||!e.detail.name)return;currentType=e.detail.type;selected=e.detail.name;$('ksas-area-type').value=currentType;populate();run()});
document.getElementById('cat')?.addEventListener('change',()=>{if(selected&&cache.has(currentType+'|'+selected+'|'+source().length))render(cache.get(currentType+'|'+selected+'|'+source().length))});
document.querySelectorAll('.level').forEach(x=>x.addEventListener('change',()=>{var key=currentType+'|'+selected+'|'+source().length;if(selected&&cache.has(key))render(cache.get(key))}));
populate();run();
})();