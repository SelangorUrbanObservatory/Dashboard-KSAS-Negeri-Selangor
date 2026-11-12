# KSAS Spatial Intelligence — data pipeline

The dashboard now includes four modules: Spatial Explorer (PBT / Daerah), administrative ranking, Conservation Indicators, and RSN Policy Intelligence.

## Data used now
- Main layer: `data/KSAS_RSN2035_101_Dashboard.geojson` from RSN Selangor 2035 (Pengubahan), 101 GIS features.
- Existing archive fallback: `data/metadata.json` and chunked GeoJSON.
- Conservation Indicators use the **active dataset**. Summed feature areas can double-count overlaps.
- The state area of 833,720.73 ha (JUPEM 2024) is a **reference denominator only**; coverage percentage is not presented without a union/dissolve analysis.

## Pending official boundary integration
Administrative ranking and area breakdown **never invent** PBT or district measurements. They become active only when a validated `data/ksas_admin_intersection.json` is published.

Use official GeoJSON for all 12 PBT and 9 districts and run:

```sh
pip install geopandas shapely pyproj
python scripts/build_admin_intersection.py \
 --ksas data/KSAS_RSN2035_101_Dashboard.geojson \
 --pbt path/to/official_pbt.geojson \
 --daerah path/to/official_daerah.geojson \
 --pbt-name-field nama_pbt \
 --daerah-name-field nama_daerah
```

Inspect area totals, boundary validity, name mappings, overlap behavior and the correctness of the official source before publishing. The script uses equal-area EPSG:6933 and calculates the **sum of intersected feature areas**, not dissolved coverage. Its output includes provenance and generation time. If a name, CRS or required attribute is invalid, the script fails rather than silently inferring a match.

The JS loader validates the 12 PBT / 9 Daerah records, the metric and provenance fields. It deliberately shows a pending-data message until a valid file exists.

## Future verified analysis
Unique KSAS coverage (%) per PBT / daerah / state requires geometry union/dissolve within each reporting boundary. Neither the feature-area sums nor their sum across levels should be interpreted as unique coverage. Change detection additionally needs comparable dated datasets.

Do not publish a development suitability, gazette status or approval conclusion based on GIS `tahap` alone. Refer to RSN 2035 (Pengubahan) MP16, Rajah 5.3.17, Jadual 5.3.4, statutory plans and competent agencies.


## Ranking keluasan unik — versi terkini

Dashboard menggunakan \`js/ksas-unique-ranking.js\` dan \`js/ksas-unique-worker.js\` untuk mengira **luas union bagi setiap kawasan** secara berasingan daripada thread peta. Selepas persilangan setiap poligon KSAS dengan PBT/daerah, semua bahagian yang bertindih digabungkan (dissolve/union). Ranking memaparkan luas unik (ha) dan peratus daripada luas geometri pentadbiran, untuk semua tahap KSAS. Pilihan PBT/daerah di bahagian atas dashboard menjadi kawalan tunggal; tiada dropdown Spatial Explorer kedua.

* Dataset kecil (sehingga 300 fitur): pekerja GIS pada pelayar mengira semua 12 PBT atau 9 daerah. Ia memaparkan status pengiraan dan hanya menerbitkan ranking **selepas semua kawasan berjaya dikira**, bukan berdasarkan hasil separa.
* Dataset besar/arkib (4,886 fitur): gunakan proses offline di bawah. Ini mengelakkan operasi union yang berat pada peranti mudah alih.
* **Jangan kelirukan** jumlah luas fitur terpotong (modul Analitik KSAS sedia ada) dengan keluasan unik (modul Ranking baharu); kedua-duanya ukuran yang berbeza.
* Jika sumber atau geometri gagal, aplikasi memaparkan amaran tanpa mereka-reka angka.
* Keluasan geometri berdasarkan Turf (pelayar, sfera) atau EPSG:6933 (offline, equal-area) perlu diaudit sebelum dipetik sebagai statistik rasmi.

### Jana fail analitik praproses yang boleh diterbitkan
\`\`\`sh
pip install "geopandas>=1.0" "shapely>=2" pyproj
python scripts/build_unique_coverage.py \
  --ksas data/KSAS_RSN2035_101_Dashboard.geojson \
  --pbt /path/to/sempadan_pbt_selangor_2024.geojson \
  --daerah /path/to/sempadan_daerah_selangor.geojson \
  --pbt-name-field NAMA_PBT \
  --daerah-name-field NAMA_DAERAH \
  --output data/ksas_admin_unique.json
\`\`\`

For the archive, pass \`--ksas-mode archive --archive-dir data\`. Before publishing, check validity, correct boundary fields, the provenance of both datasets and all computed results. The dashboard only loads the precomputed file when it contains complete ranking rows for all 12 PBT or 9 districts, matches the active source count and dataset mode, and includes its provenance.

**Status**: Interface and calculation engines are implemented. The precomputed output file is **not** in the repository until the GIS process has actually been run; do not claim its values were calculated/verified before that step.
