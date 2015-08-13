window.app = {};

Countries = Backbone.Collection.extend({
  comparator: 'iso3'
})

$.getJSON('data/combined.json', function(data){
  app.data = new Countries(data);
  app.explorer = explorer(app.data);
  app.explorer.on('setFilter', function(event){
    console.log('Set filter event (check window.e)');
    window.e = event;
  });
  window.m = $(".map").vectorMap({
    map: 'world_merc',
    onRegionClick: function(e,str) {
      window.e = e;
    }
  });
  return;
})

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
      console.log(selectedCountry.get('description'));
    }
  });
}

function interestingStats(data) {
  var stats = {};
  return stats;
}

