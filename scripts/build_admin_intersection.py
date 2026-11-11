#!/usr/bin/env python3
"""Create verified area-by-administration inputs for the KSAS dashboard.

Inputs: official KSAS GeoJSON and official PBT/Daerah boundary GeoJSON.
No sample or synthetic administrative boundaries are used.
Run: python scripts/build_admin_intersection.py --ksas data/KSAS_RSN2035_101_Dashboard.geojson --pbt /path/pbt.geojson --daerah /path/daerah.geojson
Requires: geopandas, shapely, pyproj.
"""
import argparse
import json
from pathlib import Path
from datetime import datetime, timezone

import geopandas as gpd

PBT = ['MBSA','MBPJ','MBSJ','MBDK','MPS','MPAJ','MPKJ','MPSp','MPKL','MPKS','MPHS','MDSB']
DAERAH = ['Petaling','Klang','Gombak','Hulu Langat','Sepang','Kuala Langat','Kuala Selangor','Hulu Selangor','Sabak Bernam']

def read(path):
    gdf = gpd.read_file(path)
    if gdf.crs is None:
        raise ValueError(f'Missing CRS: {path}. Set the source CRS explicitly before running.')
    gdf = gdf[gdf.geometry.notna() & ~gdf.geometry.is_empty].copy()
    return gdf.to_crs('EPSG:6933')

def validate_name(gdf, field, expected):
    if field not in gdf.columns:
        raise ValueError(f'Administrative name field {field!r} absent; fields: {list(gdf.columns)}')
    gdf[field] = gdf[field].astype(str).str.strip()
    names = set(gdf[field].unique())
    missing = set(expected) - names
    extra = names - set(expected)
    if missing or extra:
        raise ValueError(f'Name mismatch; missing={sorted(missing)}, extra={sorted(extra)}')
    return gdf.dissolve(by=field)

def intersect(ksas, administrative, names):
    output=[]
    for name in names:
        boundary = administrative.loc[name].geometry
        ha = boundary.area / 10000
        per_level={'1':0.0,'2':0.0,'3':0.0}
        total=0.0
        for row in ksas.itertuples():
            shape = row.geometry
            if shape is None or shape.is_empty or not shape.intersects(boundary):
                continue
            amount = shape.intersection(boundary).area / 10000
            total += amount
            level = str(getattr(row,'tahap',''))
            if level in per_level:
                per_level[level] += amount
        output.append({'name':name,'boundary_ha':round(ha,4),'total_ha':round(total,4),
                       'by_level_ha':{k:round(v,4) for k,v in per_level.items()}})
    return output

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--ksas',required=True)
    ap.add_argument('--pbt',required=True)
    ap.add_argument('--daerah',required=True)
    ap.add_argument('--pbt-name-field',default='nama_pbt')
    ap.add_argument('--daerah-name-field',default='nama_daerah')
    ap.add_argument('--output',default='data/ksas_admin_intersection.json')
    args=ap.parse_args()
    ksas=read(args.ksas)
    if 'tahap' not in ksas.columns:
        raise ValueError('KSAS dataset must include tahap field')
    pbt=validate_name(read(args.pbt),args.pbt_name_field,PBT)
    daerah=validate_name(read(args.daerah),args.daerah_name_field,DAERAH)
    result={
      'status':'verified',
      'metric':'intersected_feature_area_ha',
      'source_ksas':str(args.ksas),
      'source_boundary':{'pbt':str(args.pbt),'daerah':str(args.daerah)},
      'generated_at':datetime.now(timezone.utc).isoformat(),
      'crs_calculation':'EPSG:6933',
      'method':'sum of per-feature intersection areas; not dissolved coverage',
      'pbt':intersect(ksas,pbt,PBT),
      'daerah':intersect(ksas,daerah,DAERAH)
    }
    dest=Path(args.output)
    dest.parent.mkdir(parents=True,exist_ok=True)
    dest.write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    print(f'Wrote {dest}; {len(PBT)} PBT and {len(DAERAH)} daerah')

if __name__=='__main__':
    main()
