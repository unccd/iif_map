fs  = require 'fs'
_   = require 'lodash'
json2csv = require 'json2csv'

class Process
  constructor: ->
    dataFile = fs.realpathSync(__dirname + '/../data/data.json')
    data = JSON.parse(fs.readFileSync(dataFile, encoding: 'utf8')).rows

    countriesFile = fs.realpathSync(__dirname + '/../data/countries.json')
    countries = JSON.parse(fs.readFileSync(countriesFile, encoding: 'utf8'))

    iso2_to_3File = fs.realpathSync(__dirname + '/../data/iso2_to_3.json')
    iso2_to_3 = JSON.parse(fs.readFileSync(iso2_to_3File, encoding: 'utf8'))
    
    # console.log data.length, 'data entries'
    # console.log countries.length, 'countries entries'

    # Check for correct country names
    data.forEach (line) ->
      searchCountry = line.country
      foundCountry = _.findWhere(countries, name: searchCountry)
      unless foundCountry
        console.log 'Nothing found for', searchCountry

    # Add ISO3 to data.json
    output = data.map (line) ->
      searchCountry = line.country
      foundCountry = _.findWhere(countries, name: searchCountry)
      if foundCountry
        picked = _.pick(foundCountry, 'iso3', 'terr_name', 'lat', 'lon')
        line = _.extend(line, picked)
      return line

    # Add ISO2
    output = output.map (line) ->
      found = _.findWhere(iso2_to_3, iso3: line.iso3)
      if found
        line.iso2 = found.iso2
      return line

    # fs.writeFileSync(__dirname + '/../data/combined.json', JSON.stringify(output))

    # Create and write CSV version
    fields = _.keys(output[0])
    json2csv {
      data: output
      fields: fields
    }, (err, csv) ->
      if err
        console.log err
      fs.writeFileSync(__dirname + '/../data/combined.csv', csv)
      return


new Process