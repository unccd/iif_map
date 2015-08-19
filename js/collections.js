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


var Filters = Backbone.Collection.extend({
  model: Backbone.Model.extend({idAttribute: 'short_name'}),
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