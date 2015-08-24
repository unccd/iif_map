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
    allOn: function(attribute) {
      this.get('filters').setAllActive(attribute);
    },
    allOff: function(attribute) {
      this.get('filters').setAllInactive(attribute);
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
      // TODO: Include geoSearch in filterQuery

      var query = this.get('filters').prepareFilterQuery(); 
      this.get('parties').resetWithQuery(query);
      updateMap();
      return console.debug('prepareFilterQuery', query);
    }, {
      init: false
    });

    explorer.observe('selectedParty', function(party) {
      // if (this.get('geoSearchValue') != '') {return;} // Clear geosearch and skip any zooming.

      // Figure zoom on selectedParty
      if (party) {
        zoomMapTo([party.iso2]);
      } else {
        zoomMapTo();
      }
    })

    // Geosearch
    explorer.observe('geoSearchValue', function(filterId) {
      if (filterId == '') {
        return
      } // Ignore reset
      this.set('selectedParty', ''); // Clear any currently active party

      var filter = this.get('filters').get(filterId);
      if (filter.get('attribute') == 'party') {
        var party = this.get('parties').where({
          party: filter.id
        });
        this.set('selectedParty', party);
      }
    }, {
      init: false
    });

    explorer.on('resetGeoSearch', function() {
      this.set('selectedParty', '');
      this.set('geoSearchValue', '');
    })
  }

  initExplorerEvents(ractive);
  return ractive;
}