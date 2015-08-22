// 
// Init
// 

function initFilters (collectionToFilter) {
  var filters = new QueryFilters([], {collectionToFilter: collectionToFilter})

  // IIF Status filters
  // TODO: Could do a check on load to see if any Filters are undefined?
  filters.add([
    {active: true, attribute: 'iif_or_plan', value: 'iif', title: 'With IIF', id: 'with_iif'}, 
    {active: true, attribute: 'iif_or_plan', value: 'plan', title: 'No IIF, plan exists', id: 'with_plan'}, 
    {attribute: 'iif_or_plan', value: 'no_plan', title: 'No IIF, no plan', id: 'no_plan'},
    {attribute: 'iif_or_plan', value: 'unknown', title: 'No data', id: 'unknown'}
  ]);
  // Plan filters
  filters.add([
    {attribute: 'iif_plan_start', value: '2014_2015', title: 'Planned 2014-2015', id: '2014_2015'},
    {attribute: 'iif_plan_start', value: '2016_2017', title: 'Planned 2016-2017', id: '2016_2017'},
    {attribute: 'iif_plan_start', value: '2018_2019', title: 'Planned 2018-2019', id: '2018_2019'}
  ]);
  // gm_supported filters
  filters.add([
    {attribute: 'gm_supported', value: true, title: 'Receiving support', id: 'receiving_support'},
    {attribute: 'gm_supported', value: false, title: 'Not receiving support', id: 'not_receiving_support'}
  ]);

  return filters;
}

// 
// Model and Collection
// 

Filter = Backbone.Model.extend({
  initialize: function(model) {
    if (model.active == undefined) {
      this.set('active', true);
    };
  },
  toggle: function(attr, silent) {
    var data = {}, value = this.get(attr);
    data[attr] = !value;
    this.set(data, {silent: silent});
    return;
  }
})


QueryFilters = Backbone.Collection.extend({
  model: Filter,
  initialize: function (models, options) {
    return;
  },
  displayFor: function (attributes) {
    if (!_.isArray(attributes)) { throw "Need to pass an array of attributes" };
    return _.object(attributes, _.map(attributes, function(attribute) {
      return _(app.data.pluck(attribute)).uniq().sort().value();
    }));
  },
  prepareFilterQuery: function() {
    var activeFilters = _.where(this.toJSON(), {active: false});
    var attributeGroups = _.groupBy(activeFilters, 'attribute'), queryGroups = {};
    _.each(attributeGroups, function(attributeGroup, index){
      queryGroups[index] = {$in: _.pluck(attributeGroup, 'value')}
    });
    return queryGroups;
  },
  getFilters: function () {
    return this.where({active: true});
  },
  allOn: function(attribute) {
    _.each(this.where({attribute: attribute}), function(model) {
      model.set('active', true);
    });
  },
  allOff: function(attribute) {
    _.each(this.where({attribute: attribute}), function(model) {
      model.set('active', false);
    });
  }
})