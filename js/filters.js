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
  _prepareFilterQuery: function(collection) {
    var filtersToQueryWith = _.where(collection.toJSON(), {active: true});
    var attributeGroups = _.groupBy(filtersToQueryWith, 'attribute'), queryGroups = {};
    _.each(attributeGroups, function(attributeGroup, index){
      var combinator;

      // TODO: Refactor - at least move config out of here
      // These $nin and $in are inverted because the whole query is a $nor
      if (_.includes(['region', 'subregion'], index)) {
        combinator = '$nin'; 
      } else {
        combinator = '$in'; }

      queryGroups[index] = _.object([combinator], [_.pluck(attributeGroup, 'value')]);
    });
    return {
      // Exclude everything in the querygroups
      $nor: queryGroups
    };
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
  getActiveFor: function(attribute) {
    if (attribute) {
      return this.where({attribute: attribute, active: true});
    } else {
      return this.where({active: true});
    }
  },
  getInactiveFor: function(attribute) {
    if (attribute) {
      return this.where({attribute: attribute, active: false});
    } else {
      return this.where({active: false});
    }
  },
  setAllActiveFor: function (attribute) {
    var filters = this.getInactiveFor(attribute);
    _.each(filters, function(option){
      option.set('active', true);
    });
  },
  setAllInactiveFor: function (attribute) {
    var filters;
    if (attribute == undefined) {
      filters = this.where({active: true})
    } else {
      filters = this.getActiveFor(attribute);
    }
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
    return this.filterDefs._prepareFilterQuery(this);
  }
})

