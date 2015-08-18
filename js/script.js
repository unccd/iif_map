// App

window.app = {};

var Countries = Backbone.Collection.extend({
  comparator: 'iso3'
});

$.getJSON('data/combined.json', function(data) {
  app.data = new Countries(data);
  app.explorer = explorer(app.data);

  // app.explorer.on('change', function(changeObject) { 
  //   if (changeObject.selectedCountry != undefined) {
  //     if (changeObject.selectedCountry) { 
  //       return console.log('change selectedCountry to', changeObject.selectedCountry);
  //     } else {
  //       return console.log('reset selectedCountry ');
  //     }
  //   };
  //   return;
  // });

  window.m = drawMap(app.data);
  window.mo = m.vectorMap('get', 'mapObject');
  return;
});

// Explorer view

function explorer(data) {
  return new Ractive({
    el: '.container',
    template: '#explorer',
    data: {
      selectedCountry: '',
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
    addFilter: function(filterState) {
      console.log(filterState);
    },
    viewCountry: function(iso3) {
      var selectedCountry = app.data.findWhere({
        iso3: iso3
      });
      this.set('selectedCountry', selectedCountry);
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
        // scale: ['#4169E1', '#FF69B4'],
        scale: {
          'yes': '#990032', 
          'plan': 'green',
          'no plan': 'lightgreen'
        },
        normalizeFunction: 'ordinal',
        attribute: 'fill',
        values: getMapData(data),
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
      if (app.explorer.get('selectedCountry') == country) {
        app.explorer.set('selectedCountry', false);
        return mo.setFocus({
          scale: mo.baseScale,
          x: mo.baseTransX,
          y: mo.baseTransY
        });
      } else {
        app.explorer.set('selectedCountry', country);
        return mo.setFocus({
          region: regionString
        });
      }
    }
  });
}

function getMapData(data) {
  output = {};
  app.data.forEach(function(i) {
    // Good to put this all on the collection
    if(i.get('srap')){return}; // Don't render SRAPs
    iso2 = i.get('iso2');
    iif_established = i.get('iif_established') ? 'yes' : 'no';
    if (iif_established == 'no') {
      iif_established = _.includes(['2014_2015', '2016_2017', '2018_2019', 'plan_exists'], i.get('plan')) ? 'plan' : 'no plan';
      
    }
    output[iso2] = iif_established;
  });
  return output;
}