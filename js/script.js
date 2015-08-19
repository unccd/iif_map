window.app || (window.app = {});

// 
// App launch
// 

$.getJSON('data/iif_status.json', function(data) {
  // Backbone.Obscura collection for filtering
  app.filtered_data = new Backbone.Obscura(new Countries(data));

  // Possible Filters collection
  app.filters = new Filters([
    {title: 'With IIF', short_name: 'with_iif', filterState: {iif_or_plan: 'iif'}, exclusive: true}, 
    {title: 'No IIF, plan exists', short_name: 'with_plan', filterState: {iif_or_plan: 'plan'}, exclusive: true}, 
    {title: 'No IIF, no plan', short_name: 'no_plan', filterState: {iif_or_plan: 'no_plan'}, exclusive: true},
    {title: 'No information', short_name: 'unknown', filterState: {iif_or_plan: 'unknown'}, exclusive: true},
    {title: 'Planned 2014-2015', short_name: '2014_2015', filterState: {iif_plan_start: '2014_2015'}, exclusive: true},
    {title: 'Planned 2016-2017', short_name: '2016_2017', filterState: {iif_plan_start: '2016_2017'}, exclusive: true},
    {title: 'Planned 2018-2019', short_name: '2018_2019', filterState: {iif_plan_start: '2018_2019'}, exclusive: true},
    {title: 'GM supported', short_name: 'gm_supported', filterState: {gm_supported: true}, exclusive: true}
  ],{
    onCollection: app.filtered_data
  });

  
  // Ractive view containing all components
  app.explorer = explorer(app.filtered_data, app.filters);

  app.filtered_data.on('reset', function(){
    return updateMap()
  })
  
  // jVectormap map
  app.map = drawMap(app.filtered_data);


  // app.explorer.on('change', function(changeObject) { 
  //   // if (changeObject.selectedCountry != undefined) {
  //   //   if (changeObject.selectedCountry) { 
  //   //     return console.log('change selectedCountry to', changeObject.selectedCountry);
  //   //   } else {
  //   //     return console.log('reset selectedCountry ');
  //   //   }
  //   // };
  //   return console.log('changed list');
  // });

  return;
});
