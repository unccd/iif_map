// 
// Init
// 

function initFilters (collectionToFilter) {
  var filters = new QueryFilters([], {collectionToFilter: collectionToFilter})

  // IIF Status filters
  // TODO: Could do a check on load to see if any Filters are undefined?
  filters.add([
    {attribute: 'iif_or_plan', value: 'iif', title: 'With IIF', id: 'with_iif'}, 
    {attribute: 'iif_or_plan', value: 'plan', title: 'No IIF, plan exists', id: 'with_plan'}, 
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

  // TODO: Seems to have a lot of logic in here...
  filters.on('change', function(filter){
    this.addFilter(filter);
  });

  return filters;
}

// 
// UTILITY
// 

function composeFilterId (attribute, id) {
  return (attribute + ":" + id);
}
function decomposeFilterId (filterId) {
  var pieces = filterId.split(":");
  if (!pieces) { throw "FilterId is wrong", filterId}
  return {type: pieces[0], id: pieces[1]};
}


// 
// Model and Collection
// 

Filter = Backbone.Model.extend({
  initialize: function(model) {
    if (model.active == undefined) {
      this.set('active', false);
    };
  },
  toggle: function(attr, silent) {
    var data = {}, value = this.get(attr);
    var newValue = !value;
    data[attr] = newValue;
    this.set(data, {silent: silent});
    if (newValue) {
      this.collection.addFilter(this);
    } else {
      this.collection.removeFilter(this);
    }
    return;
  }
})


QueryFilters = Backbone.Collection.extend({
  model: Filter,
  initialize: function (models, options) {
    if (!options.collectionToFilter) {
      throw "No Collection provided for Filter"
    }
    this.collectionToFilter = options.collectionToFilter;

    this._filters = {};
    return;
  },
  displayFor: function (attributes) {
    if (!_.isArray(attributes)) { return };
    return _.object(attributes, _.map(attributes, function(attribute) {
      return _(app.data.pluck(attribute)).uniq().sort().value();
    }));
  },
  _prepareFilterQuery: function() {
    var _this = this;
    var attributeGroups = _.groupBy(this._filters, 'attribute');
    var queryGroups = {};
    _.each(attributeGroups, function(attributeGroup, index){
      queryGroups[index] = {$in: _.pluck(attributeGroup, 'value')}
    });
    return queryGroups;
  },
  execFilters: function () {
    var queryGroups = {$or: this._prepareFilterQuery()};
    return this.collectionToFilter.resetWithQuery(queryGroups);
  },
  addFilter: function (model) {
    var filterName = composeFilterId(model.get('attribute'), model.id);
    this._filters[filterName] = model.toJSON();
    return this.execFilters();
  },
  removeFilter: function (model) {
    if (_.isObject(model)) {
      var filterName = composeFilterId(model.get('attribute'), model.id)
    }
    console.log('remove', filterName);
    // delete this._filters[filterName];
    this._filter = {};
    return this.execFilters();
  },
  getFilters: function () {
    return _.keys(this._filters);
  },
  allOn: function(attribute) {
    var _this = this;
    _.each(this.where({attribute: attribute}), function(model){
      var name = composeFilterId(model.get('attribute'), model.id);
      _this.removeFilter(model);
    });
  },
  allOff: function(attribute) {
    var _this = this;
    _.each(this.where({attribute: attribute}), function(model){
      var name = composeFilterId(model.get('attribute'), model.id);
      _this.addFilter(name);
    });
  }
})