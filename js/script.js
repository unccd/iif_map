window.app || (window.app = {});

// 
// App launch
// 

$.getJSON('data/iif_status.json', function(data) {
  app.filtered_data = new Backbone.Obscura(new Countries(data));
  app.explorer = explorer(app.filtered_data);

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
