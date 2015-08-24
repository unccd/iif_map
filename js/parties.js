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
    var modelsJSON = this.toJSON();
    // Get models with attribute
    // Reject SRAPs
    var models = _.chain(modelsJSON)
      .select(function(i){return i[attribute] != ''})
      .where({srap: false})
      .value();
    // return mapped to ISO2
    return _.object(_.pluck(models, 'iso2'), _.pluck(models, attribute))
  }
});

