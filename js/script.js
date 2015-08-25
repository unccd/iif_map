window.app || (window.app = {});
app.DEBUG = false;
Ractive.DEBUG = false;

// 
// App launch
// 
// 

// Init Ractive decorators
Ractive.decorators.chosen.type.geoSearch = function(node) {
  return {
    width: '100%'
  }
};

// Parties collection from only ACP/DCP countries. 
// All DCP countries are ACP countries.
// Also need to include the SRAP data
var acpData = _.select(bootstrap_data.iif_status, function(model) {
  return model.acp || model.srap;
})
app.parties = new Parties(acpData);

// Use just the attributes for now - might use 'Views' later
var filterAttributes = bootstrap_data.iif_status_def.attributes;

// Create FilterDefs by removing options from each attribute
var filterDefObjects = _.map(filterAttributes, function(facet) {
  return _.omit(facet, 'options')
})
var filterDefs = new FilterDefs(filterDefObjects);


// Create FilterOptions by copying properties from the attribute 
// to each of its options
filterOptions = _.chain(filterAttributes).map(function(filter) {

  var attribute = filter.name;

  // Add countries if needed
  if (filter.type == 'country') {
    // Set value and title on options
    var valueField = filter.value_field;
    var titleField = filter.title_field;

    // Extract Countries from provided Parties collection
    filter.options = app.parties.map(function(party) {
      return {
        id: 'randomId',
        value: party.get(valueField),
        title: party.get(titleField),
      }
    });
  }

  return _.map(filter.options, function(option) {
    // Infer value from title if requested - assumes snake case
    if (filter.value_from_title != undefined) {
      var title = option.title;
      // snake_case conversion
      option.value = snake_case(title);
      
    };

    option.attribute = attribute;
    option.id = attribute + ':' + option.value;
    option.excluded = false;

    return option;
  });

}).flatten().value();

app.filters = new FilterOptions(filterOptions, {
  collectionToFilter: app.parties
});
app.filters.filterDefs = filterDefs;

var views = bootstrap_data.iif_status_def.views;

// Create Ractive view containing all components
app.ractive = initExplorer(app.parties, app.filters, views);

// jVectormap map, binding the Ractive view
app.map = initMap(app.ractive, views[0]);

function snake_case(text) {
  return text.replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
}