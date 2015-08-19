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
  model: Backbone.Model.extend({idAttribute: 'short_name'})
  // ,
  // initialize: function (models, options) {
  //   if (options.onCollection) {
  //     this.onCollection = options.onCollection;
  //   }
  //   return;
  // },
  // facetCountsFor: function(attribute) {
  //   return this.onCollection;
  // }

})