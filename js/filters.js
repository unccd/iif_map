// 
// Init
// 

function initFilters () {
  var filterTypes = new FilterTypes;
  filterTypes.initFromDefinitionFile('admin_scripts/querious/iif_status.json');
  return filterTypes;
}

// 
// Model and Collection
// 

FilterType = Backbone.Model.extend({
  initialize: function(attributes, options){
    // Infer value from title
    if (this.get('value_from_title') != undefined) {
      options = _.map(this.get('options'), function(option){
        var title = option.title;
        return {
          title: title,
          value: title.replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase()
        }
      })
      this.set('options', options);
    }
  }
});

FilterTypes = Backbone.Collection.extend({
  model: FilterType,
  initFromDefinitionFile: function(file, filtersCollection) {
    var _this = this;
    $.getJSON(file, function(data) {
      var attributes = data.fields.attributes;
      _this.reset(attributes);
    });
  },
  // 
  // PRESENTERS
  // 
  presentForGeosearch: function (collection) {
    var geoAttributes = this.where({geosearch:true});
    if (_.isEmpty(geoAttributes)) { throw 'Cannot find any geo attributes' };

    var geoSeachObject = _.map(geoAttributes, function(geoAttribute){
      return _(collection).pluck(geoAttribute.get('name')).uniq().sort().value();
    })
    console.debug(geoSeachObject);

    return geoSeachObject;
  },
  presentForFiltersList: function (attribute, collection) {
    var filterModels = this.findWhere({name: attribute}).get('options');
    var counts = collection.countBy(attribute);  
    return _.map(filterModels, function(i) {
      i.set('activeCount', counts[i.get('value')]);
      return i;
    })
  },
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
});

FilterOption = Backbone.Model.extend({
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

FilterOptions = Backbone.Collection.extend({
  model: FilterOption,
})