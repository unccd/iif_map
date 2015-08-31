# UNCCD IIF Map

Dynamic map of information about UNCCD Integrated Investment Frameworks.

[Bare live version (Github pages)](http://unccd.github.io/iif_map)

[Embedded live version](http://www.unccd.int/en/programmes/Capacity-building/CBW/Resources/Pages/IIF-Map.aspx)

# Deploying / Serving the application

It is already live through [Github pages](http://unccd.github.io/iif_map). This version is rebuilt on every commit to the `gh-pages` branch. Any updates to application, data or configuration will be reflected here (almost) immediately.

An zipped archive of the required files can be [downloaded](https://github.com/unccd/iif_map/archive/gh-pages.zip). The whole folder needs to be unzipped and placed on the server. In addition to `index.html`, files in the `js`, `ext`, `css` and `data` folders need to be servable. 

## Embedding in iframe

To embed in an iframe, point the iframe `src` to `index.html` of the application. It is designed to fit in a frame of _700px_ width and _450px_ height.

# Development

The application is just HTML, CSS and JavaScript. 

You can optionally use [Gulp](http://gulpjs.com/) to help speed up development, but it's not required. To get it working, you'll need [NodeJS](https://nodejs.org/) installed. Install dependencies with `npm install`, then `gulp` to start serving a local version at <http://localhost:3000>. It uses [Browsersync](http://www.browsersync.io/) to autoreload the pages on file changes.

## Libraries

The application uses [Ractive](http://ractivejs.org/) to manage views and state. [Backbone](http://backbonejs.org/) and [Backbone.QueryCollection](https://github.com/davidgtonge/backbone_query) are used for manipulating and faceting the data. [jQuery](http://jquery.com) and [Underscore](http://underscorejs.org) are also used. The application includes locally-served versions of these libraries.


# Mapping

The maps use [jVectormap](http://jvectormap.com/). This is vector mapping library, which includes boundaries for most countries. There are some discrepancies which are handled to ensure the map is accurate (see [below](#country_data_discrepancies)).


# Browser support

The application is designed to work in all [modern browsers](http://browsehappy.com/). It has been tested and works with IE versions 9+.

# Data processing

The raw data files (in `/data/original` folder) were processed using [OpenRefine](http://openrefine.org). This was exported to `/data/source_iif_status.json`, and converted into a JavaScript file for bootstrapping by running `node data/process_data.js`. (Optionally this script can produce a CSV output by appending a `--csv` flag.)

This data was compared to and combined with the official list of [Member States of the United Nations](http://un.org/en/members/), and [FAO's Country codes/names data](http://www.fao.org/countryprofiles/iso3list/en/), with additional location data (e.g. lat/lon centre-points) added for countries too small to appear in the jVectormap boundaries.

The example below shows the final data model created. It's designed to be fast to load and lightweight, containing all required data - and not requiring any joins to display the data. The file is bootstrapped into the application at load through `/data/iff_status.json`.

# Data model and field options

The options need to match the model definition in `/data/iff_status_def.yml` - see section on [Filters](#filters_and_filter_definitions) below.

Field name            | Options                                                          | Example
---                   | ---                                                              | ---
`short_name`          | Official short country name from UN Members List [text]          | Viet Nam
`iso3`                | Capitalised ISO3 [text]                                          | VNM
`region`              | africa, asia [snake_case]                                        | asia
`subregion`           | east_asia, pacific [snake_case]                                  | south_east_asia
`acp`                 | Is an ACP: [true / false]                                        | true
`srap`                | Is a SRAP: [true / false]                                        | false
`dcp`                 | Is a DCP: [true / false]                                         | null
`iif_or_plan`         | Status of IIF: iif, plan, no_plan, unknown [snake_case or blank] | iif
`iif_plan_start`      | Biennium of plan: 2014_2015,...[snake_case or blank]             |
`gm_supported`        | GM support for IIF/IFS: [true / false]                           | true
`description`         | Descripton of Party activity [text or blank]                     | The NAP established in ...
`lon`                 | WGS 84 [float]                                                   | 108.341384
`lat`                 | WGS 84 [float]                                                   | 14.287268
`iso2`                | Capitalised ISO2/ISO 3166 [text]                                 | VN
`official_name`       | Full name from UN Members List [text]                            | the Socialist Republic of Viet Nam
`use_centre_point`    | [true / false]                                                   | false
`unccd_provided_data` | Part of UNCCD dataset: [true / false]                            | true

### Note on Subregional Action Programmes (SRAPs)

The dataset includes 3 SRAPS in the same table. As they are a different type of entity, they have slightly different use of these fields: `short_name`, `iso3`, `acp`, `dcp`, `lon`, `lat`, `iso2` and `official_name` fields.

## Updating the data

You can edit the `data/iif_status.js` file directly. 

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

# License

This software is licensed under MIT license. See [LICENSE.txt](/LICENSE.txt) file. The license excludes the files in the `data` folder. These are copyright UNCCD.

In addition, the following libraries were used, and are covered by the following licenses:

  - jQuery (MIT)
  - jVectormap (GNU GPL)
  - Underscore (MIT)
  - Backbone (MIT)
  - Backbone-Query (MIT)
  - Chosen (MIT)
  - Ractive (MIT)
  - Ractive-backbone-adaptor (MIT)
  - Ractive-decorator-chosen (MIT)

## Contact information

This application was built by [Peoplesized](http://www.peoplesized.com). For more information, get in touch via our website or <hello@peoplesized.com>.

# Changes

1.0.6 Fixes for IE8-11, and IE Compatibility View mode
