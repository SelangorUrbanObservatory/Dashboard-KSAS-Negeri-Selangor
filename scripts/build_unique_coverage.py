#!/usr/bin/env python3
"""Prepare *unique* KSAS coverage per PBT and Daerah from the current official vector data.

This is an offline/prepublish GIS calculation, not synthetic/estimated data.
Uses exact polygon intersection and unary_union. Features may overlap;
they are counted only once within each boundary.
Requirements: geopandas>=1.0, shapely>=2, pyproj
Example:
 python scripts/build_unique_coverage.py --ksas data/KSAS_RSN2035_101_Dashboard.geojson \
 --pbt path/to/sempadan_pbt_selangor_2024.geojson \
 --daerah path/to/sempadan_daerah_selangor.geojson
Optional: --ksas-mode archive reads metadata.json chunks instead of the 101 source.
"""
import argparse
import json
from pathlib import Path
from datetime import datetime, timezone

import geopandas as gpd
from shapely.ops import unary_union
from shapely.validation import explain_validity

PBT = ['MBSA','MBPJ','MBSJ','MBDK','MPS','MPAJ','MPKJ','MPSp','MPKL','MPKS','MPHS','MDSB']
DAERAH = ['Petaling','Klang','Gombak','Hulu Langat','Sepang','Kuala Langat','Kuala Selangor','Hulu Selangor','Sabak Bernam']
PBT_MAP = {
'Majlis Bandaraya Shah Alam':'MBSA','Majlis Bandaraya Petaling Jaya':'MBPJ',
'Majlis Bandaraya Subang Jaya':'MBSJ','Majlis Bandaraya Diraja Klang':'MBDK',
'Majlis Perbandaran Selayang':'MPS','Majlis Perbandaran Ampang Jaya':'MPAJ',
'Majlis Perbandaran Kajang':'MPKJ','Majlis Perbandaran Sepang':'MPSp',
'Majlis Perbandaran Kuala Langat':'MPKL','Majlis Perbandaran Kuala Selangor':'MPKS',
'Majlis Perbandaran Hulu Selangor':'MPHS','Majlis Daerah Sabak Bernam':'MDSB'
}

def load_geojson(path):
    path=Path(path)
    frame=gpd.read_file(path)
    if frame.crs is None:
        raise ValueError(f'GeoJSON missing CRS: {path}')
    frame=frame[frame.geometry.notna() & ~frame.geometry.is_empty].copy()
    if not len(frame):
        raise ValueError(f'Empty geometry: {path}')
    return frame.to_crs('EPSG:6933')

def read_archive(dirpath):
    base=Path(dirpath)
    meta=json.loads((base/'metadata.json').read_text(encoding='utf-8'))
    if not isinstance(meta.get('chunks'),list):
        raise ValueError('Archive metadata has no chunks')
    features=[]
    for file in meta['chunks']:
        payload=json.loads((base/file).read_text(encoding='utf-8'))
        features.extend(payload['features'])
    from shapely.geometry import shape
    geometries=[shape(f['geometry']) for f in features]
    attrs=[f.get('properties') or {} for f in features]
    frame=gpd.GeoDataFrame(attrs,geometry=geometries,crs='EPSG:4326')
    return frame.to_crs('EPSG:6933')

def normalize_boundary(frame,field,expected,alias=None):
    if field not in frame:
        raise ValueError(f'Expected boundary field {field} missing, found {list(frame.columns)}')
    names=frame[field].astype(str).str.strip().replace(alias or {})
    frame=frame.assign(_region_name=names)
    observed=set(names)
    if set(expected)!=observed:
        raise ValueError(f'Boundary names mismatch: missing={sorted(set(expected)-observed)}, extra={sorted(observed-set(expected))}')
    bad=frame.loc[~frame.geometry.is_valid]
    if len(bad):
        raise ValueError(f'{len(bad)} invalid administrative boundaries; repair and document first')
    return frame.dissolve(by='_region_name')

def calculate(ksas,boundaries,expected):
    output=[]
    bad=ksas.loc[~ksas.geometry.is_valid]
    if len(bad):
        first=bad.iloc[0]
        raise ValueError(f'{len(bad)} invalid KSAS polygons ({explain_validity(first.geometry)}). Repair source and document the process before use.')
    for name in expected:
        boundary=boundaries.loc[name].geometry
        clips=[]
        by_level={'1':[],'2':[],'3':[]}
        for _,feature in ksas.iterrows():
            geom=feature.geometry
            if geom.is_empty or not geom.intersects(boundary):
                continue
            clipped=geom.intersection(boundary)
            if clipped.is_empty or clipped.area<=0:
                continue
            clips.append(clipped)
            stage=str(feature.get('tahap',''))
            if stage in by_level:by_level[stage].append(clipped)
        unique_ha=unary_union(clips).area/1e4 if clips else 0.0
        boundary_ha=boundary.area/1e4
        if unique_ha>boundary_ha+max(0.02,boundary_ha*0.001):
            raise ValueError(f'Invalid union coverage for {name}: {unique_ha} > {boundary_ha}')
        level_ha={k:round(unary_union(items).area/1e4,4) if items else 0.0 for k,items in by_level.items()}
        output.append({
         'name':name,'unique_ha':round(unique_ha,4),
         'boundary_ha':round(boundary_ha,4),'coverage_pct':round(unique_ha/boundary_ha*100,6),
         'by_level_unique_ha':level_ha,'intersected_count':len(clips)
        })
        print(f'{name}: {unique_ha:,.2f} ha ({len(clips)} intersecting features)')
    return output

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--ksas',default='data/KSAS_RSN2035_101_Dashboard.geojson')
    parser.add_argument('--ksas-mode',choices=['primary_101','archive'],default='primary_101')
    parser.add_argument('--archive-dir',default='data')
    parser.add_argument('--pbt',required=True)
    parser.add_argument('--daerah',required=True)
    parser.add_argument('--pbt-name-field',default='NAMA_PBT')
    parser.add_argument('--daerah-name-field',default='NAMA_DAERAH')
    parser.add_argument('--output',default='data/ksas_admin_unique.json')
    args=parser.parse_args()
    ksas=read_archive(args.archive_dir) if args.ksas_mode=='archive' else load_geojson(args.ksas)
    if 'tahap' not in ksas:
        raise ValueError('KSAS layer lacks tahap field')
    pbt=normalize_boundary(load_geojson(args.pbt),args.pbt_name_field,PBT,PBT_MAP)
    daerah=normalize_boundary(load_geojson(args.daerah),args.daerah_name_field,DAERAH)
    result={
      'metric':'union_clipped_geometries_ha',
      'status':'computed_requires_review',
      'source_count':len(ksas),
      'source_dataset':args.ksas_mode,
      'source_ksas':args.ksas if args.ksas_mode=='primary_101' else args.archive_dir,
      'source_boundary':{'pbt':args.pbt,'daerah':args.daerah},
      'crs_calculation':'EPSG:6933',
      'generated_at':datetime.now(timezone.utc).isoformat(),
      'method':'Intersect every feature with administrative polygon then unary_union; no feature-area summing',
      'pbt':calculate(ksas,pbt,PBT),
      'daerah':calculate(ksas,daerah,DAERAH),
    }
    output=Path(args.output);output.parent.mkdir(parents=True,exist_ok=True)
    output.write_text(json.dumps(result,indent=2,ensure_ascii=False),encoding='utf-8')
    print(f'Wrote {output}: {len(PBT)} PBT and {len(DAERAH)} Daerah; validate against source before publication')

if __name__=='__main__':main()
