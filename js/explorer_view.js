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
      selectedCountry: '',
      countries: collection,
      filters: filters
    },
    computed: {
      countryCount: function () {
        return this.get('countries').where({srap: false}).length;
      },
      srapCount: function () {
        return this.get('countries').where({srap: true}).length;
      },
      filterFacetCounts: function () {
        return this.get('countries').length;
      }
    },
    // 
    // ACTIONS
    // 
    dance: function () {
      return console.log('this?');
    },
    setFilter: function() {
      var filter = this.event.node.dataset.filter;
      var filterModel = app.filters.get(filter);
      return handleFilter(filterModel);
    },
    viewCountry: function(iso3) {
      var selectedCountry = collection.findWhere({
        iso3: iso3
      });
      this.set('selectedCountry', selectedCountry);
    },
    otherFunction: function(value) {
      console.log(value);
    }
  });
}

// Interacts directly with app.filtered_data, kinda like a controller
// 
// filterModel.id === filterModel.get('shortName')
// 
function handleFilter(filterModel) {
  var collection = app.filtered_data;
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

function explorerEvents (explorer) {
  explorer.on('dance', function(event, object){
    return console.log('here', object);
  });
  
  explorer.on('change', function(changeObject) { 
    if (changeObject.selectedCountry != undefined) {
      if (changeObject.selectedCountry) { 
        console.log('change selectedCountry to', changeObject.selectedCountry);
        return zoomMapToSelected(changeObject.selectedCountry.iso2);
      } else {
        console.log('reset selectedCountry ');
        return zoomMapToAll();
      }
    } else {
      return console.log(changeObject);
    }
  });
  
  return;
}
