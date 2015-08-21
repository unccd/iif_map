window.app || (window.app = {});

// 
// Parties
// 

var Party = Backbone.Model.extend({
  // initialize: function() {
  // }
})

var Parties = Backbone.Collection.extend({
  comparator: 'party',
  model: Party
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
  displayFor: function (attributes) {
    if (!_.isArray(attributes)) { return };
    return _.object(attributes, _.map(attributes, function(attribute) {
      return _(app.data.pluck(attribute)).uniq().sort().value();
    }));
  },
  addResetOption: function (options) {
  //   if (options.type) {
  //     console.log('add reset option for', options.type, 'filter');
  //   };
    return;
  },
  facetCountsFor: function(collection) {
  //   return this.map(function (filter) {
  //     return {
  //       name: filter.id,
  //       count: collection.where(filter.get('filterState')).length
  //     }
    // })
    return;
  }

})