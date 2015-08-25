// 
// Init
// 

function bootstrapFilters(filterDefs, partiesCollection) {
  var addCountriesToFilter = function(filter, collection) {
    // Set value and title on options
    var valueField = filter.value_field;
    var titleField = filter.title_field;

    // Extract Countries from provided Parties collection
    filter.options = collection.map(function(party) {
      return {
        id: 'randomId',
        value: party.get(valueField),
        title: party.get(titleField),
      }
    });
  }
  var prepareOption = function(option, attribute) {
    option.attribute = attribute;
    option.id = attribute + ':' + option.value;
    option.excluded = false;
    return option;
  }

  // Create FilterOptions by copying properties from the attribute 
  var filterOptionsObjects = [];
  _.each(filterDefs.attributes, function(filter){
    var attribute = filter.name;
    if (filter.type == 'country') {
      addCountriesToFilter(filter, partiesCollection)
    }
    _.each(filter.options, function(option){
      filterOptionsObjects.push(prepareOption(option, attribute)) 
    })
  })

  var filterOptions = new FilterOptions(filterOptionsObjects, {
    collectionToFilter: partiesCollection
  });

  // Attach filterDefs
  filterOptions.filterDefs = new FilterDefs(filterDefs.attributes);
  return filterOptions;
}



// 
// Model and Collection
// 

// 
// FILTER DEFS
// 

FilterDef = Backbone.Model.extend({
  idAttribute: 'name',
  initialize: function(attributes) {
    this.unset('options');
  }
});

FilterDefs = Backbone.Collection.extend({
  model: FilterDef,

  // FILTER QUERY 
  // 
  _prepareFilterQuery: function(collection) {
    var filtersToQueryWith = _.where(collection.toJSON(), {
      excluded: true
    });
    var attributeGroups = _.groupBy(filtersToQueryWith, 'attribute'),
      queryGroups = {};
    _.each(attributeGroups, function(attributeGroup, index) {
      var combinator;

      // TODO: Refactor - at least move config out of here
      // These $nin and $in are inverted because the whole query is a $nor
      if (_.includes(['region', 'subregion'], index)) {
        combinator = '$nin';
      } else {
        combinator = '$in';
      }

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
    if (!attr) {
      attr = 'excluded'
    }
    var data = {},
      value = this.get(attr);
    data[attr] = !value;
    this.set(data, {
      silent: silent
    });
    return;
  }
});

FilterOptions = Backbone.Collection.extend({
  model: FilterOption,
  initialize: function(models, options) {
    if (options.collectionToFilter) {
      this.collectionToFilter = options.collectionToFilter;
    } else {
      throw 'Need to define collectionToFilter'
    }
  },
  _prepareModel: function(model, options) {
    // Infer value from title if requested - assumes snake case
    if (model.value_from_title == 'snake_case') {
      var attribute = model.name;
      model.value = app.utils.snake_case(model.title);
    };
  //   // Add countries if needed
  //   if (model.type == 'country') {

  //     var valueField = model.value_field;
  //     var titleField = model.title_field;

  //     // Extract Countries from provided collection
  //     model.options = this.collectionToFilter.map(function(party) {
  //       return {
  //         id: 'randomId',
  //         value: party.get(valueField),
  //         title: party.get(titleField),
  //       }
  //     });
  //   }
  //   model.attribute = attribute;
  //   model.id = attribute + ':' + model.value;
  //   model.excluded = false;

    return Backbone.Collection.prototype._prepareModel.call(this, model, options);
  },
  // SETTERS and GETTERS
  getForAttribute: function(attribute) {
    return this.where({
      attribute: attribute
    });
  },
  getExcluded: function(attribute) {
    if (attribute) {
      return this.where({
        attribute: attribute,
        excluded: true
      });
    } else {
      return this.where({
        excluded: true
      });
    }
  },
  getNotExcluded: function(attribute) {
    if (attribute) {
      return this.where({
        attribute: attribute,
        excluded: false
      });
    } else {
      return this.where({
        excluded: false
      });
    }
  },
  setAllExcluded: function(attribute) {
    var filters = this.getNotExcluded(attribute);
    _.each(filters, function(option) {
      option.set('excluded', true);
    });
  },
  setAllNotExcluded: function(attribute) {
    var filters = this.getExcluded(attribute);
    _.each(filters, function(option) {
      option.set('excluded', false);
    });
  },
  // PRESENTERS
  decorateForFiltersList: function(attribute) {
    var filterModels = this.where({
      attribute: attribute
    });
    if (filterModels == undefined) {
      return;
    }
    var counts = this.collectionToFilter.countBy(attribute);
    return _.map(filterModels, function(filterModel) {
      var jsonModel = filterModel.toJSON();
      jsonModel.activeCount = counts[filterModel.get('value')];
      return jsonModel;
    })
  },
  decorateForGeosearch: function(collection) {
    var _this = this;
    var geoAttributes = _.map(this.filterDefs.where({
      geosearch: true
    }), function(filterDef) {
      return filterDef.get('name')
    });
    if (_.isEmpty(geoAttributes)) {
      console.debug('Filters: no geosearch attributes found');
      return;
    }
    return _.map(geoAttributes, function(geoAttribute) {
      return {
        name: geoAttribute,
        options: _this.where({
          attribute: geoAttribute
        })
      }
    });
  },
  prepareFilterQuery: function() {
    return this.filterDefs._prepareFilterQuery(this);
  }
})