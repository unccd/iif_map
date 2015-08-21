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

  app.filters.iif_status = new Filters([
    {title: 'With IIF', id: 'with_iif', filterState: {iif_or_plan: 'iif'}}, 
    {title: 'No IIF, plan exists', id: 'with_plan', filterState: {iif_or_plan: 'plan'}}, 
    {title: 'No IIF, no plan', id: 'no_plan', filterState: {iif_or_plan: 'no_plan'}},
    {title: 'No data', id: 'unknown', filterState: {iif_or_plan: 'unknown'}},
    {title: 'Planned 2014-2015', id: '2014_2015', filterState: {iif_plan_start: '2014_2015'}},
    {title: 'Planned 2016-2017', id: '2016_2017', filterState: {iif_plan_start: '2016_2017'}},
    {title: 'Planned 2018-2019', id: '2018_2019', filterState: {iif_plan_start: '2018_2019'}},
    {title: 'GM supported', id: 'gm_supported', filterState: {gm_supported: true}}
  ], {type: 'iif_status'});

  app.filters.geo = new Filters([
    {title: 'Spain', id: 'spain', filterState: {iso3: 'spa'}},
    {title: 'Europe', id: 'europe', filterState: {region: 'europe'}},
    {title: 'Southern Europe', id: 'southern_europe', filterState: {subregion: 'southern_europe'}}
  ], {type: 'geo'})


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

  return;
});


