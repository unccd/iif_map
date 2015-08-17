window.app = {};

var Countries = Backbone.Collection.extend({
  comparator: 'iso3'
});

$.getJSON('data/combined.json', function(data) {
  app.data = new Countries(data);
  app.explorer = explorer(app.data);
  app.explorer.on('setFilter', function(event) {
    console.log('Set filter event (check window.e)');
    window.e = event;
  });
  window.m = drawMap(app.data);
  window.mo = m.vectorMap('get', 'mapObject');
  return;
});

function explorer(data) {
  return new Ractive({
    el: '.container',
    template: '#explorer',
    data: {
      selected: '',
      countries: data,
      withIifs: function(countries) {
        return countries.select(function(i) {
          return i.get('iif_established');
        });
      },
      withoutIifs: function(countries) {
        return countries.select(function(i) {
          return !i.get('iif_established');
        });
      }
    },
    adapt: ['Backbone'],
    addFilter: function(thing) {
      console.log(thing);
    },
    viewCountry: function(iso3) {
      var selectedCountry = app.data.findWhere({
        iso3: iso3
      });
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
    backgroundColor: 'lightgrey',
    map: 'world_merc',
    series: {
      regions: [{
        values: getMapData(data),
        // scale: {'0': 'red', '1': 'blue'},
        scale: ['#eee', '#bbb'],
        normalizeFunction: 'linear',
        attribute: 'fill',
        legend: {
          horizontal: true,
          title: 'IIF established',
        }
      }]
    },
    onRegionClick: function(event, regionString) {
      country = app.data.findWhere({
        iso2: regionString
      });
      if (app.explorer.get('selected') == country) {
        app.explorer.set('selected', false);
        return mo.setFocus({
          scale: mo.baseScale,
          x: mo.baseTransX,
          y: mo.baseTransY
        });
      } else {
        app.explorer.set('selected', country);
        return mo.setFocus({
          region: regionString
        });
      }
    }
  });
}

function getMapData(data) {
  output = {};
  app.data.each(function(i) {
    iso2 = i.get('iso2');
    iif_established = i.get('iif_established') ? 10 : 0;
    output[iso2] = iif_established;
  });
  return output;
}