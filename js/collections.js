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
  initialize: function(model) {
    if (!model.active) {
      this.set('active', false);
    };
  },
  addOnInit: function () {
    // return console.log(this);
  },
  toggle: function(attr, silent) {
    var data = {}, value = this.get(attr);
    data[attr] = !value;
    return this.set(data, {silent: silent});
  }
})

var Filters = Backbone.Collection.extend({
  model: Filter,
  initialize: function (models, options) {
    return;
  },
  displayFor: function (attributes) {
    if (!_.isArray(attributes)) { return };
    return _.object(attributes, _.map(attributes, function(attribute) {
      return _(app.data.pluck(attribute)).uniq().sort().value();
    }));
  },
  allOn: function(type) {
    return _.each(this.where({type: type}), function(i){ return i.set('active', true)});
  },
  allOff: function(type) {
    return _.each(this.where({type: type}), function(i){ return i.set('active', false)});
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