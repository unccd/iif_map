// 
// Setup map
// 

// The ractive passed in needs to have at least 'collection' and 
// 'filters' defined as properties
function initMap(ractive, view) {
  var collection, filterAttribute, map, mapObject;
  var updateMap, updateMapData, _prepareRegionsData, _prepareMarkersData;

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
    var filtersCollection, scale, legend, initialRegionValues, regionStyle, initialMarkerValues, markerStyle;
    filtersCollection = new Backbone.Collection(ractive.get('filters').getForAttribute(filterAttribute));
    scale = _.object(filtersCollection.pluck('value'), filtersCollection.pluck('colour'));
    legend = _.object(filtersCollection.pluck('value'), filtersCollection.pluck('title'));
    initialRegionValues = _prepareRegionsData(collection);
    initialMarkerValues = _prepareMarkersData(collection);

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
          values: initialRegionValues,
        }],
        markers: [{
          scale: scale,
          normalizeFunction: 'ordinal',
          attribute: 'fill',
          values: initialMarkerValues
        }],
      },
      markers: initialMarkerValues,
      regionStyle: regionStyle,
      onRegionClick: function(event, regionCode) {
        _regionClick(event, regionCode);
      },
      onMarkerClick: function(event, regionCode) {
        _markerClick(event, regionCode);
      },
      onRegionTipShow: function(event, label, code) {
        _regionTip(event, label, code);
      },
      onMarkerTipShow: function(event, label, code) {
        _markerTip(event, label, code);
      }
    };
  }

  function _regionClick(event, regionCode) {
    // Get Party matching regionCode
    var party = collection.findWhere({iso2: regionCode});
    // If no Party, then ignore click
    if (!party) { return };
    
    if (ractive.get('selectedParty').id == party.id) {
      // If it's the same as existing, then undo
      ractive.set('selectedParty', '');
    } else {
      // Otherwise set selectedParty
      ractive.set('selectedParty', party.toJSON());
    }
  }

  function _markerClick(event, markerCode) {
    // Get Party matching markerCode
    var party = collection.findWhere({iso2: markerCode});
    // If no Party, then ignore click
    if (!party) { return };
    
    if (ractive.get('selectedParty').id == party.id) {
      // If it's the same as existing, then undo
      ractive.set('selectedParty', '');
    } else {
      // Otherwise set selectedParty
      ractive.set('selectedParty', party.toJSON());
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

  function _markerTip(event, label, code) {
    var party = collection.findWhere({
      iso2: code
    })
    if (party) {
      var status = party.get(filterAttribute);
      label.html(
        '<b>' + label.html() + '</b></br>' +
        '<b>Status: </b>' + name
      );
    }
  }

  function _prepareRegionsData() {
    return collection.prepareMapRegionsData(filterAttribute);
  }

  function _prepareMarkersData() {
    return collection.prepareMapMarkersData(filterAttribute);
  }

  // 
  function updateMap() {
    // Update data and re-render map based on current filter state
    if (!mapObject) {
      return
    };
    mapObject.reset();
    mapObject.series.regions[0].setValues(_prepareRegionsData(collection));
    mapObject.series.markers[0].setValues(_prepareMarkersData(collection));
    return _zoomToFiltered();
  }

  function _zoomToFiltered() {
    var party, geoSearch, regionCodes;

    if (party = ractive.get('selectedParty')) {
      if (!party.use_centre_point) { 
        regionCodes = [party.iso2]
      } else { return }
    } else {
      regionCodes = _.chain(collection.toJSON())
        .where({use_centre_point: false})
        .pluck('iso2')
        .compact()
        .value();
    }

    if (_.isEmpty(regionCodes)) {
      return
    };

    setTimeout(zoomMapTo(regionCodes), 0);
  }

  function zoomMapTo(regionCodes) {
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
    map.removeAllMarkers();
    map.addMarker(party.iso2, [party.lat, party.lon]);
  }

  // Map watches filters. When they change, rerender the map.
  ractive.observe('filters.*', function(){
    updateMap();
  }, {init: false});

  ractive.observe('selectedParty', function(){
    updateMap();
  }, {init: false})

  return {
    mapObject: mapObject,
    updateMap: updateMap,
    zoomMapTo: zoomMapTo,
    _addMarkerFor: _addMarkerFor
  }
}