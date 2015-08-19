## Filter Combinations

Getting a handle on how to combine filters, states - what makes sense, and how to control what's allowed.

### Fields

**Geo**

  - `region`: single one at a time
  - `subregion`: single one at a time
  - `country`: single one at a time


**Status (complex)**

- `iif_status`: _main_ filter field, range of possible options [below](#detail_for_iif_status)


**Subregional Action Programmes**

- `srap`: possible use as a pop-up, but not main switch of any kind

- `iif_established`: boolean (included in `iif_status`)
- `planned_other_voluntary_national_target`: not used - 
- `iso3`, `iso2`, `lat`, `lon`: not used
- `use_centre_point`: only used for presentation (i.e. markers for small places)
- `description`: no 


## Detail for `iif_status`

### Three views they want: 

1. 'has IIF, has no IIF'
2. 'has a plan for IIF, has no plan for IIF'
3. 'receives GM support, no GM support' [data to come]

### Queries for each

1. iif_status == 'plan_exists' OR NOT
2. above is true and (iif_status == 'no_plan' OR NOT)
3. receives_gm_support == true OR NOT
