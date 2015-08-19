window.app || (window.app = {});

// 
// Explorer view
// 

function explorer(collection) {
  return new Ractive({
    el: '#container',
    template: '#explorer',
    data: {
      selectedCountry: '',
      countries: collection
    },
    computed: {
      withIIFs: function() {
        return this.get('countries').select(function(i) {
          return i.get('iif_or_plan') == 'iif';
        });
      }
    },
    adapt: ['Backbone'],
    setFilter: function(filterState) {
      if (filterState == 'with_iifs') {
        collection.filterBy(filterState, {iif_status: 'plan_exists'})
      } else if (filterState == 'without_iifs') {
        collection.filterBy(filterState, {iif_established: false})
      };
      return;
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

function figureFilter(filterState, collection) {

}