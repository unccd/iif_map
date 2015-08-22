window.app || (window.app = {});

// 
// Setup map
// 

function initMap(ractive) {
  var collection = ractive.get('parties');

  var map = $(".map").vectorMap({
    backgroundColor: 'white', // #feba2b
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
        values: prepareMapData(collection),
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
    regionStyle: {
      initial: {
        fill: '#E2E2E2'
      },
      selected: {
        stroke: 'green',
        'stroke-width': 1,
        fill: 'pink'
      },
      hover: {
        fill: 'grey'
      }
    },
    onRegionClick: function(event, regionCode) {
      var party = collection.findWhere({
        iso2: regionCode
      });
      if (party == undefined) { return }

      if (ractive.get('selectedParty') == party) {
        ractive.set('selectedParty', false);
        zoomMapToAll();
      } else {
        ractive.set('selectedParty', party);
        zoomMapTo(regionCode);
      }
    },
    onRegionTipShow: function(event, label, code) {
      var party = collection.findWhere({iso2: code})
      if (party) {
        var status = party.get('iif_or_plan');
        label.html(
          '<b>'+label.html()+'</b></br>'+
          '<b>Status: </b>' + status
        );
      }
    }
  });
  return map.vectorMap('get', 'mapObject');
}


// 
// Global functions for managing the map
// 

function prepareMapData(collection) {
  return collection.prepareMapData('iif_or_plan');
}

function updateMap() {
  if (!app.map) { return }
  app.map.reset();
  return app.map.series.regions[0].setValues(prepareMapData(app.data));
}

function zoomMapTo(regionCodes) {
  return app.map.setFocus({
    regions: [regionCodes]
  });
}

function zoomMapToAll() {
  return app.map.setFocus({
    scale: app.map.baseScale,
    x: app.map.baseTransX,
    y: app.map.baseTransY
  });
}
