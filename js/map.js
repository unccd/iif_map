window.app || (window.app = {});

// 
// Setup map
// 

function drawMap(collection) {
  var map = $(".map").vectorMap({
    backgroundColor: '#feba2b',
    map: 'world_merc',
    series: {
      regions: [{
        scale: {
          'iif': '#F47730', 
          'plan': '#579DD4',
          'no_plan': '#005BA9',
          'unknown': 'rgb(105, 40, 90)'
        },
        normalizeFunction: 'ordinal',
        attribute: 'fill',
        values: getMapData(collection),
        legend: {
          labelRender: function(v){
            return {
              iif: 'IIF exists',
              plan: 'IIF planned',
              no_plan: 'No plan',
              unknown: 'No data'
            }[v];
          }
        }
      }]
    },
    onRegionClick: function(event, regionCode) {
      country = collection.findWhere({
        iso2: regionCode
      });
      if(country == undefined) { return }

      // TODO: Refactor to zoomIn and reset zoom functions
      if (app.explorer.get('selectedCountry') == country) {
        app.explorer.set('selectedCountry', false);
      } else {
        app.explorer.set('selectedCountry', country);
      }
    },
    onRegionTipShow: function(event, label, code) {
      var country = collection.findWhere({iso2: code})
      if (country) {
        var status = country.get('iif_or_plan');
        label.html(
          '<b>'+label.html()+'</b></br>'+
          '<b>Status: </b>' + status
        );
      }
    }
  });
  return map.vectorMap('get', 'mapObject');
}

function getMapData(collection) {
  output = {};
  collection.forEach(function(i) {
    // Good to put this all on the collection
    if(i.get('srap')){return}; // Don't render SRAPs
    iso2 = i.get('iso2');
    iif_or_plan = i.get('iif_or_plan');
    output[iso2] = iif_or_plan;
  });
  return output;
}

function updateMap() {
  app.map.reset();
  return app.map.series.regions[0].setValues(getMapData(app.filtered_data));
}

function zoomMapToSelected(regionCode) {
  console.log(regionCode);
  return app.map.setFocus({
    region: regionCode
  });
}

function zoomMapToAll() {
  return app.map.setFocus({
    scale: app.map.baseScale,
    x: app.map.baseTransX,
    y: app.map.baseTransY
  });
}
