window.app || (window.app = {});

// 
// App launch
// 
// 

$.getJSON('data/iif_status.json', function(data) {
  // Backbone.Obscura collection for filtering
  app.filtered_data = new Backbone.Obscura(new Countries(data));

  // Possible Filters collection
  app.filters = new Filters([
    {attribute: '', title: 'All', short_name: 'all', filterState: {}, exclusive: true}, 
    {attribute: 'iif_or_plan', title: 'With IIF', short_name: 'with_iif', filterState: {iif_or_plan: 'iif'}, exclusive: true}, 
    {attribute: 'iif_or_plan', title: 'No IIF, plan exists', short_name: 'with_plan', filterState: {iif_or_plan: 'plan'}, exclusive: true}, 
    {attribute: 'iif_or_plan', title: 'No IIF, no plan', short_name: 'no_plan', filterState: {iif_or_plan: 'no_plan'}, exclusive: true},
    {attribute: 'iif_or_plan', title: 'No data', short_name: 'unknown', filterState: {iif_or_plan: 'unknown'}, exclusive: true},
    {attribute: 'iif_or_plan', title: 'Planned 2014-2015', short_name: '2014_2015', filterState: {iif_plan_start: '2014_2015'}, exclusive: true},
    {attribute: 'iif_or_plan', title: 'Planned 2016-2017', short_name: '2016_2017', filterState: {iif_plan_start: '2016_2017'}, exclusive: true},
    {attribute: 'iif_or_plan', title: 'Planned 2018-2019', short_name: '2018_2019', filterState: {iif_plan_start: '2018_2019'}, exclusive: true},
    {attribute: 'iif_or_plan', title: 'GM supported', short_name: 'gm_supported', filterState: {gm_supported: true}, exclusive: true}
  ]);

  
  // Ractive view containing all components
  app.explorer = explorer(app.filtered_data, app.filters);

  app.filtered_data.on('reset', function(){
    return updateMap()
  })
  
  // jVectormap map
  app.map = drawMap(app.filtered_data);

  explorerEvents(app.explorer);

  return;
});


