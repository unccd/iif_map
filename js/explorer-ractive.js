// 
// Ractive
// 

function initRactive(collection, filters, views) {
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
      }
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
      detailForParty: function() {
        var selectedParty = this.get('selectedParty');
        if (selectedParty == '') { return };
        return new Party(selectedParty).decorateForDetailView(views, filters);
      },
      partyCount: function() {
        return this.get('collection').where({srap: false }).length;
      },
      srapCount: function() {
        return this.get('collection').where({srap: true }).length;
      },
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


  // 
  // Ractive events
  // 
  function triggerRequery(){
    var filterAttribute = ractive.get('filterView').filterAttribute
    var query = filters.prepareFilterQuery(); 
    return collection.resetWithQuery(query, filterAttribute);
  }

  // Requery when filters change
  ractive.observe('filters.*', function(object){
    triggerRequery();
  }, {init: false})

  // Watch geoSearch
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

  ractive.observe('collection', function(collection){
    console.debug('collection changed', collection.length)
  }, {init: false})

  ractive.observe('filterView', function(filterView) {
    // Rerender map with passed view definition
    this.map.mapObject.remove();
    this.map = initMap(this, filterView);
  }, {init: false})

  return ractive;
}