window.app || (window.app = {});

// 
// Explorer view
// 

function initExplorer(parties, filters, views) {
  var ractive = new Ractive({
    // 
    // CONFIG
    // 
    el: '#container',
    template: '#explorer',
    adapt: ['Backbone'],
    // 
    // DATA
    // 
    data: {
      // Collections
      parties: parties,
      filters: filters,
      // Arrays
      views: views,
      // State
      selectedParty: '',
      geoSearchValue: '',
      filterView: views[0], // TODO: Do what with `filterView`?
      // Format helpers
      titleCase: function(str) {
        return str.replace(/\w\S*/g, function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      },
      filtersFor: function(view) {
        return this.get('filters').decorateForFiltersList(view.filter);
      }
    },
    computed: {
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
    toggleFilter: function(option) {
      this.get('filters').get(option.id).toggle();
    },
    allInactive: function(attribute) {
      this.get('filters').setAllInactive(attribute);
    },
    allActive: function(attribute) {
      this.get('filters').setAllActive(attribute);
    },
    setFilterView: function(view) {
      console.debug(this.get('views'));
    }
  });

  // 
  // Explorer events
  // 

  var initExplorerEvents = function(explorer) {

    // Recalculate filterQuery when Filters change
    explorer.observe('filters.*', function(change, b, c) {
      console.debug(app.filters.getActive().length);
      var query = this.get('filters').prepareFilterQuery(); 
      this.get('parties').resetWithQuery(query);
      updateMap();
      // return console.debug('prepareFilterQuery', query);
    }, {
      init: false
    });

    explorer.observe('selectedParty', function(party) {
      // Figure zoom on selectedParty
      if (party) {
        zoomMapTo([party.iso2]);
      } else if (this.get('geoSearchValue')) {
        updateMap();
       } else {
        // Zoom to everything
        zoomMapTo();
      }
    })

    // Geosearch
    explorer.observe('geoSearchValue', function(filterId) {
      if (filterId == '') {
        _.each(this.get('filters').where({geosearch: true}), function(model){model.set('active', false)});
        return 
      } // Ignore reset, but remove any active geoAttribute filters
      this.set('selectedParty', ''); // Clear any currently active party

      var filter = this.get('filters').get(filterId);
      if (filter.get('attribute') == 'party') {
        var party = this.get('parties').where({
          party: filter.id
        });
        this.set('selectedParty', party);
      } else {
        filter.set({active: true, geosearch: true});
      }
    }, {init: false});

    explorer.on('resetGeoSearch', function() {
      this.set('selectedParty', '');
      this.set('geoSearchValue', '');
    })
  }

  initExplorerEvents(ractive);
  return ractive;
}