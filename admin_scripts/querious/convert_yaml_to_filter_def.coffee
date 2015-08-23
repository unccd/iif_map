fs = require 'fs'
_   = require 'lodash'
YAML = require 'yamljs'

class Process
  constructor: ->
    dataset = 'iif_status'
    definition = YAML.load(__dirname + "/#{dataset}.yml")
    fs.writeFileSync(__dirname + "/#{dataset}.json", JSON.stringify(definition))

new Process
