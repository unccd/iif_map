# Compare lists of countries to find any missing or extra in the borders from jVectormap
# 

fs  = require 'fs'
_   = require 'lodash'

class Process
  constructor: ->
    jvectormap_countries_file = fs.realpathSync(__dirname + './jvectormap_countries.json')
    jvectormap_countries = JSON.parse(fs.readFileSync(jvectormap_countries_file, encoding: 'utf8'))

    fao_countries_file = fs.realpathSync(__dirname + '/../data/fao_countries.json')
    fao_countries = JSON.parse(fs.readFileSync(fao_countries_file, encoding: 'utf8'))

    ssc_countries_file = fs.realpathSync(__dirname + '/../data/ssc_countries.json')
    ssc_countries = JSON.parse(fs.readFileSync(ssc_countries_file, encoding: 'utf8'))

    console.log 'jvec:', jvectormap_countries.length, 'FAO:', fao_countries.length

    jvec_iso2 = _.pluck(jvectormap_countries, 'iso2')
    fao_iso2  = _.pluck(fao_countries, 'iso2')

    # In FAO, but not in jVectormap
    iso2_missing_from_jvec = _.difference(fao_iso2, jvec_iso2)
    # In jVectormap, but not FAO - might want to remove these from jVectormap
    iso2_missing_from_fao = _.difference(jvec_iso2, fao_iso2)


    # Combine fao_countries with SSC file centre points
    output = _.map(fao_countries, (party) ->
      ssc_party = _.findWhere(ssc_countries, iso3: party.iso3)
      party.lat = ssc_party.lat
      party.lon = ssc_party.lon
      party.use_centre_point = _.includes(iso2_missing_from_jvec, party.iso2)
      return party
    )

    # Write file
    fs.writeFileSync(__dirname + '/../data/countries.json', JSON.stringify(output))
    console.log "Written #{output.length} countries"

new Process