// 
// Init
// 

// 
// Model and Collection
// 

// 
// FILTER DEFS
// 

FilterDef = Backbone.Model.extend({
  idAttribute: 'name'
});

FilterDefs = Backbone.Collection.extend({
  model: FilterDef,

  // FILTER QUERY 
  // 
  prepareFilterQuery: function(collection) {
    var filtersToQueryWith = _.where(collection.toJSON(), {active: false});
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
    return {$nor: queryGroups};
  }
});


// 
// FILTER OPTIONS
// 

FilterOption = Backbone.Model.extend({
  toggle: function(attr, silent) {
    if (!attr) { attr = 'active' }
    var data = {}, value = this.get(attr);
    data[attr] = !value;
    this.set(data, {silent: silent});
    return;
  }
});

FilterOptions = Backbone.Collection.extend({
  model: FilterOption,
  initialize: function (models, options) {
    if (options.collectionToFilter) {
      this.collectionToFilter = options.collectionToFilter;
    } else {
      throw 'Need to define collectionToFilter'
    }
  },
  // SETTERS and GETTERS
  getForAttribute: function (attribute) {
    return this.where({attribute: attribute});
  },
  getActive: function(attribute) {
    var query = {active: true};
    if (attribute) { query.attribute = attribute }
    return this.where(query);
  },
  getAllActive: function(attribute) {
    _.where(this.getForAttribute(attribute), {active: true});
  },
  setAllActive: function (attribute) {
    _.each(this.getForAttribute(attribute), function(option){
      option.set('active', true);
    });
  },
  setAllInactive: function (attribute) {
    _.each(this.getForAttribute(attribute), function(option){
      option.set('active', false);
    });
  },
  // PRESENTERS
  decorateForFiltersList: function (attribute) {
    var filterModels = this.where({attribute: attribute});
    if (filterModels == undefined) { return; }
    var counts = this.collectionToFilter.countBy(attribute);  
    return _.map(filterModels, function(filterModel) {
      var jsonModel = filterModel.toJSON();
      jsonModel.activeCount = counts[filterModel.get('value')];
      return jsonModel;
    })
  },
  decorateForGeosearch: function (collection) {
    var _this = this;
    var geoAttributes = _.map(this.filterDefs.where({geosearch: true}), function(filterDef){return filterDef.get('name')});
    if (_.isEmpty(geoAttributes)) { 
      console.debug('Filters: no geosearch attributes found'); 
      return; 
    }
    return _.map(geoAttributes, function(geoAttribute){
      return {
        name: geoAttribute,
        options: _this.where({attribute: geoAttribute})
      }
    });
  },
  prepareFilterQuery: function() {
    return this.filterDefs.prepareFilterQuery(this);
  }
})

