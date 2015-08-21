// 
// Init
// 

function initFilters (collectionToFilter) {
  var filters = new QueryFilters([], {collectionToFilter: collectionToFilter})

  // IIF Status filters
  // TODO: Could do a check on load to see if any Filters are undefined?
  filters.add([
    {type: 'iif_status', title: 'With IIF', id: 'with_iif', filterState: {iif_or_plan: 'iif'}}, 
    {type: 'iif_status', title: 'No IIF, plan exists', id: 'with_plan', filterState: {iif_or_plan: 'plan'}}, 
    {type: 'iif_status', title: 'No IIF, no plan', id: 'no_plan', filterState: {iif_or_plan: 'no_plan'}},
    {type: 'iif_status', title: 'No data', id: 'unknown', filterState: {iif_or_plan: 'unknown'}}
  ]);
  // Plan filters
  filters.add([
    {type: 'plan', title: 'Planned 2014-2015', id: '2014_2015', filterState: {iif_plan_start: '2014_2015'}},
    {type: 'plan', title: 'Planned 2016-2017', id: '2016_2017', filterState: {iif_plan_start: '2016_2017'}},
    {type: 'plan', title: 'Planned 2018-2019', id: '2018_2019', filterState: {iif_plan_start: '2018_2019'}},
  ]);
  // gm_supported filters
  filters.add([
    {type: 'gm_supported', title: 'Receiving support', id: 'receiving_support', filterState: {gm_supported: true}},
    {type: 'gm_supported', title: 'Not receiving support', id: 'not_receiving_support', filterState: {gm_supported: false}}
  ]);

  // TODO: Seems to have a lot of logic in here...
  filters.on('change', function(filter, b){
    var _this = this;
    var type = filter.get('type'), id = filter.id, active = filter.get('active');
    var currentFilters = this.collectionToFilter.getFilters();
    var filterId = composeFilterId(type, id);
    if (_.includes(currentFilters, filterId)) {
      filter.set('active', false);
      this.collectionToFilter.removeFilter(filterId);
    } else {
      var filterState = filter.get('filterState');
      _.each(currentFilters, function(currentFilter){
        var currentFilterId = decomposeFilterId(currentFilter).id;
        _this.get(currentFilterId).set('active', false);
        return _this.collectionToFilter.removeFilter(currentFilter);
      });
      filter.set('active', true);
      this.collectionToFilter.filterBy(filterId, filterState)
    }
  });

  return filters;
}

// 
// UTILITY
// 

function composeFilterId (type, id) {
  return (type + ":" + id);
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
    data[attr] = !value;
    return this.set(data, {silent: silent});
  }
})

// Filters = Backbone.Collection.extend({
//   model: Filter,
//   initialize: function (models, options) {
//     if (!options.collectionToFilter) {
//       throw "No Collection provided for Filter"
//     }
//     this.collectionToFilter = options.collectionToFilter;
//     return;
//   },
//   displayFor: function (attributes) {
//     if (!_.isArray(attributes)) { return };
//     return _.object(attributes, _.map(attributes, function(attribute) {
//       return _(app.data.pluck(attribute)).uniq().sort().value();
//     }));
//   },
//   allOn: function(type) {
//     _.each(this.where({type: type}), function(i){ return i.set('active', true)});
//   },
//   allOff: function(type) {
//     _.each(this.where({type: type}), function(i){ return i.set('active', false)});
//   }
// })


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
  execFilters: function () {
    var _this = this;
    var attributeGroups = _.groupBy(this._filters, 'attribute');
    var queryGroups = {};
    _.each(attributeGroups, function(attributeGroup, index){
      queryGroups[index] = {$in: _.pluck(attributeGroup, 'value')}
    });
    return queryGroups;
    // return this.collectionToFilter.resetWithQuery({$and: and, $or: or});
  },
  addFilter: function (filterName, filterDef) {
    return this._filters[filterName] = filterDef;
  },
  removeFilter: function (filterName) {
    return delete this._filters[filterName]
  },
  getFilters: function () {
    return _.keys(this._filters);
  }
})