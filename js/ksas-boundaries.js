(function(){
'use strict';
const ROOT='https://selangorurbanobservatory.github.io/3D-Geoportal/data/pentadbiran/';
const files={pbt:'sempadan_pbt_selangor_2024.geojson',daerah:'sempadan_daerah_selangor.geojson'};
const shortcuts={'Majlis Bandaraya Shah Alam':'MBSA','Majlis Bandaraya Petaling Jaya':'MBPJ','Majlis Bandaraya Subang Jaya':'MBSJ','Majlis Bandaraya Diraja Klang':'MBDK','Majlis Perbandaran Selayang':'MPS','Majlis Perbandaran Ampang Jaya':'MPAJ','Majlis Perbandaran Kajang':'MPKJ','Majlis Perbandaran Sepang':'MPSp','Majlis Perbandaran Kuala Langat':'MPKL','Majlis Perbandaran Kuala Selangor':'MPKS','Majlis Perbandaran Hulu Selangor':'MPHS','Majlis Daerah Sabak Bernam':'MDSB'};
const names=['Petaling','Klang','Gombak','Hulu Langat','Sepang','Kuala Langat','Kuala Selangor','Hulu Selangor','Sabak Bernam'];
const $=id=>document.getElementById(id);
const map=window.__suoKsasMap;
const panel=document.querySelector('.workspace>.right');
if(!window.L||!map||!panel)return;
const css=[
'.ks-boundary{margin:14px 0 10px;padding:13px;border:1px solid #e2ece7;border-radius:12px;background:#f7fbf9}',
'.ks-boundary h3{font:800 12px "Plus Jakarta Sans",sans-serif;margin:0 0 10px;color:#31584a}',
'.ks-boundary-controls{display:flex;flex-wrap:wrap;gap:8px 13px}',
'.ks-boundary-controls label{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:#526d61;cursor:pointer}',
'.ks-boundary-controls input{accent-color:#458e76}',
'.ks-boundary-key{width:16px;border-top:2px solid;display:inline-block}',
'.ks-boundary-status{font-size:10px;line-height:1.5;color:#84978e;margin:8px 0 0}',
'.ks-admin-selection{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:11px}',
'.ks-admin-selection select{width:100%;min-width:0;padding:9px;border:1px solid #dce7e1;border-radius:8px;background:#fff;font-size:11px;color:#496357}',
'.ks-boundary-text{background:rgba(255,255,255,.93);border:1px solid #cdded8;border-radius:7px;box-shadow:0 2px 8px #163a3224;color:#315849;font:800 11px "DM Sans",sans-serif;padding:4px 7px;white-space:nowrap;text-align:center;pointer-events:none}',
'.ks-boundary-text.daerah{border-color:#c8b6e8;color:#5a2d96;font-size:12px}',
'@media(max-width:520px){.ks-admin-selection{grid-template-columns:1fr}}'
].join('\n');
let style=document.createElement('style');style.id='ksas-admin-boundary-style';style.textContent=css;document.head.appendChild(style);
const section=document.createElement('section');section.className='ks-boundary';section.innerHTML=
'<h3>Sempadan Pentadbiran</h3><div class="ks-boundary-controls">'+
'<label><input type="checkbox" id="ks-b-pbt" checked><i class="ks-boundary-key" style="border-color:#d58a43"></i>PBT</label>'+
'<label><input type="checkbox" id="ks-b-daerah"><i class="ks-boundary-key" style="border-color:#7542b5"></i>Daerah</label></div>'+
'<div class="ks-admin-selection"><select id="ks-b-pbt-select" aria-label="Fokus PBT"><option value="">Pilih PBT</option></select><select id="ks-b-daerah-select" aria-label="Fokus daerah"><option value="">Pilih daerah</option></select></div>'+
'<p class="ks-boundary-status" id="ks-boundary-status">Memuatkan sempadan GeoJSON SUO…</p>';
const stats=$('stats');if(stats)panel.insertBefore(section,stats);else panel.prepend(section);
const configs={pbt:{color:'#d58a43',target:$('ks-b-pbt-select'),toggle:$('ks-b-pbt')},daerah:{color:'#7542b5',target:$('ks-b-daerah-select'),toggle:$('ks-b-daerah')}};
const layers={};const labelLayers={};const data={};const state={pbt:'',daerah:''};
// Dedicated panes remain above all KSAS fills and linework even after filter redraw.
if(!map.getPane('ksas-boundaries'))map.createPane('ksas-boundaries');
map.getPane('ksas-boundaries').style.zIndex='625';
if(!map.getPane('ksas-admin-labels'))map.createPane('ksas-admin-labels');
map.getPane('ksas-admin-labels').style.zIndex='630';
map.getPane('ksas-admin-labels').style.pointerEvents='none';
function isCollection(j){return j&&j.type==='FeatureCollection'&&Array.isArray(j.features)&&j.features.length>0}
function labelFor(feature,type){
 const p=feature.properties||{};
 if(type==='pbt'){let full=p.NAMA_PBT||p.web_name||p.nama_pbt||p.Nama_PBT||'';return shortcuts[full]||full||'PBT';}
 const keys=['NAMA_DAERAH','Nama_Daerah','nama_daerah','DAERAH','Daerah','daerah','DISTRICT','NAME_2','NAM','Name','name'];
 for(const k of keys){if(p[k]&&typeof p[k]==='string'){const v=p[k].trim();const m=names.find(n=>n.toLowerCase()===v.toLowerCase()||v.toLowerCase().endsWith(n.toLowerCase()));if(m)return m;}}
 return Object.values(p).map(String).map(x=>x.trim()).find(x=>names.some(n=>n.toLowerCase()===x.toLowerCase()))||'Daerah';
}
function announce(msg){$('ks-boundary-status').textContent=msg;}
function sync3D(){
 const mb=window.__suoKsasMapbox;
 if(!mb||!mb.isStyleLoaded||!mb.isStyleLoaded())return;
 for(const type of ['pbt','daerah']){
  if(!data[type])continue;
  const sourceId='ks-admin-'+type,layerId=sourceId+'-outline';
  const pointSource=sourceId+'-labels',labelId=sourceId+'-text';
  try{
   if(!mb.getSource(sourceId))mb.addSource(sourceId,{type:'geojson',data:data[type]});
   if(!mb.getLayer(layerId))mb.addLayer({id:layerId,type:'line',source:sourceId,
    paint:{'line-color':configs[type].color,'line-width':type==='pbt'?2.5:3,'line-opacity':.95,
           'line-dasharray':type==='daerah'?[4,3]:[1,0.01]}});
   if(!mb.getSource(pointSource)){
    let pointFeatures=data[type].features.map(f=>{
     const b=L.geoJSON(f).getBounds(),center=b.getCenter();
     return {type:'Feature',properties:{nama:labelFor(f,type)},
       geometry:{type:'Point',coordinates:[center.lng,center.lat]}};
    });
    mb.addSource(pointSource,{type:'geojson',data:{type:'FeatureCollection',features:pointFeatures}});
   }
   if(!mb.getLayer(labelId))mb.addLayer({id:labelId,type:'symbol',source:pointSource,
    layout:{'text-field':['get','nama'],'text-size':type==='pbt'?12:13,
      'text-font':['Open Sans Bold','Arial Unicode MS Bold'],'text-allow-overlap':false,
      'text-padding':3,'text-anchor':'center'},
    paint:{'text-color':type==='pbt'?'#704523':'#24576f',
      'text-halo-color':'#ffffff','text-halo-width':2.2,'text-halo-blur':.3}});
   // Keep both boundary and label layers above KSAS polygons after style reload.
   mb.moveLayer(layerId);
   mb.moveLayer(labelId);
   const visible=configs[type].toggle.checked?'visible':'none';
   mb.setLayoutProperty(layerId,'visibility',visible);
   mb.setLayoutProperty(labelId,'visibility',visible);
  }catch(e){console.warn('3D boundary sync',type,e)}
 }
}
document.addEventListener('suo-ksas-mapbox-ready',sync3D);
function redraw(){
 sync3D();
 for(const type of ['pbt','daerah']){
  const layer=layers[type],labels=labelLayers[type];
  if(!layer)continue;
  const show=configs[type].toggle.checked;
  if(show){if(!map.hasLayer(layer))layer.addTo(map);
    if(labels&&!map.hasLayer(labels))labels.addTo(map);
    layer.bringToFront();
  }else{
   if(map.hasLayer(layer))map.removeLayer(layer);
   if(labels&&map.hasLayer(labels))map.removeLayer(labels);
  }
  layer.eachLayer(l=>{
   const n=labelFor(l.feature,type),chosen=state[type]===n;
   l.setStyle({color:configs[type].color,weight:chosen?4:(type==='pbt'?2.5:3),
    opacity:chosen?1:.95,fill:false,dashArray:type==='daerah'?'6 5':null});
  });
 }
}
function focus(type,name){
 state[type]=name;
 if(!name){redraw();return}
 configs[type].toggle.checked=true;redraw();
 const feature=data[type]&&data[type].features.find(f=>labelFor(f,type)===name);
 if(!feature)return;
 const bounds=L.geoJSON(feature).getBounds();
 if(!bounds.isValid())return;
 const mb=window.__suoKsasMapbox;
 if($('map3d').classList.contains('active')&&mb){
  mb.fitBounds([[bounds.getWest(),bounds.getSouth()],[bounds.getEast(),bounds.getNorth()]],
   {padding:65,maxZoom:12,pitch:50});
 }else{
  map.fitBounds(bounds,{padding:[28,28],maxZoom:12});
 }
 // Persistent admin name in the panel, plus map labels for every enabled boundary.
 announce('Dipilih: '+(type==='pbt'?'PBT':'Daerah')+' '+name+' · sempadan rasmi rujukan SUO');
}
for(const type of ['pbt','daerah']){
 configs[type].toggle.addEventListener('change',redraw);
 configs[type].target.addEventListener('change',e=>focus(type,e.target.value));
}
async function load(type){
 const res=await fetch(ROOT+files[type],{cache:'force-cache'});
 if(!res.ok)throw Error('HTTP '+res.status);
 const geo=await res.json();if(!isCollection(geo))throw Error('GeoJSON kosong / tidak sah');
 const expected=type==='pbt'?12:9;
 if(geo.features.length!==expected)throw Error('Bilangan sempadan '+geo.features.length+' tidak sama dengan '+expected);
 const layer=L.geoJSON(geo,{pane:'ksas-boundaries',style:{color:configs[type].color,weight:type==='pbt'?2.5:3,opacity:.95,fill:false,dashArray:type==='daerah'?'6 5':null},
  onEachFeature:(f,l)=>{
   const name=labelFor(f,type);
   l.bindTooltip(name,{sticky:true,direction:'top'});
   l.on('click',()=>{
    const select=configs[type].target;
    if(Array.from(select.options).some(o=>o.value===name)){select.value=name;focus(type,name);}
    else {let b=l.getBounds();if(b.isValid())map.fitBounds(b,{padding:[28,28]});}
   });
  }});
 data[type]=geo;layers[type]=layer;
 // A lightweight, permanent label layer above the polygons, independently toggled.
 const markers=geo.features.map(f=>{
   const b=L.geoJSON(f).getBounds();
   if(!b.isValid())return null;
   const name=labelFor(f,type);
   const text=String(name).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
   return L.marker(b.getCenter(),{pane:'ksas-admin-labels',interactive:false,
     icon:L.divIcon({className:'',html:'<div class="ks-boundary-text '+type+'">'+text+'</div>',iconSize:[0,0],iconAnchor:[0,0]})});
 }).filter(Boolean);
 labelLayers[type]=L.layerGroup(markers);
 const labels=Array.from(new Set(geo.features.map(f=>labelFor(f,type)))).sort((a,b)=>a.localeCompare(b,'ms'));
 for(const n of labels){const o=document.createElement('option');o.value=n;o.textContent=n;configs[type].target.appendChild(o)}
 sync3D();
 document.dispatchEvent(new CustomEvent('suo-ksas-boundary-loaded',{detail:{type,features:geo.features.length,labels}}));
 redraw();return geo.features.length;
}
Promise.allSettled([load('pbt'),load('daerah')]).then(r=>{
 announce(['pbt','daerah'].map((type,i)=>r[i].status==='fulfilled'?(type.toUpperCase()+': '+r[i].value+' sempadan tersedia'):(type.toUpperCase()+': gagal dimuatkan')).join(' · '));
});
})();