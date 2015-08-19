window.app || (window.app = {});

// 
// Models
// 

var Country = Backbone.Model.extend({
  // initialize: function() {
  // }
})

// 
// Collections
// 

var Countries = Backbone.Collection.extend({
  model: Country,
  // initialize: function() {
  //   return console.log('init collection');
  // },
  comparator: 'country'
});