window.app || (window.app = {});

// 
// App launch
// 
// 

$.getJSON('data/iif_status.json', function(data) {
  // Backbone.Obscura collection for filtering
  app.data = new Backbone.Obscura(new Parties(data));

  // Possible Filters collection
  app.filters = {}
  app.filters = new Filters()

  // IIF Status filters
  app.filters.add([
    {active: true, type: 'iif_status', title: 'With IIF', id: 'with_iif', filterState: {iif_or_plan: 'iif'}}, 
    {active: true, type: 'iif_status', title: 'No IIF, plan exists', id: 'with_plan', filterState: {iif_or_plan: 'plan'}}, 
    {active: true, type: 'iif_status', title: 'No IIF, no plan', id: 'no_plan', filterState: {iif_or_plan: 'no_plan'}},
    {active: true, type: 'iif_status', title: 'No data', id: 'unknown', filterState: {iif_or_plan: 'unknown'}}
  ]);
  // Geo filters
  app.filters.add([
    {type: 'geo', title: 'Spain', id: 'spain', filterState: {iso3: 'spa'}},
    {active: true, type: 'geo', title: 'Europe', id: 'europe', filterState: {region: 'europe'}},
    {type: 'geo', title: 'Southern Europe', id: 'southern_europe', filterState: {subregion: 'southern_europe'}}
  ]);
  // Plan filters
  app.filters.add([
    {active: true, type: 'plan', title: 'Planned 2014-2015', id: '2014_2015', filterState: {iif_plan_start: '2014_2015'}},
    {active: true, type: 'plan', title: 'Planned 2016-2017', id: '2016_2017', filterState: {iif_plan_start: '2016_2017'}},
    {active: true, type: 'plan', title: 'Planned 2018-2019', id: '2018_2019', filterState: {iif_plan_start: '2018_2019'}},
  ]);
  // gm_support filters
  app.filters.add([
    {active: true, type: 'gm_support', title: 'Receiving support', id: 'receiving_support', filterState: {gm_support: true}},
    {active: true, type: 'gm_support', title: 'Not receiving support', id: 'not_receiving_support', filterState: {gm_support: false}}
  ]);


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

