# Dashboard KSAS Negeri Selangor | SUO

Dashboard KSAS Intelligence dibangunkan baharu untuk Selangor Urban Observatory (SUO).

## Status penerbitan data
- **4,886 poligon KSAS** telah dimasukkan ke folder `data/` dalam **20 fail GeoJSON**, bermula `ksas-01.geojson` hingga `ksas-20.geojson`.
- `data/metadata.json` menyenaraikan semua fail yang dimuatkan secara automatik oleh `index.html`.
- **4,849 Tahap 1**, **37 Tahap 2** dan **tiada Tahap 3**.
- Sumber asal ialah fail MapInfo `KSAS.TAB` daripada `KSAS.zip`, ditukar kepada GeoJSON WGS84 (EPSG:4326).
- Sebanyak 367 geometri asal dibaiki sebelum eksport.
- Statistik keluasan adalah **indikatif**, belum disahkan terhadap versi RSN Selangor 2035 (Pengubahan) / RT berkuat kuasa. Atribut luas asal tidak sepadan dengan pengiraan geometri.
- Dataset tiada medan PBT dan daerah; fungsi penapis mengikut PBT/daerah memerlukan proses spatial join.
- Pastikan hak penerbitan dataset dan status pewartaan disahkan oleh pemilik data.

## Fungsi semasa
Peta Leaflet, layer Tahap 1 dan 2, penapis kategori, maklumat poligon, statistik keluasan geometri dan eksport GeoJSON ditapis, dengan susun atur responsif untuk telefon.

## Paparan
https://selangorurbanobservatory.github.io/Dashboard-KSAS-Negeri-Selangor/

**Nota:** GitHub Pages mesti diaktifkan melalui Settings → Pages → Deploy from a branch → main /(root). Jangan anggap portal live sehingga penerbitan berjaya disahkan.

## Audit
- Rekod: 4,886
- Keluasan jumlah geometri yang dibaiki: 644,738.50 ha (termasuk pertindihan fitur)
- Keluasan liputan unik anggaran: 642,734.46 ha
- Jumlah atribut `luas_h`: 963,763.92 ha (tidak digunakan sebagai statistik rasmi)
