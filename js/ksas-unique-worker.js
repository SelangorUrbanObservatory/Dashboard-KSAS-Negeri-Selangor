/* KSAS unique-coverage ranking worker. No guessed areas, no centroid approximations. */
'use strict';
try{importScripts('https://cdn.jsdelivr.net/npm/@turf/turf@6.5.0/turf.min.js')}catch(e){postMessage({kind:'error',message:'Pustaka spatial gagal dimuatkan: '+e.message});}
const fmtError=e=>e&&e.message?e.message:String(e);
function clipAndUnion(features,boundary){
 const bbox=turf.bbox(boundary),clipped=[],levels={'1':[],'2':[],'3':[]};
 for(const f of features){
  const fb=turf.bbox(f);
  if(fb[0]>bbox[2]||fb[2]<bbox[0]||fb[1]>bbox[3]||fb[3]<bbox[1])continue;
  const overlap=turf.intersect(f,boundary);
  if(!overlap)continue;
  if(!(turf.area(overlap)>0))continue;
  clipped.push(overlap);
  const k=String((f.properties||{}).tahap||'');
  if(levels[k])levels[k].push(overlap);
 }
 function uniqueArea(arr){
  if(!arr.length)return 0;
  let united=arr[0];
  for(let i=1;i<arr.length;i++){
   const merged=turf.union(united,arr[i]);
   if(!merged)throw Error('Union gagal bagi fitur '+(i+1));
   united=merged;
  }
  return turf.area(united)/10000;
 }
 const total=uniqueArea(clipped),level={};
 for(const k of ['1','2','3'])level[k]=uniqueArea(levels[k]);
 const boundaryHa=turf.area(boundary)/10000;
 if(!Number.isFinite(total)||!Number.isFinite(boundaryHa)||boundaryHa<=0)throw Error('Keluasan geometri tidak sah');
 if(total>boundaryHa*1.015+0.02)throw Error('Keluasan unik melebihi luas kawasan');
 return {unique_ha:total,boundary_ha:boundaryHa,coverage_pct:100*total/boundaryHa,
  by_level_unique_ha:level,intersected_count:clipped.length};
}
onmessage=e=>{
 const m=e.data||{};
 if(m.kind!=='rank')return;
 if(typeof turf==='undefined'){postMessage({kind:'error',type:m.type,message:'Turf GIS tidak tersedia'});return}
 const rows=[],seen=new Set();
 try{
  for(const item of m.areas){
   const name=item.name;
   if(seen.has(name))throw Error('Sempadan pendua: '+name);
   seen.add(name);
   const result=clipAndUnion(m.features,item.feature);
   rows.push({name,...result});
   postMessage({kind:'progress',type:m.type,completed:rows.length,total:m.areas.length});
  }
  postMessage({kind:'complete',type:m.type,rows,metric:'union_clipped_geometries_ha',source_count:m.features.length});
 }catch(err){
  postMessage({kind:'error',type:m.type,message:'Analisis '+(rows.length+1)+'/'+m.areas.length+': '+fmtError(err)});
 }
};
