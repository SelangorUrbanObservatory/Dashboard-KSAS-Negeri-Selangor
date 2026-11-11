(function(){
'use strict';
var css=`
.rsn-section{margin:31px 0 25px;scroll-margin-top:20px}
.rsn-header{background:radial-gradient(circle at 82% 2%,rgba(250,213,122,.17),transparent 31%),linear-gradient(112deg,#17443e,#22735c 67%,#319371);color:#fff;padding:29px 32px;border-radius:20px 20px 0 0;position:relative;overflow:hidden}
.rsn-header:after{content:"MP16";position:absolute;right:13px;bottom:-37px;font:900 clamp(70px,11vw,153px) 'Plus Jakarta Sans',sans-serif;color:#ffffff10;pointer-events:none}
.rsn-header>*{position:relative;z-index:1}
.rsn-eyebrow{font-size:10px;font-weight:800;letter-spacing:2px;color:#f7d782}
.rsn-header h2{font:800 clamp(22px,2.6vw,32px) 'Plus Jakarta Sans',sans-serif;letter-spacing:-1.1px;margin:9px 0}
.rsn-header p{font-size:12px;line-height:1.75;max-width:840px;margin:0;color:#d6eee5}
.rsn-body{background:#fff;border:1px solid #deebe5;border-top:0;border-radius:0 0 20px 20px;padding:25px}
.rsn-policy{padding:19px 22px;border:1px solid #d9e6db;background:linear-gradient(105deg,#f3faf5,#fff);border-left:5px solid #2b9b71;border-radius:14px;margin-bottom:20px}
.rsn-small{font-size:10px;letter-spacing:1.35px;font-weight:900;color:#278467}
.rsn-policy p{font-size:clamp(13px,1.3vw,16px);font-weight:800;line-height:1.65;color:#24483d;margin:9px 0}
.rsn-policy small{font-size:11px;color:#6c827b}
.rsn-subheading{font:800 15px 'Plus Jakarta Sans',sans-serif;color:#254c41;margin:19px 0 12px}
.rsn-levels{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:13px}
.rsn-level{border:1px solid #e1eae5;border-radius:15px;padding:17px;background:#fcfefd;position:relative;min-width:0;transition:transform .22s ease}
.rsn-level:hover{transform:translateY(-3px)}
.rsn-level:nth-child(1){border-top:5px solid #276340}.rsn-level:nth-child(2){border-top:5px solid #74a83c}.rsn-level:nth-child(3){border-top:5px solid #c4d46b}
.rsn-num{font:900 37px/1 'Plus Jakarta Sans',sans-serif;color:#2a7657}
.rsn-level:nth-child(2) .rsn-num{color:#719e3d}.rsn-level:nth-child(3) .rsn-num{color:#9ab045}
.rsn-level h3{font:800 13px/1.5 'Plus Jakarta Sans',sans-serif;color:#29453e;margin:12px 0 7px}
.rsn-level p,.rsn-level li{font-size:11px;line-height:1.7;color:#657b73}
.rsn-level ul{padding-left:16px;margin:7px 0 0}
.rsn-record{padding-top:11px;margin-top:13px;border-top:1px solid #e8eeeb;color:#748780;font-size:10px;font-weight:700}
.rsn-record b{color:#236c50;font-size:12px}
.rsn-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:11px}
.rsn-topic{background:#f7faf8;border:1px solid #e2ebe5;border-radius:13px;padding:15px}
.rsn-topic .rsn-icon{font-size:23px}
.rsn-topic b{display:block;font-size:12px;color:#285446;margin:7px 0 5px}
.rsn-topic p{margin:0;font-size:11px;line-height:1.6;color:#6a8077}
.rsn-management{display:grid;grid-template-columns:1fr 1fr;gap:13px;margin-top:18px}
.rsn-box{border:1px solid #dceadf;border-radius:13px;padding:16px 17px;background:#f1f9f4}
.rsn-box.warning{border-color:#eadbb9;background:#fffaf0}
.rsn-box h4{font-size:12px;color:#2d6f50;margin:0 0 7px}
.rsn-box.warning h4{color:#946c2d}
.rsn-box p{font-size:11px;line-height:1.75;color:#60776a;margin:0}
.rsn-box.warning p{color:#82765d}
.rsn-source{border-top:1px solid #e8efea;padding-top:14px;margin:18px 0 0;color:#82958c;font-size:10px;line-height:1.75}
.rsn-tag{font-weight:900;color:#7c5a27;background:#fff0c5;border-radius:6px;padding:4px 7px;margin-right:5px}
@media(max-width:950px){.rsn-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:760px){.rsn-levels,.rsn-management{grid-template-columns:1fr}.rsn-header{padding:24px 20px}.rsn-body{padding:17px}.rsn-header:after{font-size:76px;bottom:-15px}}
@media(max-width:470px){.rsn-grid{grid-template-columns:1fr}.rsn-level{padding:15px}.rsn-policy{padding:15px}}
@media(prefers-reduced-motion:reduce){.rsn-level{transition:none}.rsn-level:hover{transform:none}}
`;
var style=document.createElement('style');style.id='rsn-ksas-style';style.textContent=css;document.head.appendChild(style);
var section=document.createElement('section');section.className='rsn-section';section.id='rsn-ksas';
section.innerHTML=`
<div class="rsn-header"><span class="rsn-eyebrow">DASAR NEGERI · RSN SELANGOR 2035 (PENGUBAHAN)</span><h2>Dasar dan Pengurusan KSAS Negeri Selangor</h2><p>Rujukan dasar negeri untuk membaca peta, memahami tahap kesensitifan dan menentukan keperluan semakan dalam perancangan pembangunan.</p></div>
<div class="rsn-body">
<div class="rsn-policy"><span class="rsn-small">DASAR MP16</span><p>Kawasan Sensitif Alam Sekitar (KSAS) akan diurus berdasarkan tahap KSAS serta diintegrasikan dengan perancangan guna tanah keseluruhan.</p><small>Dasar MP16 · RSN Selangor 2035 (Pengubahan)</small></div>
<h3 class="rsn-subheading">Tiga tahap kesensitifan dan prinsip pengurusan</h3>
<div class="rsn-levels">
<article class="rsn-level"><div class="rsn-num">01</div><h3>Perlindungan sangat tinggi</h3><p>Keutamaan pemeliharaan; pembangunan dilarang bagi kawasan yang tertakluk pada kriteria perlindungan Tahap 1.</p><ul><li>Kawasan perlindungan yang diwartakan</li><li>Tadahan empangan</li><li>Kawasan melebihi kontur 1,000 m</li></ul><div class="rsn-record">Objek spatial semasa: <b>—</b></div></article>
<article class="rsn-level"><div class="rsn-num">02</div><h3>Kawalan pembangunan yang ketat</h3><p>Pembangunan sangat terhad dan tertakluk kepada kriteria, syarat serta semakan agensi yang berkenaan.</p><ul><li>Habitat biodiversiti penting belum diwartakan</li><li>Hutan pengeluaran</li><li>Koridor ekologi Central Forest Spine</li></ul><div class="rsn-record">Objek spatial semasa: <b>—</b></div></article>
<article class="rsn-level"><div class="rsn-num">03</div><h3>Penggunaan mampan dan terkawal</h3><p>Aktiviti boleh dipertimbangkan secara terkawal mengikut jenis kawasan, keupayaan tampungan dan dasar terpakai.</p><ul><li>Kontur 150–300 m</li><li>Kawasan persisiran pantai</li><li>Kawasan penting keterjaminan makanan</li></ul><div class="rsn-record">Objek spatial semasa: <b>—</b></div></article>
</div>
<h3 class="rsn-subheading">Kriteria kawasan yang perlu dirujuk bersama Jadual 5.3.4</h3>
<div class="rsn-grid">
<div class="rsn-topic"><div class="rsn-icon">🌳</div><b>Hutan dan biodiversiti</b><p>Hutan Simpanan Kekal, kawasan perlindungan, habitat penting dan jaringan ekologi.</p></div>
<div class="rsn-topic"><div class="rsn-icon">⛰️</div><b>Tanah tinggi dan cerun</b><p>Kriteria kontur dan kesensitifan kawasan bukit serta lereng; penilaian mengikut lokasi sebenar.</p></div>
<div class="rsn-topic"><div class="rsn-icon">💧</div><b>Empangan dan sumber air</b><p>Tadahan empangan, kawasan pengambilan air dan fungsi imbuhan serta perlindungan sumber air.</p></div>
<div class="rsn-topic"><div class="rsn-icon">🌿</div><b>Tanah bencah dan gambut</b><p>Ekosistem sensitif yang memerlukan pendekatan pemeliharaan dan pengurusan khusus.</p></div>
<div class="rsn-topic"><div class="rsn-icon">🌊</div><b>Sungai dan pesisiran</b><p>Koridor sungai, kawasan pesisir dan fungsi alam sekitar yang tertakluk kepada kawalan berkaitan.</p></div>
<div class="rsn-topic"><div class="rsn-icon">🌾</div><b>Keterjaminan makanan</b><p>Kawasan sumber pengeluaran makanan yang perlu diurus untuk kelestarian jangka panjang.</p></div>
</div>
<div class="rsn-management">
<div class="rsn-box"><h4>Pelaksanaan MP16 dan inisiatif P1</h4><p>Kawalan KSAS perlu diselaraskan antara tahap kesensitifan, jenis kawasan dan rancangan guna tanah. Pelaksanaan melibatkan agensi perancangan, teknikal dan pihak berkuasa berkaitan. Penilaian projek tidak boleh dibuat daripada warna atau nombor tahap pada peta sahaja.</p></div>
<div class="rsn-box warning"><h4>Had tafsiran dataset GIS</h4><p>Memuatkan maklumat sumber GIS...</p></div>
</div>
<p class="rsn-source"><span class="rsn-tag">SUMBER RSN</span> RSN Selangor 2035 (Pengubahan), Dasar MP16, inisiatif P1, Rajah 5.3.17 dan Jadual 5.3.4. Maklumat ini ialah ringkasan untuk penerangan dasar, bukan pengesahan pewartaan atau keputusan kelulusan bagi poligon individu. Pelan dan data spatial perlu disemak bersama sumber rasmi berkaitan.</p>
</div>`;
var ref=document.getElementById('kenali-ksas');
if(ref)ref.parentNode.insertBefore(section,ref);
else{var footer=document.querySelector('.footer');if(footer)footer.parentNode.insertBefore(section,footer)}
if(location.hash==='#rsn-ksas')requestAnimationFrame(function(){section.scrollIntoView({block:'start'})});
})();