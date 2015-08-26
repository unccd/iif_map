fs = require 'fs'
YAML = require 'yamljs'

projectName = 'iif_status'

class Process
  constructor: (projectName)->
    @bootstrapCode = "window.bootstrap_data || (window.bootstrap_data = {});bootstrap_data."

    @_processDataFile(projectName)
    @_processDefinitionFile(projectName)

  _processDataFile: (projectName) ->
    fileName = "#{projectName}"
    definitions = JSON.parse(fs.readFileSync("#{__dirname}/source_#{fileName}.json", 'utf8')).rows
    output = "#{@bootstrapCode}#{fileName} = #{JSON.stringify(definitions)};"

    fs.writeFileSync("#{__dirname}/#{fileName}.js", output)
    console.log 'Processed and saved data file'

  _processDefinitionFile: (projectName) ->
    fileName = "#{projectName}_def"
    definitions = YAML.load("#{__dirname}/source_#{fileName}.yml")
    output = "#{@bootstrapCode}#{fileName} = #{JSON.stringify(definitions)};"

    fs.writeFileSync("#{__dirname}/#{fileName}.js", output)
    console.log 'Processed and saved definition file'

new Process(projectName)