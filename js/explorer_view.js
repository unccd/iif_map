window.app || (window.app = {});

// 
// Explorer view
// 

function explorer(collection, filters) {
  return new Ractive({
    // 
    // CONFIG
    // 
    el: '#container',
    template: '#explorer',
    components: { MapViewSelector: MapViewSelector },
    adapt: ['Backbone'],
    // 
    // DATA
    // 
    data: {
      mapView: 1,
      parties: collection,
      selected: ''
    },
    computed: {
      iif_status_filters: function() {return app.filters.select(function(i){return i.get('type') == 'iif_status'})},
      geo_filters: function() {return app.filters.select(function(i){return i.get('type') == 'geo'})},
      plan_filters: function() {return app.filters.select(function(i){return i.get('type') == 'plan'})},
      gm_supported_filters: function() {return app.filters.select(function(i){return i.get('type') == 'gm_supported'})},
      selectedParty: {
        get: '${selected}',
        set: function (term) {
          console.log(term);
          return this.set('selected', app.data.first());
        }
      },
      geo_search: function() {
        return app.filters.displayFor(['region', 'subregion', 'party']);
      },
      partyCount: function () {
        return this.get('parties').where({srap: false}).length;
      },
      srapCount: function () {
        return this.get('parties').where({srap: true}).length;
      }
    },
    // 
    // ACTIONS
    // 
    setFilter: function() {
      // var filter = this.event.node.dataset.filter;
      // var filterModel = app.filters.get(filter);
      // return handleFilter(filterModel);
    },
    otherFunction: function(value) {
      console.log(value);
    }
  });
}

// Interacts directly with app.data, kinda like a controller
// 
// filterModel.id === filterModel.get('shortName')
// 
function handleFilter(filterModel) {
  var collection = app.data;
  if (_.isObject(filterModel)){

    // Remove Filter if already set
    if (_.includes(collection.getFilters(), filterModel.id)) {
      collection.removeFilter(filterModel.id)
    } else {
      // Remove all others if it is an 'exclusive' type
      if (filterModel.get('exclusive')) {
        console.log('resetting');
        collection.resetFilters()
      }

      // Then add filter to collection
      collection.filterBy(filterModel.id, filterModel.get('filterState'))
    }


  } else {

    console.log('not an object', filterState, collection.getFilters());

  }
  
}

// function handleGeoSearch(location){
//   if (_.isObject(location)) {
//     console.log('probably got a Party model');
//   }
//   return;
// }

// 
// Explorer events
// 

function initExplorerEvents (explorer) {
  // Explorer
  explorer.on('selectParty', function(event, object){});


  // MapViewSelector Component
  explorer.on('MapViewSelector.toggleFilter', function(event){
    return app.filters.get(event.context.id).toggle('active');
  });
  explorer.on('MapViewSelector.allOn', function(event, type){
    return app.filters.allOn(type);
  });
  explorer.on('MapViewSelector.allOff', function(event, type){
    return app.filters.allOff(type);
  });
  explorer.on('MapViewSelector.changeMapView', function(event, mapViewIndex) {
    this.set('mapView', mapViewIndex);
  })



  explorer.on('change', function(changeObject) { 
    if (changeObject.selectedParty != undefined) {
      if (changeObject.selectedParty) { 
        console.log('change selectedParty to', changeObject.selectedParty);
        zoomMapToSelected(changeObject.selectedParty.iso2);
      } else {
        console.log('reset selectedParty ');
        zoomMapToAll();
      }
    } else if (changeObject.mapView != undefined) {
      console.log('change map view to', changeObject.mapView);
    } else {
      console.log('Other change', changeObject);
    }
  });
  
  return;
}
