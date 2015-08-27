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
      selectedParty: function(){
        var attribute = this.get('geoSearchAttribute');
        if (attribute == 'party') {
          return collection.first();
        }
      },
      // Filters
      geoSearchList: function() {
        return this.get('filters').decorateForGeosearch();
      },
      geoSearchAttribute: function(){
        return this.get('geoSearch').split(':')[0];
      },
      geoSearchValue: function(){
        return this.get('geoSearch').split(':')[1];
      },
      detailForParty: function() {
        if (selectedParty == '') { return };
        var selectedParty = this.get('selectedParty');

        // For some reason it's not always passed as a Party model...
        if (selectedParty instanceof Backbone.Model) {
          console.debug('Creating Party model from object for display')
          selectedParty = new Party(selectedParty.toJSON())
        }
        return selectedParty.decorateForDetailView(views);
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

  // Requery when filters change
  ractive.observe('filters.*', function(){
    var query = filters.prepareFilterQuery(); 
    collection.resetWithQuery(query);
    this.get('map').updateMap();
  }, {init: false})


  // Watch geoSearch
  ractive.observe('geoSearch', function(filterId) {
    var filter;

    if (filterId == '') {
      // On reset/empty input, remove any geoAttribute filters
      return filters.setGeoSearchNotExcluded(); 
    } else if (filter = this.get('filters').get(filterId)) {
      // Activate any matching filters
      return filter.set({excluded: true, isGeoSearch: true});
    }
  }, {init: false});

  ractive.observe('filterView', function(filterView) {
    // Rerender map with passed view definition
    this.get('map').mapObject.remove();
    this.set('map', initMap(this, filterView));
    this.get('map').updateMap();
  }, {init: false})

  return ractive;
}