## Example IIFStatus record model

```  
{
  "region": "Africa",
  "subregion": "Central Africa",
  "country": "Burundi",
  "srap": false,
  "iif_status": "plan_exists",
  "iif_established": true,
  "planned_other_voluntary_national_target": null,
  "iso3": "BDI",
  "iso2": "BI",
  "lat": "-3.356175",
  "lon": "29.887145",
  "use_centre_point": false,
  "description": "Burundi is implementing a detailed program for developing agriculture in Africa (PDDAA), as well as an action plan regarding NEPAD’s environmental initiative."
}
```

## Options for `plan` field

  - `plan_exists`
  - `2014_2015`
  - `2016_2017`
  - `2018_2019`
  - `no_plan`
  - `no_answer`


## Example of Explorer view data model

```
{
  selectedCountry: CountryModel
}
```