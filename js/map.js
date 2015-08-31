// 
// Setup map
// 

// The ractive passed in needs to have at least 'collection' and 
// 'filters' defined as properties
function initMap(ractive, view) {
  var collection, filterAttribute, map, mapObject;
  var updateMap, updateMapData, _prepareRegionsData, _prepareMarkersData, _prepareMarkersArrayForViz;

  if (ractive == undefined) {
    throw 'Need to pass ractive and view to the Map creator'
  }

  collection = ractive.get('collection');
  filterAttribute = view.filterAttribute;

  // Create map from view
  map = $(".map").vectorMap(defineMap());
  mapObject = map.vectorMap('get', 'mapObject');
  // Immediately zoom to filtered
  _zoomToFiltered();



  // Create map definition object
  function defineMap() {
    var filtersCollection, scale, initialRegionValues, regionStyle, initialMarkersArray, markerStyle;

    filtersCollection = new Backbone.Collection(ractive.get('filters').getForAttribute(filterAttribute));
    scale = _.object(filtersCollection.pluck('value'), filtersCollection.pluck('colour'));

    initialRegionValues = _prepareRegionsData(collection);
    initialMarkersArray = _prepareMarkersData(collection);

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

    markerStyle = {
      initial: {
        fill: '#E2E2E2',
        r: '4',
        // stroke: 'darkgrey',
        'stroke-width': 1
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
          values: initialRegionValues
        }],
        markers: [{
          scale: scale,
          normalizeFunction: 'ordinal',
          attribute: 'fill',
          values: _prepareMarkersArrayForViz()
        }]
      },
      markers: initialMarkersArray,
      regionStyle: regionStyle,
      markerStyle: markerStyle,
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
        '<b>' + label.html() + '</b></br>'
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
        '<b>' + label.html() + '</b></br>'
      );
    }
  }

  function _prepareRegionsData() {
    return collection.prepareMapRegionsData(filterAttribute);
  }

  function _prepareMarkersData() {
    return collection.prepareMapMarkersData(filterAttribute);
  }

  function _prepareMarkersArrayForViz(collection) {
    var array = _prepareMarkersData(collection);
    return _.reduce(array, function(p, c, i){ 
      p[i] = c.value; return p }, {})
  }

  // 
  function updateMap() {
    // Update data and re-render map based on current filter state
    if (!mapObject) {
      throw ('Missing map object'); return;
    };
    mapObject.reset();
    mapObject.series.regions[0].setValues(_prepareRegionsData(collection));
    mapObject.series.markers[0].setValues(_prepareMarkersArrayForViz(collection));
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

    window.setTimeout(function(){_zoomMapTo(regionCodes);}, 0);
  }

  function _zoomMapTo(regionCodes) {
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

  return {
    mapObject: mapObject,
    updateMap: updateMap
  }
}