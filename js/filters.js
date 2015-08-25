// 
// Init
// 

function bootstrapFilters(filterDefs, partiesCollection) {
// function bootstrapFilters(filterOptionsObject, filterDefsObject, partiesCollection) {

  // Create FilterDefs by removing options from each attribute
  var filterDefObjects = _.map(filterDefs.attributes, function(facet) {
    return _.omit(facet, 'options')
  })
  var filterDefsCollection = new FilterDefs(filterDefObjects);


  // Create FilterOptions by copying properties from the attribute 
  var filterOptionsPrepared = _.chain(filterDefs.attributes).map(function(filter) {

    var attribute = filter.name;

    // Add countries if needed
    if (filter.type == 'country') {
      // Set value and title on options
      var valueField = filter.value_field;
      var titleField = filter.title_field;

      // Extract Countries from provided Parties collection
      filter.options = partiesCollection.map(function(party) {
        return {
          id: 'randomId',
          value: party.get(valueField),
          title: party.get(titleField),
        }
      });
    }

    return _.map(filter.options, function(option) {
      // Infer value from title if requested - assumes snake case
      if (filter.value_from_title != undefined) {
        var title = option.title;
        // snake_case conversion
        option.value = app.utils.snake_case(title);
      };

      option.attribute = attribute;
      option.id = attribute + ':' + option.value;
      option.excluded = false;

      return option;
    });
  }).flatten().value();

  var filterOptions = new FilterOptions(filterOptionsPrepared, {
    collectionToFilter: partiesCollection
  });
  // Attach filterDefs for later
  filterOptions.filterDefs = filterDefsCollection;
  return filterOptions;
}

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