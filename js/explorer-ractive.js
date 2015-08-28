// 
// Ractive
// 

function initRactive(collection, filters, views) {
  var _requery;

  // Init Ractive object
  var ractive = new Ractive({
    // CONFIG
    el: '#container',
    template: '#explorer',
    adapt: ['Backbone'],
    // DATA
    data: {
      // State
      geoSearch: '',
      selectedParty: '',
      filterView: views[0],

      // Collections
      collection: collection,
      filters: filters,

      // Arrays
      views: views,

      // Format helpers
      titleCase: function(str) {
        return str.replace(/\w\S*/g, function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      },
      // Data helpers
      filtersFor: function(view) {
        return this.get('filters').decorateForFiltersList(view.filterAttribute);
      },
      detailForParty: function(party) {
        console.log(party);
        if (party === undefined) {
          party = this.get('selectedParty');
        }
        if (party == '') { return };
        return new Party(party).decorateForDetailView(views, filters);
      },
    },
    // COMPUTED DATA
    computed: {
      // Filters
      geoSearchList: function(){
        return this.get('filters').decorateForGeosearch();
      },
      geoSearchAttribute: function(){
        return this.get('geoSearch').split(':')[0];
      },
      geoSearchValue: function(){
        return this.get('geoSearch').split(':')[1];
      },
      partyCount: function() {
        return this.get('collection').where({srap: false }).length;
      },
      srapCount: function() {
        return this.get('collection').where({srap: true }).length;
      },
      sraps: function(){
        // return this.get('collection').where({srap: true });
        return _.where(this.get('collection').toJSON(), {srap: true }); // Objects instead of models...
      }
    },
    // RACTIVE METHODS
    resetAll: function (argument) {
      this.get('filters').setAllNotExcluded();
      this.set('geoSearch', '');
      this.set('filterView', views[0]);
    },
    resetGeoSearch: function () {
      this.set('geoSearch', '');
      this.set('selectedParty', '');
    },
    toggleFilter: function(choice) {
      this.get('filters').get(choice.id).toggle();
    },
    setAllNotExcluded: function(attribute) {
      this.get('filters').setAllNotExcluded(attribute);
    },
    setAllExcluded: function(attribute) {
      this.get('filters').setAllExcluded(attribute);
    }
  });


  // Initial requery of data
  _requery();


  // 
  // Ractive events
  // 

  function _requery() {
    var filterAttribute = ractive.get('filterView').filterAttribute;
    var query = ractive.get('filters').prepareFilterQuery(); 
    return collection.resetWithQuery(query, filterAttribute);
  }

  // Requery collection when filters change
  // TODO: Could put this observer on the Filters or Collection 
  //       themselves
  ractive.observe('filters.*', function(object){
    _requery();
  }, {init: false})


  // Update map everytime collection is updated/requeried
  ractive.observe('collection', function(collection){
    this.map.updateMap();
  }, {init: false})

  // Update map when a Party is selected
  ractive.observe('selectedParty', function(){
    this.map.updateMap();
  }, {init: false})


  // Watch geoSearch and set Party if a Party is selected
  // Also reset filters if it's empty!
  ractive.observe('geoSearch', function(filterId) {
    var filter;

    // If it's a Party and there's no selectedParty already,
    // then set the selectedParty to this Party
    if (this.get('geoSearchAttribute') == 'party') {
      var party = collection.get(filterId);
      this.set('selectedParty', party.toJSON());
    }

    // On reset/empty input, remove any geoAttribute filters
    // Else activate the filter
    if (filterId == '') {
      return filters.setGeoSearchNotExcluded(); 
    } else if (filter = this.get('filters').get(filterId)) {
      filters.setGeoSearchNotExcluded(); 
      return filter.set({excluded: true, isGeoSearch: true});
    }
  }, {init: false});

  // Watch FilterView, and redraw map
  ractive.observe('filterView', function(filterView) {
    // Remove all filters that are not geoSearch
    filters.setAllNotExcludedExceptGeoSearch();

    // Requery the data to limit to just Parties with the given attribute
    _requery();

    // Rerender map with passed view definition
    this.map.mapObject.remove();
    this.map = initMap(this, filterView);
  }, {init: false})


  return ractive;
}