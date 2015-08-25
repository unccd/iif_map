fs = require 'fs'
_   = require 'lodash'
YAML = require 'yamljs'

class Process
  constructor: ->
    dataset = 'iif_status_def'
    definitions = YAML.load(__dirname + "/#{dataset}.yml")

    output = "window.bootstrap_data || (window.bootstrap_data = {});bootstrap_data.#{dataset} = #{JSON.stringify(definitions)};"
    fs.writeFileSync(__dirname + "/../data/#{dataset}.js", output)


new Process
