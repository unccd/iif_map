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
  decorateForDetailView: function(views, filters) {
    var _this = this;
    return _.chain(views).map(function(view) {
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
    }).compact().value();
  }
})

PartiesQueryCollection = Backbone.QueryCollection.extend({
  comparator: 'short_name',
  model: Party
})

Parties = PartiesQueryCollection.extend({
  initialize: function(models, options) {
    this._superset = new PartiesQueryCollection(models);
  },
  resetWithQuery: function(queryObject, filterAttribute) {
    queryObject["$and"] || (queryObject["$and"] = {});
    queryObject["$and"][filterAttribute]= {$ne: ''};
    var queryResult = this._superset.query(queryObject);
    return this.reset(queryResult);
  },
  prepareMapRegionsData: function(attribute) {
    var partiesJSON = this.toJSON();
    // Get models with attribute
    // Reject SRAPs
    var models = _.chain(partiesJSON)
      .select(function(i) {return i[attribute] != ''})
      .where({use_centre_point: false, srap: false })
      .value();
    // return mapped to ISO2
    return _.object(_.pluck(models, 'iso2'), _.pluck(models, attribute))
  },
  prepareMapMarkersData: function(attribute) {
    var partiesJSON = this.toJSON();
    var models = _.chain(partiesJSON)
      .where({use_centre_point: true, srap: false, })
      .value();

    var markers = {};
    _.each(models, function(model){
      var marker = {
        name: model.short_name,
        latLng: [model.lat, model.lon],
        style: {fill: 'yellow'},
        value: model[attribute]
      };
      markers[model.iso2] = marker;
    });
    return markers;
  }
});