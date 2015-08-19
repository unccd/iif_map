window.app || (window.app = {});

// 
// Setup map
// 

function drawMap(data) {
  return $(".map").vectorMap({
    backgroundColor: '#feba2b',
    map: 'world_merc',
    series: {
      regions: [{
        scale: {
          'yes': '#F47730', 
          'plan': '#579DD4',
          'no plan': '#005BA9'
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
        return app.map.setFocus({
          scale: app.map.baseScale,
          x: app.map.baseTransX,
          y: app.map.baseTransY
        });
      } else {
        app.explorer.set('selectedCountry', country);
        return app.map.setFocus({
          region: regionString
        });
      }
    }
  });
}

function getMapData(data) {
  output = {};
  data.forEach(function(i) {
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

