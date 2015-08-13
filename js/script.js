window.app = {};

var Countries = Backbone.Collection.extend({
  comparator: 'iso3'
});

$.getJSON('data/combined.json', function(data){
  app.data = new Countries(data);
  app.explorer = explorer(app.data);
  app.explorer.on('setFilter', function(event){
    console.log('Set filter event (check window.e)');
    window.e = event;
  });
  window.m = drawMap(app.data);
  return;
});

function explorer(data) {
  return new Ractive({
    el: '.container',
    template: '#explorer',
    data: {
      selected: '',
      countries: data,
      withIifs: function(countries){
        return countries.select(function(i){
          return i.get('iif_established');
        });
      },
      withoutIifs: function(countries){
        return countries.select(function(i){
          return !i.get('iif_established');
        });
      }
    },
    adapt: ['Backbone'],
    addFilter: function(thing) {
      console.log(thing);
    },
    viewCountry: function(iso3) {
      var selectedCountry = app.data.findWhere({iso3: iso3});
      this.set('selected', selectedCountry);
    }
  });
}

function interestingStats(data) {
  var stats = {};
  return stats;
}

function drawMap(data) {
  return $(".map").vectorMap({
    map: 'world_merc',
    series: {
      regions: [{
        values: getMapData(data),
        scale: ['#C8EEFF', '#0071A4'],
        normalizeFunction: 'polynomial'
      }]
    },
    onRegionClick: function(event, regionString) {
      country = app.data.findWhere({iso2: regionString});
      return app.explorer.set('selected', country);
    }
  });
}

function getMapData (data) {
  output = {};
  app.data.each(function(i){
    iso2 = i.get('iso2');
    iif_established = i.get('iif_established') ? 1 : 0;
    output[iso2] = iif_established;
  });
  return output;
}
