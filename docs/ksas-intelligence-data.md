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
