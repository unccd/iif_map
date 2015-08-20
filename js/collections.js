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
  idAttribute: 'short_name',
  addThis: function () {
    return console.log(this);
  }
})

var Filters = Backbone.Collection.extend({
  model: Filter,
  facetCountsFor: function(collection) {
    return this.map(function (filter) {
      return {
        name: filter.id
        ,
        count: collection.where(filter.get('filterState')).length
      }
    })
  }

})