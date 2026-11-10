# SUO Dashboard KSAS Negeri Selangor

Dashboard baharu beridentiti Selangor Urban Observatory (SUO). Tidak menggunakan reka bentuk dashboard Pemantauan KSAS lama.

## Status deploy
- Aplikasi utama `index.html` sudah dimuat naik dalam repository.
- **Data spatial belum dimuat naik ke GitHub**. Dapatkan pakej penuh `Dashboard-KSAS-SUO-Data-Integrated.zip` daripada perbualan ChatGPT, ekstrak, dan muat naik folder `data/` melalui GitHub (Add file → Upload files).
- Apabila folder `data/` lengkap, dashboard secara automatik membaca `data/metadata.json` dan kesemua fail GeoJSON yang disenaraikan.
- Untuk GitHub Pages: Settings → Pages → Deploy from a branch → main → /(root).

## Audit KSAS.zip
Fail diterima ialah MapInfo native `KSAS.TAB` sebanyak **4,886 rekod**; **4,849 Tahap 1** dan **37 Tahap 2**; tiada Tahap 3. Sebanyak **367 geometri tidak sah** memerlukan pembaikan. Jumlah atribut `luas_h` adalah **963,763.92 ha**, berlainan daripada jumlah luas geometri yang dibaiki (**644,738.50 ha**). Anggaran liputan unik geometri yang dibaiki ialah **642,734.46 ha**. Ini **belum merupakan statistik rasmi yang disahkan**.

Fail sumber tidak mempunyai medan PBT atau daerah, dan tidak disertakan metadata pengesahan versi atau status pewartaan. Semak keselarasan dengan RSN Selangor 2035 (Pengubahan), RT dan hak penerbitan sebelum digunapakai sebagai rujukan rasmi.

## Fungsi tersedia
Peta Leaflet, kategori dan tahap, statistik luas indikatif, maklumat poligon, eksport GeoJSON serta susun atur desktop/mobile. Versi lengkap dalam pakej ZIP juga mengandungi modul analitik, eksport CSV dan saringan awal tapak. Saringan tidak menggantikan penilaian perancangan sebenar.

## URL sasaran
https://selangorurbanobservatory.github.io/Dashboard-KSAS-Negeri-Selangor/
