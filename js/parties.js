window.app || (window.app = {});

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
  decorateForDetailView: function(views) {
    var _this = this;
    return _.chain(views).map(function(view) {
      var filterAttribute = view.filterAttribute; // e.g. 'iif_or_plan'

      var filterDef = app.filters.definitions.findWhere({
        name: filterAttribute
      });
      var attributeTitle = filterDef.get('title'); // e.g. 'IIFs established'

      var choiceValue = _this.get(filterAttribute); // e.g. 'iif' - i.e. the model's value for the filterAttribute
      var choice = app.filters.findWhere({
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

var Parties = Backbone.Collection.extend({
  comparator: 'short_name',
  model: Party,
  initialize: function(models, options) {
    this._superset = new Backbone.QueryCollection(models);
  },
  resetWithQuery: function(queryObject) {
    return this.reset(this._superset.query(queryObject));
  },
  prepareMapData: function(attribute) {
    var modelsJSON = this.toJSON();
    // Get models with attribute
    // Reject SRAPs
    var models = _.chain(modelsJSON)
      .select(function(i) {
        return i[attribute] != ''
      })
      .where({
        srap: false
      })
      .value();
    // return mapped to ISO2
    return _.object(_.pluck(models, 'iso2'), _.pluck(models, attribute))
  }
});