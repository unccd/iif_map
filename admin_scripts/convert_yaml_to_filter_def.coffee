fs = require 'fs'
_   = require 'lodash'
YAML = require 'yamljs'

class Process
  constructor: ->
    dataset = 'iif_status_def'
    definitions = YAML.load(__dirname + "/#{dataset}.yml")

    output = "window.app || (window.app = {});app.#{dataset} = #{JSON.stringify(definitions)};"
    fs.writeFileSync(__dirname + "/../data/#{dataset}.js", output)


new Process
