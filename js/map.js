// 
// Setup map
// 

// The ractive passed in needs to have at least 'collection' and 
// 'filters' defined as properties
function initMap(ractive, view) {
  var collection, filterAttribute, map, mapObject;
  var updateMap;

  if (ractive == undefined) {
    throw 'Need to pass ractive and view to the Map creator'
  }

  collection = ractive.get('collection');
  filterAttribute = view.filterAttribute;

  // Create scale and legend from view
  map = $(".map").vectorMap(defineMap());
  mapObject = map.vectorMap('get', 'mapObject');

  // Create map definition object
  function defineMap() {
    var filtersCollection, scale, legend, initialValues, regionStyle;
    filtersCollection = new Backbone.Collection(ractive.get('filters').getForAttribute(filterAttribute));
    scale = _.object(filtersCollection.pluck('value'), filtersCollection.pluck('colour'));
    legend = _.object(filtersCollection.pluck('value'), filtersCollection.pluck('title'));
    initialValues = _prepareMapData(collection);
    regionStyle = {
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
    }

    return {
      backgroundColor: '#feba2b',
      map: 'world_merc',
      series: {
        regions: [{
          scale: scale,
          normalizeFunction: 'ordinal',
          attribute: 'fill',
          values: initialValues,
        }]
      },
      regionStyle: regionStyle,
      onRegionClick: function(event, regionCode) {
        _regionClick(event, regionCode);
      },
      onMarkerClick: function(event, regionCode) {
        _markerClick(event, regionCode);
      },
      onRegionTipShow: function(event, label, code) {
        _regionTip(event, label, code);
      }
    };
  }

  function _regionClick(event, regionCode) {
    // Get Party matching regionCode
    var party = collection.findWhere({iso2: regionCode});
    // If no Party, then ignore click
    if (!party) { return };
    
    if (ractive.get('selectedParty') == party) {
      // If it's the same as existing, then undo
      ractive.set('selectedParty', '');
    } else {
      // Otherwise set selectedParty
      ractive.set('selectedParty', party);
    }
  }

  function _markerClick(event, markerCode) {
    var party = collection.findWhere({iso2: markerCode});
    if (party == undefined) { 
      throw 'No Party found for ' + markerCode; return 
    } else {
      ractive.set('geoSearch', party)
    }
  }

  function _regionTip(event, label, code) {
    var party = collection.findWhere({
      iso2: code
    })
    if (party) {
      var status = party.get(filterAttribute);
      label.html(
        '<b>' + label.html() + '</b></br>' +
        '<b>Status: </b>' + status
      );
    }
  }

  function _prepareMapData() {
    return collection.prepareMapData(filterAttribute);
  }

  // 
  updateMap = function () {
    // Update data and re-render map based on current filter state
    if (!mapObject) {
      return
    };
    mapObject.reset();
    mapObject.series.regions[0].setValues(_prepareMapData(collection));
    return _zoomToFiltered();
  }

  function _zoomToFiltered() {
    if (app.DEBUG) {
      // console.log('_zoomToFiltered')
    }
    var regionCodes = _.compact(collection.pluck('iso2'));
    if (_.isEmpty(regionCodes)) {
      return
    };
    setTimeout(zoomMapTo(regionCodes), 0);
  }

  function zoomMapTo(regionCodes) {
    if (app.DEBUG) {
      // console.log('zoomMapTo', regionCodes)
    }
    if (!mapObject) {
      return
    };

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

  function _addMarkerFor(party) {
    if (app.DEBUG) {console.log('_addMarkerFor', party) }

    var map = ractive.get('map').mapObject;
    map.removeAllMarkers();
    map.addMarker(party.iso2, [party.lat, party.lon]);
  }

  // Map watches filters. When they change, rerender the map.
  ractive.observe('filters.*', function(){
    updateMap();
  }, {init: false});

  ractive.observe('selectedParty', function(){
    updateMap()
  }, {init: false})

  return {
    mapObject: mapObject,
    updateMap: updateMap,
    zoomMapTo: zoomMapTo,
    _addMarkerFor: _addMarkerFor
  }
}