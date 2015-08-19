## Filter Combinations

Getting a handle on how to combine filters, states - what makes sense, and how to control what's allowed.

### Fields

**Geo**

  - `region`: single one at a time
  - `subregion`: single one at a time
  - `country`: single one at a time


**Status (complex)**

- `iif_or_plan`: _main_ filter field, range of possible options [below](#detail_for_iif_or_plan)


**Subregional Action Programmes**

- `srap`: possible use as a pop-up, but not main switch of any kind

- `iif_established`: boolean (included in `iif_or_plan`)
- `planned_other_voluntary_national_target`: not used - 
- `iso3`, `iso2`, `lat`, `lon`: not used
- `use_centre_point`: only used for presentation (i.e. markers for small places)
- `description`: no 


## Field options

**`iif_or_plan`:**

- `iif` - has an IIF
- `plan` - has a plan for an IIF
- `no plan` - has no IIF, and no plan for an IIF
- `unknown` - no information

**`iif_plan_year`:**

- `2014_2015`
- `2016_2017`
- `2018_2019`
- `(blank)` - either has IIF, or has no plan, or is unknown


### Three views they want: 

1. 'has IIF, has no IIF'
2. 'has a plan for IIF, has no plan for IIF'
3. 'receives GM support, no GM support' [data to come]

### Queries for each

1. iif_or_plan 
2. iif_or_plan == 'plan'
3. receives_gm_support == true OR NOT
