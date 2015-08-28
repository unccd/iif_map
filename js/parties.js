// All DCP countries are ACP countries, also need to include the SRAP data
function bootstrapParties(partiesObject) {
  var parties = _.select(partiesObject, function(model) {
    return model.acp || model.srap;
  })
  return new Parties(parties);
}

// 
// Parties
// 
Party = Backbone.Model.extend({
  initialize: function(attrs, options) {
    if (attrs.iso2 != undefined){
      this.set('id', 'party:' + attrs.iso2);
    } else if (attrs.short_name){
      this.set('id', 'party:' + attrs.short_name);
    } else {
      throw 'Cannot create id for Party'
    }
  },
  decorateRegionSubregion: function(filters){
    var region, regionTitle, subregion, subregionTitle;

    region = this.get('region');
    regionTitle = filters.findWhere({attribute: 'region', value: region}).get('title')

    subregion = this.get('subregion');
    subregionTitle = filters.findWhere({attribute: 'subregion', value: subregion}).get('title')

    return {
      regionTitle: regionTitle,
      subregionTitle: subregionTitle
    }
  },
  decorateForDetailView: function(views, filters) {
    var _this = this;
    return _.chain(views)
      .map(function(view) {
        var filterAttribute = view.filterAttribute; // e.g. 'iif_or_plan'

        var filterDef = filters.definitions.findWhere({
          name: filterAttribute
        });
        var attributeTitle = filterDef.get('title'); // e.g. 'IIFs established'

        var choiceValue = _this.get(filterAttribute); // e.g. 'iif' - i.e. the model's value for the filterAttribute
        var choice = filters.findWhere({
          attribute: filterAttribute,
          value: choiceValue
        })
        if (choice == undefined || choiceTitle == '') {
          return
        }

        var attributeColour = choice.get('colour');
        var choiceTitle = choice.get('title');

        return {
          attributeTitle: attributeTitle,
          choiceTitle: choiceTitle,
          colour: attributeColour,
        }
      })
      .compact()
      .value();
  }
})

PartiesQueryCollection = Backbone.QueryCollection.extend({
  comparator: 'short_name',
  model: Party
})

Parties = PartiesQueryCollection.extend({
  initialize: function(models, options) {
    // Create a Backbone.QueryCollection from the original models
    this._superset = new PartiesQueryCollection(models);
  },
  resetWithQuery: function(queryObject, filterAttribute) {
    queryObject["$and"] || (queryObject["$and"] = {});
    queryObject["$and"][filterAttribute]= {$ne: ''};

    // Pass the query to the Backbone.QueryCollection
    // and reset the Filters Collection to the result
    var queryResult = this._superset.query(queryObject);
    this.reset(queryResult);
  },
  prepareMapRegionsData: function(attribute) {
    // Get models with attribute set
    // Reject SRAPs
    var models = _.chain(this.toJSON())
      .reject(function(i) {return i[attribute] === ''})
      .where({use_centre_point: false, srap: false})
      .value();

    // return mapped to ISO2
    var iso2s = _.pluck(models, 'iso2');
    var attributes = _.pluck(models, attribute);
    return _.object(iso2s, attributes)
  },
  prepareMapMarkersData: function(attribute) {
    var models, markers;

    models = _.chain(this.toJSON())
      .reject(function(i) {return i[attribute] === ''})
      .where({use_centre_point: true, srap: false})
      .value();

    return _.object(
      _.map(models, function(model){
        return [model.iso2, {
          name: model.short_name,
          latLng: [model.lat, model.lon],
          value: model[attribute]
        }];
      })
    );
  }
});