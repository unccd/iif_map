var Process, YAML, fs, projectName;

fs = require('fs');
YAML = require('yamljs');
projectName = 'iif_status';

Process = (function() {
  function Process(projectName) {
    this.bootstrapCode = "window.bootstrap_data || (window.bootstrap_data = {});bootstrap_data.";
    this._processDataFile(projectName);
    this._processDefinitionFile(projectName);
  }

  Process.prototype._processDataFile = function(projectName) {
    var definitions, fileName, output;
    fileName = "" + projectName;
    definitions = JSON.parse(fs.readFileSync(__dirname + "/source_" + fileName + ".json", 'utf8')).rows;
    output = "" + this.bootstrapCode + fileName + " = " + (JSON.stringify(definitions)) + ";";
    fs.writeFileSync(__dirname + "/" + fileName + ".js", output);
    return console.log('Processed and saved data file');
  };

  Process.prototype._processDefinitionFile = function(projectName) {
    var definitions, fileName, output;
    fileName = projectName + "_def";
    definitions = YAML.load(__dirname + "/source_" + fileName + ".yml");
    output = "" + this.bootstrapCode + fileName + " = " + (JSON.stringify(definitions)) + ";";
    fs.writeFileSync(__dirname + "/" + fileName + ".js", output);
    return console.log('Processed and saved definition file');
  };

  return Process;

})();

new Process(projectName);

