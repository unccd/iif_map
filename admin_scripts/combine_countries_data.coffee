fs  = require 'fs'
_   = require 'lodash'
json2csv = require 'json2csv'

class Process
  constructor: ->
    dataFile = fs.realpathSync(__dirname + '/../data/openrefine_export.json')
    data = JSON.parse(fs.readFileSync(dataFile, encoding: 'utf8')).rows

    countriesFile = fs.realpathSync(__dirname + '/../data/countries.json')
    countries = JSON.parse(fs.readFileSync(countriesFile, encoding: 'utf8'))

    # console.log data.length, 'data entries'
    # console.log countries.length, 'countries entries'

    # Check for correct country names
    data.forEach (line) ->
      searchParty = line.country
      foundParty = _.findWhere(countries, short_name: searchParty)
      unless foundParty
        console.log 'Nothing found for', searchParty

    # Add country data to iif_status.json
    output = data.map (line) ->
      searchParty = line.country
      foundParty = _.findWhere(countries, short_name: searchParty)
      if foundParty
        picked = _.pick(foundParty, 'iso3', 'iso2', 'terr_name', 'lat', 'lon', 'use_centre_point')
        line = _.extend(line, picked)
      return line

    # Move description to last property (for human-readable display)
    output = output.map (line) ->
      description = line.description
      delete line.description
      line.description = description
      return line

    fs.writeFileSync(__dirname + '/../data/iif_status.json', JSON.stringify(output))

    # # Create and write CSV version
    # fields = _.keys(output[0])
    # json2csv {
    #   data: output
    #   fields: fields
    # }, (err, csv) ->
    #   if err
    #     console.log err
    #   fs.writeFileSync(__dirname + '/../data/iif_status.csv', csv)
    #   return


new Process