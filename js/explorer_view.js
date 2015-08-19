window.app || (window.app = {});

// 
// Explorer view
// 

function explorer(collection, filters) {
  var collection = collection;
  return new Ractive({
    el: '#container',
    template: '#explorer',
    data: {
      selectedCountry: '',
      countries: collection,
      filters: filters
    },
    adapt: ['Backbone'],
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
        collection.resetFilters()
      }

      // Then add filter to collection
      collection.filterBy(filterModel.id, filterModel.get('filterState'))
      console.log(collection.getFilters());
    }


  } else {

    console.log('not an object', filterState, collection.getFilters());

  }
  
  // if (filterState == 'with_iifs') {
  //   collection.filterBy(filterState, {iif_status: 'plan_exists'})
  // } else if (filterState == 'without_iifs') {
  //   collection.filterBy(filterState, {iif_established: false})
  // };
  // return;
}