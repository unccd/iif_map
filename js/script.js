window.app || (window.app = {});

// 
// App launch
// 

$.getJSON('data/iif_status.json', function(data) {
  // Backbone.Obscura collection for filtering
  app.filtered_data = new Backbone.Obscura(new Countries(data));

  // Possible Filters collection
  app.filters = new Filters([
    {title: 'With IIF', short_name: 'with_iif', filterState: {iif_or_plan: 'iif'}}, 
    {title: 'No IIF, plan exists', short_name: 'with_plan', filterState: {iif_or_plan: 'plan'}}, 
    {title: 'No IIF, no plan', short_name: 'no_plan', filterState: {iif_or_plan: 'no_plan'}}
  ]);

  
  // Ractive view containing all components
  app.explorer = explorer(app.filtered_data, app.filters);
  
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
