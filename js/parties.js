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
  model: Party,
  initialize: function(models, options) {
    this._superset = new Backbone.QueryCollection(models);
  },
  resetWithQuery: function (queryObject) {
    return this.reset(this._superset.query(queryObject));
  },
  crazyCount: function (argument) {
    return argument;
  }
});

