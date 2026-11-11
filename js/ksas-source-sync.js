(function(){'use strict';
document.addEventListener('suo-ksas-data',function(e){
 var d=e.detail||{},primary=!!d.source101;
 var count=d.counts||{},n1=count['1']||0,n2=count['2']||0,n3=count['3']||0;
 var panel=document.getElementById('kenali-ksas');
 if(panel){
  var mainCount=panel.querySelectorAll('.ks-feature b');if(mainCount.length>=3)mainCount[2].textContent=Number(d.total).toLocaleString('ms-MY');
  var levels=panel.querySelectorAll('.ks-level-content strong');
  [n1,n2,n3].forEach(function(n,i){if(levels[i])levels[i].textContent=n.toLocaleString('ms-MY')});
  var note=panel.querySelector('.ks-note');
  if(note)note.textContent=primary?'Ketiga-tiga tahap tersedia dalam workspace vektor RSN 2035. Bilangan ini ialah objek GIS, bukan bilangan kawasan unik.':'Tahap 3 tiada dalam dataset arkib; fail vektor RSN 2035 baharu belum diterbitkan.';
 }
 var rsn=document.getElementById('rsn-ksas');
 if(rsn){
  var records=rsn.querySelectorAll('.rsn-record b');
  [n1,n2,n3].forEach(function(n,i){if(records[i])records[i].textContent=n.toLocaleString('ms-MY')+' poligon'});
  var warn=rsn.querySelector('.rsn-box.warning p');
  if(warn)warn.textContent=primary?
   'GeoJSON utama dihasilkan daripada KSAS.TAB dalam workspace RSN Selangor 2035 (Pengubahan). Ketiga-tiga tahap tersedia, tetapi jenis KSAS, nama kawasan serta status pewartaan bagi setiap objek belum terdapat dalam atribut sumber.':
   'Paparan kini menggunakan dataset arkib 4,886 poligon. GeoJSON utama 101 poligon RSN 2035 belum dimuat naik; angka statistik arkib tidak boleh dianggap lengkap untuk ketiga-tiga tahap.';
 }
});
})();