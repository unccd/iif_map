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
      selectedParty: '',
      mapView: 1,
      parties: collection,
      geo_filters: filters.geo,
      plan_filters: filters.plan
    },
    computed: {
      geo_search: function() {
        // Returns array of arrays: [['Africa', [africa_parties]], ['Asia', [asia_parties]],...]
        return _.sortBy(_.pairs(app.data.groupBy('region')), function(i){return i[0];});
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
    viewParty: function(iso3) {
      var selectedParty = collection.findWhere({
        iso3: iso3
      });
      this.set('selectedParty', selectedParty);
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
