// 
// Process the data and definition files into JS files to bootstrap data at load
// Optionally run with `--csv` flag to generate a CSV version of the data
// 

var projectName = 'iif_status';

var Process, YAML, fs, json2csv;
fs = require('fs');
YAML = require('yamljs');
json2csv = require('json2csv');


Process = (function() {
  function Process(projectName) {
    this.bootstrapCode = "window.bootstrap_data || (window.bootstrap_data = {});bootstrap_data.";
    this._processDataFile(projectName);
    this._processDefinitionFile(projectName);
  }

  Process.prototype._processDataFile = function(projectName) {
    var data, fileName, output;
    fileName = "" + projectName;
    data = JSON.parse(fs.readFileSync(__dirname + "/source_" + fileName + ".json", 'utf8')).rows;
    output = "" + this.bootstrapCode + fileName + " = " + (JSON.stringify(data)) + ";";
    fs.writeFileSync(__dirname + "/" + fileName + ".js", output);

    var ref;
    if (((ref = process.argv) != null ? ref[2] : void 0) === '--csv') {
      this._processDataAsCSV(data, fileName)
    }
    return console.log('Processed and saved data file');
  };

  Process.prototype._processDataAsCSV = function(data, fileName) {
    json2csv({data: data}, function(err, csv) {
      if (err) console.log(err);
      fs.writeFileSync(__dirname + "/" + fileName + ".csv", csv);
      return console.log('Processed and saved data file as CSV');
    });
  }

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