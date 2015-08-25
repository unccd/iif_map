fs  = require 'fs'
_   = require 'lodash'
json2csv = require 'json2csv'

class Process
  constructor: ->
    dataFile = fs.realpathSync(__dirname + '/openrefine_export.json')
    output = JSON.parse(fs.readFileSync(dataFile, encoding: 'utf8')).rows

    output = "window.app || (window.app = {});app.bootstrapped_data =" + JSON.stringify(output)
    fs.writeFileSync(__dirname + '/../data/iif_status.js', output)

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