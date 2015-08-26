// 
// Ractive
// 

function initRactive(parties, filters, views) {
  // Init Ractive object
  var ractive = new Ractive({
    // CONFIG
    el: '#container',
    template: '#explorer',
    adapt: ['Backbone'],
    // DATA
    data: {
      // Collections
      parties: parties,
      filters: filters,
      // Arrays
      views: views,
      // State
      selectedParty: '',
      geoSearchValue: '',
      filterView: views[0],
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
      detailForParty: function() {
        var selectedParty = this.get('selectedParty');
        var views = this.get('views');

        if (selectedParty == '') { return };
        if (selectedParty instanceof Backbone.Model) {
          selectedParty = new Party(selectedParty.toJSON())
        }
        return selectedParty.decorateForDetailView(views);
      },
      partyCount: function() {
        return this.get('parties').where({
          srap: false
        }).length;
      },
      srapCount: function() {
        return this.get('parties').where({
          srap: true
        }).length;
      },
      // Filters
      geo_search: function() {
        return this.get('filters').decorateForGeosearch();
      },
      filtersFor_iif_or_plan: function() {
        return this.get('filters').decorateForFiltersList('iif_or_plan');
      },
      filtersFor_iif_plan_start: function() {
        return this.get('filters').decorateForFiltersList('iif_plan_start');
      },
      filtersFor_gm_supported: function() {
        return this.get('filters').decorateForFiltersList('gm_supported');
      },
    },
    // RACTIVE METHODS
    resetAll: function (argument) {
      this.get('filters').setAllNotExcluded();
      this.set('selectedParty', '');
      this.set('geoSearchValue', '');
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


  // Recalculate filterQuery when Filters change
  ractive.observe('filters.*', function(change, b, c) {
    var query = this.get('filters').prepareFilterQuery(); 
    this.get('parties').resetWithQuery(query);
    this.get('map').updateMap();
  }, {init: false });

  ractive.observe('selectedParty', function(party) {
    // Figure zoom on selectedParty
    if (party) {
      this.get('map').zoomMapTo([party.iso2]);
    } else if (this.get('geoSearchValue')) {
      // If there's already a geoSearchValue then just update map
      this.get('map').updateMap();
     } else {
      // Zoom to everything
      this.get('map').zoomMapTo();
    }
  }, {init: false})

  ractive.observe('geoSearchValue', function(filterId) {
    // Ignore reset, but remove any excluded geoAttribute filters
    if (filterId == '') {
      _.each(this.get('filters').where({geosearch: true}), function(model){model.set('excluded', false)});
      return 
    } 
    this.set('selectedParty', ''); // Clear any currently excluded party

    var filter = this.get('filters').get(filterId);
    if (filter.get('attribute') == 'party') {
      var party = this.get('parties').findWhere({iso2: filter.get('value')});
      this.set('selectedParty', party);
    } else {
      filter.set({excluded: true, geosearch: true});
    }
  }, {init: false});

  ractive.on('resetGeoSearch', function() {
    this.set('selectedParty', '');
    this.set('geoSearchValue', '');
  });

  ractive.observe('filterView', function(filterView) {
    this.get('map').mapObject.remove();
    this.set('map', initMap(this, filterView));
    // update map to reshow geoSearch if excluded
    this.get('map').updateMap();
  }, {init: false})

  return ractive;
}