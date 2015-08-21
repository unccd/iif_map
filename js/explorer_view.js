window.app || (window.app = {});

// 
// Explorer view
// 

function explorer(collection, filters) {
  var collection = collection;
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
      iif_status_filters: filters.iif_status,
      geo_filters: filters.geo,
      plan_filters: filters.plan,
      gm_support_filters: filters.gm_support,
      selected: ''
    },
    computed: {
      selectedParty: {
        get: '${selected}',
        set: function (term) {
          console.log(term);
          return this.set('selected', app.data.first());
        }
      },
      geo_search: function() {
        return app.filters.geo.displayFor(['region', 'subregion', 'party']);
      },
      partyCount: function () {
        return this.get('parties').where({srap: false}).length;
      },
      srapCount: function () {
        return this.get('parties').where({srap: true}).length;
      },
      filterFacetCounts: function () {
        return this.get('parties').length;
      }
    },
    // 
    // ACTIONS
    // 
    setFilter: function() {
      var filter = this.event.node.dataset.filter;
      var filterModel = app.filters.get(filter);
      return handleFilter(filterModel);
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
  explorer.on('dance', function(event, object){
    return console.log('here', object);
  });

  explorer.on('change', function(changeObject) { 
    if (changeObject.selectedParty != undefined) {
      if (changeObject.selectedParty) { 
        console.log('change selectedParty to', changeObject.selectedParty);
        return zoomMapToSelected(changeObject.selectedParty.iso2);
      } else {
        console.log('reset selectedParty ');
        return zoomMapToAll();
      }
    } else {
      return console.log(changeObject);
    }
  });
  
  return;
}
