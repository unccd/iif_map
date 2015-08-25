# UNCCD IIF Map

Dynamic map of information about UNCCD Integrated Investment Frameworks.

[Live version](http://unccd.github.io/iif_map)

# Development

It's just HTML, CSS and plain JavaScript. 

You can optionally use [Gulp](http://gulpjs.com/) to help speed up development, but it's not required. To get it working, you'll need [NodeJS](https://nodejs.org/) installed. Install dependencies with `npm install`, then `gulp` to start serving a local version at <http://localhost:3000>. It uses [Browsersync](http://www.browsersync.io/) to autoreload the pages on file changes.


# Mapping

The maps use [jVectormap](http://jvectormap.com/). This is vector mapping library, which includes boundaries for all countries.

# Data processing

The raw data files (see `/data/original` folder) were processed using [OpenRefine](http://openrefine.org). This data was compared to and combined with the official list of [Member States of the United Nations](http://un.org/en/members/), and additional location data (e.g. lat/lon centre-points for countries too small to appear in the jVectormap dataset).

The example below shows the final data model created. It's designed to be fast to load and lightweight, containing all required data - and not requiring any joins to display the data. The file is `/data/iff_status.js`

## Example of `iif_status` model

```  
{
  "short_name": "Afghanistan",
  "iso3": "AFG",
  "region": null,
  "subregion": null,
  "acp": null,
  "dcp": null,
  "srap": null,
  "iif_or_plan": null,
  "iif_plan_start": null,
  "gm_supported": null,
  "description": null,
  "planned_other_voluntary_national_target": null,
  "lon": "66.026471",
  "lat": "33.838806",
  "iso2": "AF",
  "official_name": "The Islamic Republic of Afghanistan",
  "use_centre_point": false
}
```

# Filters and Filter Definitions

The `/admin_scripts/iif_status_def.yml` file describes the filters needed for the datasets. This can be edited, but needs to be recompiled into `/data/iif_status_def.js`.