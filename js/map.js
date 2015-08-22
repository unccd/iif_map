window.app || (window.app = {});

// 
// Setup map
// 

function drawMap(collection) {
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
      party = collection.findWhere({
        iso2: regionCode
      });
      if (party == undefined) { return }

      // TODO: Refactor to zoomIn and reset zoom functions
      if (app.explorer.get('selectedParty') == party) {
        app.explorer.set('selectedParty', false);
      } else {
        app.explorer.set('selectedParty', party);
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

function prepareMapData(collection) {
  return collection.prepareMapData('iif_or_plan');
}

function updateMap() {
  app.map.reset();
  return app.map.series.regions[0].setValues(prepareMapData(app.data));
}

function zoomMapToSelected(regionCode) {
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
