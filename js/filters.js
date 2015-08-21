// 
// Filters
// 

function initFilters (collectionToFilter) {
  var filters = new Filters([], {collectionToFilter: collectionToFilter})

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
  // gm_support filters
  filters.add([
    {type: 'gm_support', title: 'Receiving support', id: 'receiving_support', filterState: {gm_support: true}},
    {type: 'gm_support', title: 'Not receiving support', id: 'not_receiving_support', filterState: {gm_support: false}}
  ]);


  filters.on('change', function(changeObject, b){
    var type = changeObject.get('type'), id = changeObject.id, active = changeObject.get('active');
    var currentFilters = this.collectionToFilter.getFilters();
    var filterId = composeFilterId(type, id);
    if (_.includes(currentFilters, filterId)) {
      this.collectionToFilter.removeFilter(filterId);
    } else {
      var filter = changeObject.get('filterState')
      this.collectionToFilter.filterBy(filterId, filter)
    }
  });

  return filters;
}

function composeFilterId (type, id) {
  return (type + ":" + id);
}
function decomposeFilterId (filterId) {
  var pieces = filterId.split(":");
  if (!pieces) { throw "FilterId is wrong", filterId}
  return {type: pieces[0], id: pieces[1]};
}

var Filter = Backbone.Model.extend({
  initialize: function(model) {
    if (!model.active) {
      this.set('active', true);
    };
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
    if (!options.collectionToFilter) {
      throw "No Collection provided for Filter"
    }
    this.collectionToFilter = options.collectionToFilter;
    return;
  },
  displayFor: function (attributes) {
    if (!_.isArray(attributes)) { return };
    return _.object(attributes, _.map(attributes, function(attribute) {
      return _(app.data.pluck(attribute)).uniq().sort().value();
    }));
  },
  allOn: function(type) {
    _.each(this.where({type: type}), function(i){ return i.set('active', true)});
  },
  allOff: function(type) {
    _.each(this.where({type: type}), function(i){ return i.set('active', false)});
  }
})