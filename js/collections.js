window.app || (window.app = {});

// 
// Countries
// 

var Country = Backbone.Model.extend({
  // initialize: function() {
  // }
})

var Countries = Backbone.Collection.extend({
  comparator: 'country',
  model: Country
});


// 
// Filters
// 

var Filter = Backbone.Model.extend({
  initialize: function() {
    return this.addOnInit();
  },
  addOnInit: function () {
    // return console.log(this);
  }
})

var Filters = Backbone.Collection.extend({
  model: Filter,
  initialize: function (models, options) {
    return this.addResetOption(options);
  },
  addResetOption: function (options) {
    if (options.type) {
      console.log('add reset option for', options.type, 'filter');
    };
    return;
  },
  facetCountsFor: function(collection) {
    return this.map(function (filter) {
      return {
        name: filter.id,
        count: collection.where(filter.get('filterState')).length
      }
    })
  }

})