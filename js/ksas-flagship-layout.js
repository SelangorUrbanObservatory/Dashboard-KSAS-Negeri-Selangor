(function(){
'use strict';
// Layout-only integration; original Leaflet/Mapbox and analytic handlers remain intact.
const main=document.querySelector('main'),workspace=document.querySelector('.workspace');
const left=workspace&&workspace.querySelector('aside.side:not(.right)'),mapPanel=workspace&&workspace.querySelector('.map-panel');
const right=workspace&&workspace.querySelector('aside.right');
if(!main||!workspace||!left||!mapPanel||!right)return;
const style=document.createElement('style');
style.id='suo-ksas-flagship-layout';
style.textContent=[
'.kpis{grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-bottom:16px}',
'.kpis>.kpi:nth-child(5){display:none}',
'.kpi{min-height:118px;border-radius:16px;padding:19px 21px;background:linear-gradient(135deg,#f2f8f3,#e4f0e7)!important;border:1px solid #cfdfd3!important}',
'.kpi:nth-child(2){background:linear-gradient(135deg,#edf7f0,#dcefe5)!important}',
'.kpi:nth-child(3){background:linear-gradient(135deg,#f5f7e7,#eaf0d2)!important}',
'.kpi:nth-child(4){background:linear-gradient(135deg,#fcf7e9,#f4e8d0)!important}',
'.kpi .kvalue{color:#225e4a;font-size:clamp(23px,2.4vw,34px)}',
'.ks-filterbar{display:grid!important;grid-template-columns:minmax(220px,1.25fr) minmax(200px,1fr);gap:14px;align-items:end;padding:17px 20px;margin:0 0 16px;border-radius:16px}',
'.ks-filterbar>.section-head,.ks-filterbar>.hr,.ks-filterbar .data-note{display:none!important}',
'.ks-filterbar>label.fieldname{grid-column:1;grid-row:1;margin-bottom:-9px}',
'.ks-filterbar>.input-wrap{grid-column:1;grid-row:2}',
'.ks-filterbar>.control{margin:0}',
'.ks-filterbar>.control:has(#cat){grid-column:2;grid-row:1 / 3}',
'.ks-level-analytics{display:none!important}',
'.ks-stat-toggle{display:inline-flex;align-items:center;gap:7px;font-size:11px;font-weight:800;color:#526477;cursor:pointer}',
'.ks-stat-toggle input{width:15px;height:15px;margin:0;accent-color:#b93b48;cursor:pointer;flex:none}',
'.ks-stat-toggle .swatch{margin:0;flex:none}',
'.ks-stat-disabled .stat-top,.ks-stat-disabled .ksub{opacity:.6}',
'.ks-stat-disabled .bar{opacity:.45}',
'.ks-level-analytics>.fieldname{font-size:10px;color:#60796d;letter-spacing:.65px;margin:0 0 6px}',
'.ks-level-analytics .check-row{display:inline-flex;align-items:center;gap:6px;margin:5px 10px 5px 0;font-size:11px;white-space:nowrap}',
'.ks-level-analytics .check-row input{width:14px;height:14px}',
'.ks-level-analytics .check-row small,.ks-level-analytics .data-note{display:none!important}',
'.ks-filterbar .control .fieldname{margin-bottom:9px}',
'.ks-filterbar .check-row{display:inline-flex;margin:3px 12px 4px 0;white-space:nowrap}',
'.ks-filterbar .check-row small{display:none}',
'.ks-filterbar .search,.ks-filterbar .select{background:#fafcfa;min-height:43px}',
'.workspace{grid-template-columns:minmax(0,1.95fr) minmax(310px,.86fr);gap:15px;align-items:stretch}',
'.workspace>.map-panel{grid-column:1;grid-row:1;order:0;min-width:0}',
'.workspace>.right{grid-column:2;grid-row:1;display:block!important;min-width:0;padding:17px!important}',
'.workspace>.right .hr{margin:14px 0}',
'.workspace>.right .stats{margin-top:6px}',
'.workspace>.right .statrow{margin:11px 0}',
'.workspace #map,.workspace #map3d{height:640px;min-height:580px}',
'.map-head{border-bottom:1px solid #e4ede6;background:linear-gradient(90deg,#eef8f1,#f8fbf4)}',
'.map-head h2{font-size:15px}',
'.ks-list{margin-top:14px;border-top:1px solid #e7eee9;padding-top:14px}',
'.ks-list h3{font:800 13px "Plus Jakarta Sans",sans-serif;margin:0 0 4px}',
'.ks-list .ks-list-caption{font-size:10px;color:#81928a;margin-bottom:10px}',
'.ks-list .ks-list-scroll{max-height:268px;overflow-y:auto;border:1px solid #e6eee8;border-radius:10px}',
'.ks-list table{width:100%;border-collapse:collapse;font-size:10px}',
'.ks-list th{text-align:left;color:#597766;background:#f2f7f2;font-weight:800;position:sticky;top:0;padding:10px 8px;z-index:1}',
'.ks-list td{border-bottom:1px solid #eff3ef;padding:9px 8px;color:#4f6559}',
'.ks-list tr[data-feature-index]{cursor:pointer}',
'.ks-list tr[data-feature-index]:hover,.ks-list tr[data-feature-index]:focus{background:#e8f5ed;outline:none}',
'.ks-list .ks-level-pill{display:inline-block;border-radius:20px;background:#e8f2e7;color:#337c56;padding:3px 6px;font-weight:800}',
'.ks-list-empty{padding:18px;color:#87998e;font-size:11px;line-height:1.6}',
'@media(max-width:1180px){.workspace{grid-template-columns:minmax(0,1.55fr) minmax(280px,.95fr)}.ks-filterbar{grid-template-columns:1fr 1fr}.ks-filterbar>.control:has(#cat){grid-column:2;grid-row:1/3}}',
'@media(max-width:830px){.workspace{grid-template-columns:1fr}.workspace>.map-panel{grid-column:1;grid-row:1}.workspace>.right{grid-column:1;grid-row:2}.ks-filterbar{grid-template-columns:1fr 1fr}.kpis{grid-template-columns:repeat(2,1fr)}.workspace #map,.workspace #map3d{height:56vh;min-height:400px}}',
'@media(max-width:540px){.ks-filterbar{grid-template-columns:1fr;padding:14px}.ks-filterbar>label.fieldname{grid-column:1;grid-row:auto}.ks-filterbar>.input-wrap{grid-column:1;grid-row:auto} .ks-filterbar>.control:has(#cat){grid-column:1;grid-row:auto}.ks-filterbar .check-row{margin-right:9px}.kpi{min-height:104px;padding:15px}.kpi .kvalue{font-size:22px}.map-actions{flex-wrap:wrap}.workspace #map,.workspace #map3d{height:50vh;min-height:360px}}'
].join('\n');
document.head.appendChild(style);
left.classList.add('ks-filterbar');
workspace.parentNode.insertBefore(left,workspace);
const levelControl=left.querySelector('.control:has(.level)');
const statContainer=right.querySelector('#stats');
if(levelControl&&statContainer){
 levelControl.classList.add('ks-level-analytics');
 right.insertBefore(levelControl,statContainer);
 levelControl.querySelector('.fieldname').textContent='PAPARAN LAPISAN MENGIKUT TAHAP';
}

const panel=document.createElement('section');panel.className='ks-list';panel.innerHTML='<h3>Senarai Poligon KSAS</h3><p class="ks-list-caption">Klik baris untuk fokus pada peta · berdasarkan penapis aktif</p><div class="ks-list-scroll" id="ks-list-scroll"><div class="ks-list-empty">Memuatkan data kawasan…</div></div>';
right.appendChild(panel);
function safe(s){return String(s==null?'—':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function nfmt(n){const v=Number(n);return Number.isFinite(v)?v.toLocaleString('ms-MY',{maximumFractionDigits:1}):'—'}
function render(){
 const features=window.__suoKsasFiltered||[];
 const slot=document.getElementById('ks-list-scroll');
 if(!features.length){slot.innerHTML='<div class="ks-list-empty">Tiada poligon sepadan dengan penapis.</div>';return}
 const shown=features.slice(0,250);
 slot.innerHTML='<table><thead><tr><th>ID / Kategori</th><th>Tahap</th><th>Luas (ha)</th></tr></thead><tbody>'+shown.map((f,i)=>{
 const p=f.properties||{},id=p.ksas_id||p.nama||('Poligon '+(i+1)),cat=p.kategori_ksas||'KSAS';
 return '<tr tabindex="0" role="button" data-feature-index="'+i+'" aria-label="Fokus '+safe(id)+'"><td><b>'+safe(id)+'</b><div>'+safe(cat)+'</div></td><td><span class="ks-level-pill">'+safe(p.tahap)+'</span></td><td>'+nfmt(p.luas_geometri_ha)+'</td></tr>'
 }).join('')+'</tbody></table>'+(features.length>shown.length?'<div class="ks-list-empty">Memaparkan 250 daripada '+features.length+' poligon. Gunakan penapis untuk mengecilkan senarai.</div>':'');
}
const focus=(target)=>{const i=Number(target.dataset.featureIndex),f=(window.__suoKsasFiltered||[])[i];if(f)document.dispatchEvent(new CustomEvent('suo-ksas-focus',{detail:{feature:f}}))};
panel.addEventListener('click',e=>{let row=e.target.closest('[data-feature-index]');if(row)focus(row)});
panel.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){let row=e.target.closest('[data-feature-index]');if(row){e.preventDefault();focus(row)}}});
document.addEventListener('suo-ksas-filtered',render);
requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')));
render();
})();