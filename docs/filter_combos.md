## Filter Combinations

Getting a handle on how to combine filters, states - what makes sense, and how to control what's allowed.

### Fields

1. Geo

- region: single one at a time
- subregion: single one at a time
- country: single one at a time

2. Status (complex)

- iif_status: MAIN filter field, range of possible options

3. Subregional Action Programmes

- srap: possible use as a pop-up, but not main switch of any kind

- iif_established: boolean (included in `iif_status`)
- planned_other_voluntary_national_target: not used - 
- iso3, iso2, lat, lon: not used
- use_centre_point: only used for presentation (i.e. markers for small places)
- description: no 
