# UNCCD IIF Map

Dynamic map of information about UNCCD Integrated Investment Frameworks.

[Bare live version (Github pages)](http://unccd.github.io/iif_map)

[Embedded live version](http://www.unccd.int/en/programmes/Capacity-building/CBW/Resources/Pages/IIF-Map.aspx)

# Serving the application

It is already live through [Github pages](http://unccd.github.io/iif_map). This version is rebuilt on every commit to the `gh-pages` branch. Any updates to application, data or configuration will be reflected (almost) immediately.

In addition, all files can be [downloaded](https://github.com/unccd/iif_map/archive/gh-pages.zip).

# Development

The application is just HTML, CSS and plain JavaScript. 

You can optionally use [Gulp](http://gulpjs.com/) to help speed up development, but it's not required. To get it working, you'll need [NodeJS](https://nodejs.org/) installed. Install dependencies with `npm install`, then `gulp` to start serving a local version at <http://localhost:3000>. It uses [Browsersync](http://www.browsersync.io/) to autoreload the pages on file changes.


# Mapping

The maps use [jVectormap](http://jvectormap.com/). This is vector mapping library, which includes boundaries for most countries. There are some discrepancies which are handled to ensure the map is accurate (see [below](#country_data_discrepancies)).

# Data processing

The raw data files (in `/data/original` folder) were processed using [OpenRefine](http://openrefine.org). 

This data was compared to and combined with the official list of [Member States of the United Nations](http://un.org/en/members/), and [FAO's Country codes/names data](http://www.fao.org/countryprofiles/iso3list/en/), with additional location data (e.g. lat/lon centre-points) added for countries too small to appear in the jVectormap boundaries.

The example below shows the final data model created. It's designed to be fast to load and lightweight, containing all required data - and not requiring any joins to display the data. The file is bootstrapped into the application at load through `/data/iff_status.js`.

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

## Updating the data

You can edit the `data/source_iif_status.json` file. It then needs to be recompiled into the `data/iif_status.js` file by running `node data/process_data.js`.

For reference, an example of the OpenRefine project used to prepare the initial data is included in the `/data/original` folder, but it is not likely to be up to date. 

# Filters and Filter Definitions

A single file describes all the filters available for the data. Check `/data/source_iif_status_def.yml`. This can be edited, e.g. to change colours or filter text, but needs to then be recompiled into `/data/iif_status_def.js`, by running `node data/process_data.js`.


# Country Data Discrepancies

The following is a list of countries on the official list of UN Countries for which there is **not** a matching boundary in the jVectormaps data. For these countries, a lat/lon centre point location exists, and is used to place a marker on the map to indicate location.

short_name|iso3|iso2|faostat_code|uni_code
----------|----|----|------------|--------
Andorra|AND|AD|6|20
Antigua and Barbuda|ATG|AG|8|28
Bahrain|BHR|BH|13|48
Barbados|BRB|BB|14|52
Cabo Verde|CPV|CV|35|132
Comoros|COM|KM|45|174
Cook Islands|COK|CK|47|184
Dominica|DMA|DM|55|212
Grenada|GRD|GD|86|308
Kiribati|KIR|KI|83|296
Maldives|MDV|MV|132|462
Malta|MLT|MT|134|470
Marshall Islands|MHL|MH|127|584
Mauritius|MUS|MU|137|480
Micronesia (Federated States of)|FSM|FM|145|583
Monaco|MCO|MC|140|492
Nauru|NRU|NR|148|520
Niue|NIU|NU|160|570
Palau|PLW|PW|180|585
Saint Kitts and Nevis|KNA|KN|188|659
Saint Lucia|LCA|LC|189|662
Saint Vincent and the Grenadines|VCT|VC|191|670
Samoa|WSM|WS|244|882
San Marino|SMR|SM|192|674
Sao Tome and Principe|STP|ST|193|678
Seychelles|SYC|SC|196|690
Singapore|SGP|SG|200|702
Tonga|TON|TO|219|776
Tuvalu|TUV|TV|227|798

* The `fao_stat` and `uni_code` fields are from the [FAO Country names data](http://www.fao.org/countryprofiles/iso3list/en/)

