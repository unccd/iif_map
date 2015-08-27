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
      geoSearchList: '${filters}.decorateForGeosearch()',
      geoSearchAttribute: function(){
        this.get('geoSearch').split(':')[0];
      },
      geoSearchValue:function(){
        this.get('geoSearch').split(':')[1];
      },
      detailForParty: function() {
        var selectedParty = this.get('selectedParty');
        if (selectedParty == '') { return };

        // For some reason it's not always passed as a Party model...
        if (selectedParty instanceof Backbone.Model) {
          console.log('Creating Party model from object for display')
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
  }, {init: false})

  // Watch geoSearch
  ractive.observe('geoSearch', function(filterId) {
    var filter;

    // If it's a Party and there's no selectedParty already,
    // then set the selectedParty to this Party
    if ((this.get('geoSearchAttribute') == 'party') &&
      (this.get('selectedParty') == '')
      ){
      var party = collection.findWhere({iso2: this.get('geoSearchValue')});
      this.set('selectedParty', party);
    }

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