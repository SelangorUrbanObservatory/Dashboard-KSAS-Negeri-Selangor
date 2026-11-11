(function(){
'use strict';
var styles=[
'.rsn-section{margin:24px 0 18px;scroll-margin-top:18px;position:relative}',
'.rsn-header{background:linear-gradient(114deg,#183b3d,#24685a 60%,#34916b);color:white;position:relative;overflow:hidden;border-radius:19px 19px 0 0;padding:27px 31px}',
'.rsn-header:before{content:"";position:absolute;right:-60px;top:-120px;width:350px;height:350px;background:repeating-radial-gradient(ellipse at center,transparent 0 25px,#ffffff16 26px 27px,transparent 29px 49px);pointer-events:none}',
'.rsn-header:after{content:"RSN";position:absolute;right:28px;bottom:-31px;color:#ffffff14;font:900 145px "Plus Jakarta Sans",sans-serif;letter-spacing:-12px;pointer-events:none}',
'.rsn-header .rsn-eyebrow{font-size:10px;letter-spacing:2px;font-weight:800;color:#f7d982}',
'.rsn-header h2{font:800 clamp(21px,2.4vw,30px) "Plus Jakarta Sans",sans-serif;letter-spacing:-1px;margin:8px 0 7px;position:relative;z-index:1}',
'.rsn-header p{font-size:12px;line-height:1.65;margin:0;max-width:760px;color:#d3e8e2;position:relative;z-index:1}',
'.rsn-body{background:#fff;border:1px solid #deebe5;border-top:0;border-radius:0 0 19px 19px;padding:24px 25px}',
'.rsn-levels{display:grid;grid-template-columns:repeat(3,1fr);gap:13px}',
'.rsn-level{border-radius:14px;padding:17px;min-width:0;position:relative;border:1px solid #e4ebea;background:linear-gradient(140deg,#fcfdfc,#f7faf8);transition:transform .25s ease}',
'.rsn-level:hover{transform:translateY(-3px)}',
'.rsn-level:nth-child(1){border-top:5px solid #225d31}.rsn-level:nth-child(2){border-top:5px solid #6ba837}.rsn-level:nth-child(3){border-top:5px solid #b8d66d}',
'.rsn-level .rsn-number{font:900 44px/1 "Plus Jakarta Sans",sans-serif;letter-spacing:-2px;color:#2d7b5b}',
'.rsn-level:nth-child(2) .rsn-number{color:#679f3a}.rsn-level:nth-child(3) .rsn-number{color:#8fae3f}',
'.rsn-level h3{font:800 13px/1.42 "Plus Jakarta Sans",sans-serif;min-height:57px;margin:9px 0 11px;color:#213d39}',
'.rsn-level ul{margin:0;padding-left:17px;font-size:11px;color:#566e69;line-height:1.8}',
'.rsn-level .rsn-record{margin-top:13px;border-top:1px solid #e6eeea;padding-top:11px;font-size:10px;font-weight:800;color:#748a81}',
'.rsn-level .rsn-record b{font-size:12px;color:#276e50}',
'.rsn-compare{display:grid;grid-template-columns:1fr 1fr;gap:13px;margin-top:15px}',
'.rsn-box{border-radius:12px;padding:15px 17px;background:#eef8f3;border:1px solid #d5ebdd}',
'.rsn-box.warning{background:#fff9ee;border-color:#eedfb9}',
'.rsn-box h4{margin:0 0 5px;font-size:12px;color:#2f6e55}.rsn-box.warning h4{color:#96682a}',
'.rsn-box p{margin:0;font-size:11px;color:#60776d;line-height:1.7}.rsn-box.warning p{color:#88765d}',
'.rsn-source{font-size:10px;color:#83948f;line-height:1.7;margin:14px 0 0}',
'.rsn-tag{display:inline-block;background:#f7e6b4;color:#67532a;font-weight:800;border-radius:5px;padding:4px 7px;font-size:10px}',
'@media(max-width:850px){.rsn-levels{grid-template-columns:1fr}.rsn-level h3{min-height:0}.rsn-compare{grid-template-columns:1fr}}',
'@media(max-width:550px){.rsn-header{padding:22px 19px}.rsn-body{padding:15px}.rsn-header:after{font-size:90px;bottom:-14px}}',
'@media(prefers-reduced-motion:reduce){.rsn-level{transition:none}.rsn-level:hover{transform:none}}'
].join('');
var style=document.createElement('style');style.id='rsn-ksas-style';style.textContent=styles;document.head.appendChild(style);
var section=document.createElement('section');section.className='rsn-section';section.id='rsn-ksas';
section.innerHTML='<div class="rsn-header"><span class="rsn-eyebrow">DASAR NEGERI · RUJUKAN SPATIAL</span><h2>KSAS dalam RSN Selangor 2035 (Pengubahan)</h2><p>Rujukan: Rajah 5.3.17 dan Jadual 5.3.4 — Kriteria Tahap Kawasan Sensitif Alam Sekitar di Selangor. Tafsiran negeri perlu dibaca bersama dasar dan panduan nasional yang berkuat kuasa.</p></div>'+
'<div class="rsn-body"><div class="rsn-levels">'+
'<article class="rsn-level"><div class="rsn-number">01</div><h3>Kawasan penting yang telah diwartakan</h3><ul><li>Kawasan perlindungan daratan dan marin yang diwartakan</li><li>Tadahan empangan sedia ada dan cadangan</li><li>Kawasan melebihi kontur 1,000 m</li><li>Zon ladang hutan dalam HSK tertentu</li></ul><div class="rsn-record">Rekod dataset semasa: <b>4,849 poligon</b></div></article>'+
'<article class="rsn-level"><div class="rsn-number">02</div><h3>Belum diwartakan tetapi dikenal pasti sebagai habitat penting</h3><ul><li>Kawasan biodiversiti penting di luar perlindungan</li><li>HSK kelas pengeluaran</li><li>Rangkaian Ekologi Central Forest Spine</li><li>Hutan, tanah bencah dan kawasan berkaitan</li></ul><div class="rsn-record">Rekod dataset semasa: <b>37 poligon</b></div></article>'+
'<article class="rsn-level"><div class="rsn-number">03</div><h3>Kawasan penggunaan mampan</h3><ul><li>Tadahan takat pengambilan air dan imbuhan air bawah tanah</li><li>Kontur 150 hingga 300 m</li><li>Kawasan persisiran pantai</li><li>Kawasan penting untuk sekuriti makanan</li></ul><div class="rsn-record">Rekod dataset semasa: <b>0 poligon*</b></div></article>'+
'</div><div class="rsn-compare">'+
'<div class="rsn-box"><h4>🗺️ RSN sebagai asas tafsiran negeri</h4><p>Rajah 5.3.17 menunjukkan taburan KSAS Negeri Selangor berdasarkan tiga tahap, manakala Jadual 5.3.4 memperincikan kriteria kawasan dan prinsip pengurusan. Pelan dalam laporan bersifat diagram atau indikatif seperti nota pada rajah.</p></div>'+
'<div class="rsn-box warning"><h4>⚠️ Jurang data GIS semasa</h4><p>GeoJSON yang dimuatkan ke dashboard hanya mengandungi atribut tahap dan keluasan; medan jenis KSAS, nama kawasan dan status pewartaan belum tersedia. *Tiada rekod Tahap 3 bukan bukti ketiadaan kawasan Tahap 3 di Selangor.*</p></div>'+
'</div><p class="rsn-source"><span class="rsn-tag">SUMBER RSN</span> Rancangan Struktur Negeri Selangor 2035 (Pengubahan), Rajah 5.3.17 (T2-90) dan Jadual 5.3.4. Ringkasan ini memetik kategori dasar; ia bukan penentuan automatik jenis atau status poligon individu.</p></div>';
var ref=document.getElementById('kenali-ksas');if(ref)ref.parentNode.insertBefore(section,ref);
var nav=document.querySelector('.ks-nav');if(nav){var a=document.createElement('a');a.href='#rsn-ksas';a.textContent='🗺 RSN Selangor 2035';nav.appendChild(a)}
if(location.hash==='#rsn-ksas')requestAnimationFrame(function(){section.scrollIntoView({block:'start'})});
})();