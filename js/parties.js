window.app || (window.app = {});

// 
// Parties
// 

var Parties = Backbone.Collection.extend({
  comparator: 'short_name',
  initialize: function(models, options) {
    this._superset = new Backbone.QueryCollection(models);
  },
  resetWithQuery: function (queryObject) {
    return this.reset(this._superset.query(queryObject));
  },
  prepareMapData: function(attribute) {
    var models = _.select(this.toJSON(), {srap: false});
    return _.object(_.pluck(models, 'iso2'), _.pluck(models, attribute))
  }
});

