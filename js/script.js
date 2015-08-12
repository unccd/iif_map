window.app = {};

$.getJSON('data/combined.json', function(data){
  app.state = {};

  app.summary = doSummary(data);
  app.filters = doFilters(data);
  app.map = doMap(data);
  return;
})

function doSummary(data) {
  return new Ractive({
    el: '.summary',
    template: '#summary',
    data: { 
      countries: data,
      withIifs: function(countries){
        return _.select(countries, function(i){
          return i.iif_established;
        });
      },
      withoutIifs: function(countries){
        return _.select(countries, function(i){
          return !i.iif_established;
        });
      }
    }

  });
}

function doFilters(data) {
  ractive = new Ractive({
    el: '.filters',
    template: '#filters',
    data: { countries: data }
  });
  ractive.on( 'clickCountry', function ( event ) {
    return console.log(event.context.description);
  });
  return ractive;
}

function doMap(data) {
  return new Ractive({
    el: '.map',
    template: '#map',
    data: { countries: data }
  })
}

function interestingStats(data) {

  return stats;
}
