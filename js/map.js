// 
// Setup map
// 

function initMap(ractive) {
  if (ractive == undefined) {
    throw 'Need to pass ractive and view to the Map creator'
  }
  var view = ractive.get('views')[0];
  var collection = ractive.get('parties');

  // Create scale and legend from view
  var filterAttribute = view.filterAttribute;
  var filtersCollection = new Backbone.Collection(ractive.get('filters').getForAttribute(filterAttribute));
  var scale = _.object(filtersCollection.pluck('value'),filtersCollection.pluck('colour'));
  var legend = _.object(filtersCollection.pluck('value'), filtersCollection.pluck('title'));

  var mapDef = {
    backgroundColor: '#feba2b', // #feba2b
    map: 'world_merc',
    series: {
      regions: [{
        scale: scale,
        normalizeFunction: 'ordinal',
        attribute: 'fill',
        values: prepareMapData(collection),
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
      } else {
        ractive.set('selectedParty', party);
      }
    },
    onRegionTipShow: function(event, label, code) {
      var party = collection.findWhere({iso2: code})
      if (party) {
        var status = party.get(filterAttribute);
        label.html(
          '<b>'+label.html()+'</b></br>'+
          '<b>Status: </b>' + status
        );
      }
    }
  };
  
  var map = $(".map").vectorMap(mapDef);
  var mapObject = map.vectorMap('get', 'mapObject');
 
  // Map handling methods
  function prepareMapData (collection) {
    return collection.prepareMapData(filterAttribute);
  }

  function updateMap() {
    if (!mapObject) { return };
    mapObject.reset();
    mapObject.series.regions[0].setValues(prepareMapData(collection));
    return zoomToFiltered();
  }

  function zoomToFiltered() {
    var regionCodes = _.compact(collection.pluck('iso2'));
    if (_.isEmpty(regionCodes)) {return};
    setTimeout(zoomMapTo(regionCodes), 0);
  }

  function zoomMapTo(regionCodes) {
    if (!mapObject) {return};

    if (regionCodes == undefined) {
      mapObject.setFocus({
        scale: mapObject.baseScale,
        x: mapObject.baseTransX,
        y: mapObject.baseTransY
      });
    } else {
      mapObject.setFocus({
        regions: regionCodes
      });
    }
  }

  return {
    mapObject: mapObject,
    prepareMapData: prepareMapData,
    updateMap: updateMap,
    zoomToFiltered: zoomToFiltered,
    zoomMapTo: zoomMapTo,
  }
}
