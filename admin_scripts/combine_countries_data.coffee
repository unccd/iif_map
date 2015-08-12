fs  = require 'fs'
_   = require 'lodash'

class Process
  constructor: ->
    dataFile = fs.realpathSync(__dirname + '/../data/data.json')
    data = JSON.parse(fs.readFileSync(dataFile, encoding: 'utf8'))

    countriesFile = fs.realpathSync(__dirname + '/../data/countries.json')
    countries = JSON.parse(fs.readFileSync(countriesFile, encoding: 'utf8'))
    
    console.log data.length, 'data entries'
    console.log countries.length, 'countries entries'

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

    fs.writeFileSync(__dirname + '/../data/combined.json', JSON.stringify(output))

new Process