window.app || (window.app = {});

// 
// Explorer view
// 

function explorer(parties, filters) {
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
      // Collections
      parties: parties,
      filters: filters,
      // State
      mapView: 1,
      selected: '',
      // Format helpers
      titleCase: function (str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
      }
    },
    computed: {
      crazyCount: function() { this.get('filters'); return app.data.crazyCount(app.filters.length);},
      selectedParty: {
        get: '${selected}',
        set: function (term) {
          console.log(term);
          return this.set('selected', app.data.first());
        }
      },
      partyCount: function () {return this.get('parties').where({srap: false}).length; },
      srapCount: function () {return this.get('parties').where({srap: true}).length; },
      // Filters
      geo_search: function() {return app.filters.displayFor(['region', 'subregion', 'party']);},
      iif_or_plan_filters: function() {return app.filters.select(function(i){return i.get('attribute') == 'iif_or_plan'})},
      plan_filters: function() {return app.filters.select(function(i){return i.get('attribute') == 'iif_plan_start'})},
      gm_supported_filters: function() {return app.filters.select(function(i){return i.get('attribute') == 'gm_supported'})}
    }
  });
}

// Interacts directly with app.data, kinda like a controller
// 
// filterModel.id === filterModel.get('shortName')
// 
// function handleFilter(filterModel) {
//   var collection = app.data;
//   if (_.isObject(filterModel)){

//     // Remove Filter if already set
//     if (_.includes(collection.getFilters(), filterModel.id)) {
//       collection.removeFilter(filterModel.id)
//     } else {
//       // Remove all others if it is an 'exclusive' type
//       if (filterModel.get('exclusive')) {
//         console.log('resetting');
//         collection.resetFilters()
//       }

//       // Then add filter to collection
//       collection.filterBy(filterModel.id, filterModel.get('filterState'))
//     }


//   } else {

//     console.log('not an object', filterState, collection.getFilters());

//   }
  
// }

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
    if (changeObject.geoSearch != undefined) {
      var searchObject = decomposeFilterId(changeObject.geoSearch);
      var type = searchObject.type, id = searchObject.id;
      var filter = _.object([type], [id]);
      app.data.filterBy(filter);
    } else if (changeObject.mapView != undefined) {
      console.log('change map view to', changeObject.mapView);
    } else {
      console.log('Other change', changeObject);
    }
  });
  
  return;
}
