window.app || (window.app = {});

// 
// Explorer view
// 

function explorer(data) {
  return new Ractive({
    el: '.container',
    template: '#explorer',
    data: {
      selectedCountry: '',
      countries: data,
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
    addFilter: function(filterState) {
      console.log(filterState);
    },
    viewCountry: function(iso3) {
      var selectedCountry = app.data.findWhere({
        iso3: iso3
      });
      this.set('selectedCountry', selectedCountry);
    }
  });
}
