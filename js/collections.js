window.app || (window.app = {});

// 
// Collections
// 

var Countries = Backbone.Collection.extend({
  comparator: 'country'
});