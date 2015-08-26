window.app || (window.app = {});
app.DEBUG = false;
Ractive.DEBUG = false;

app.utils = {
  snake_case: function(text) {
    return text.replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
  }
}


// Init Ractive decorators
Ractive.decorators.chosen.type.geoSearch = { width: '100%' };


// ===============
// BOOTSTRAP DATA
// ===============

// Parties collection from ACP/DCP countries and SRAPs. 
app.parties = bootstrapParties(bootstrap_data.iif_status);
app.filters = bootstrapFilters(bootstrap_data.iif_status_def, app.parties);

// // ===========
// // APP LAUNCH
// // ===========

// // Create Ractive view containing all components
// var views = bootstrap_data.iif_status_def.views;

// app.ractive = initRactive(app.parties, app.filters, views);

// // jVectormap map, binding the Ractive view
// app.map = initMap(app.ractive, views[0]);
// app.ractive.map = app.map;

