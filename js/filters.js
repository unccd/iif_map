// 
// Init
// 

function initFilters () {
  var filters = new QueryFilters()

  // IIF Status filters
  // TODO: Could do a check on load to see if any Filters are undefined?
  filters.add([
    {attribute: 'iif_or_plan', value: 'iif', title: 'IIF established', id: 'with_iif'}, 
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
    {attribute: 'gm_supported', value: true, title: 'Receiving GM support', id: 'receiving_support'},
    {attribute: 'gm_supported', value: false, title: 'Not receiving GM support', id: 'not_receiving_support'}
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
  // 
  // PRESENTERS
  // 
  presentForGeosearch: function (attributes) {
    if (!_.isArray(attributes)) { throw "Need to pass an array of attributes" };
    return _.object(attributes, _.map(attributes, function(attribute) {
      return _(app.data.pluck(attribute)).uniq().sort().value();
    }));
  },
  presentForFiltersList: function(attribute, filters, parties) {
    var filterModels = filters.select(function(i){return i.get('attribute') == attribute});
    var counts = parties.countBy(attribute);
    return _.map(filterModels, function(i){i.set('activeCount', counts[i.get('value')]);return i;})
  },
  // 
  // FILTER QUERY 
  // 
  prepareFilterQuery: function() {
    var filtersToQueryWith = _.where(this.toJSON(), {active: false});
    var attributeGroups = _.groupBy(filtersToQueryWith, 'attribute'), queryGroups = {};
    _.each(attributeGroups, function(attributeGroup, index){
      var combinator;
      // TODO: Refactor - at least move config out of here
      if (_.includes(['region', 'subregion'], index)) {
        combinator = '$nin'; 
      } else {
        combinator = '$in'; }
      queryGroups[index] = _.object([combinator], [_.pluck(attributeGroup, 'value')]);
    });
    return queryGroups;
  },
  // 
  // BULK EDITS
  // 
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