window.app || (window.app = {});

// 
// App launch
// 
// 

$.getJSON('data/iif_status.json', function(data) {
  // Backbone.Obscura collection for filtering
  app.data = new Backbone.Obscura(new Parties(data));

  // Filters collection
  app.filters = initFilters(app.data);


  // Init Ractive decorators
  Ractive.decorators.chosen.type.geosearch = function(node){
    return {
      width: '100%'
    }
  };

  // Create Ractive view containing all components
  app.explorer = explorer(app.data, app.filters);

  
  // jVectormap map
  app.map = drawMap(app.data);

  // Config Ractive events
  initExplorerEvents(app.explorer);

  app.data.on('reset', function(){
    return updateMap()
  })

  app.explorer.on( 'activate', function ( event ) {
    alert( 'Activating!' );
  });

  return;
});

