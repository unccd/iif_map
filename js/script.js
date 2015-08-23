window.app || (window.app = {});

// 
// App launch
// 
// 

$.getJSON('data/countries.json', function(countries) {
  app.countries = new Backbone.Collection(countries);
  $.getJSON('data/iif_status.json', function(data) {
    // Init Ractive decorators
    Ractive.decorators.chosen.type.geoSearch = function(node){
      return {
        width: '100%'
      }
    };


    // Backbone Collection for filtering
    app.data = new Parties(data);

    // Filters collection
    app.filters = initFilters();


    // Create Ractive view containing all components
    app.explorer = initExplorer(app.data, app.filters);
    

    // jVectormap map, binding the Ractive view
    app.map = initMap(app.explorer);


    return;
  });
});
