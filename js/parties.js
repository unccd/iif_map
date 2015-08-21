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

