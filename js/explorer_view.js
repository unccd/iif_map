window.app || (window.app = {});

// 
// Explorer view
// 

function explorer(collection) {
  return new Ractive({
    el: '.container',
    template: '#explorer',
    data: {
      selectedCountry: '',
      countries: collection,
      withIifs: function(countries) {
        return countries.select(function(i) {
          return i.get('iif_established');
        });
      },
      withoutIifs: function(countries) {
        return countries.select(function(i) {
          return !i.get('iif_established');
        });
      }
    },
    adapt: ['Backbone'],
    setFilter: function(filterState) {
      if (filterState == 'with_iifs') {
        collection.filterBy(filterState, {iif_established: true})
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