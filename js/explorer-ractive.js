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
      filterView: views[0],
      // Format helpers
      titleCase: function(str) {
        return str.replace(/\w\S*/g, function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      },
      filtersFor: function(view) {
        return this.get('filters').decorateForFiltersList(view.filterAttribute);
      }
    },
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
    resetAll: function (argument) {
      this.get('filters').setAllActiveFor();
      this.set('selectedParty', '');
      this.set('geoSearchValue', '');
      this.set('filterView', views[0]);
    },
    toggleFilter: function(option) {
      this.get('filters').get(option.id).toggle();
    },
    setAllInactiveFor: function(attribute) {
      this.get('filters').setAllInactiveFor(attribute);
    },
    setAllActiveFor: function(attribute) {
      this.get('filters').setAllActiveFor(attribute);
    }
  });

  // 
  // Explorer events
  // 

  var initExplorerEvents = function(explorer) {

    // Recalculate filterQuery when Filters change
    explorer.observe('filters.*', function(change, b, c) {
      if (app.DEBUG) { console.debug('filters', change, b, c); }
      var query = this.get('filters').prepareFilterQuery(); 
      this.get('parties').resetWithQuery(query);
      app.map.updateMap();
      // return console.debug('prepareFilterQuery', query);
    }, {init: false });

    explorer.observe('selectedParty', function(party) {
      if (app.DEBUG) { console.debug('selectedParty', party); }
      // Figure zoom on selectedParty
      if (party) {
        app.map.zoomMapTo([party.iso2]);
      } else if (this.get('geoSearchValue')) {
        app.map.updateMap();
       } else {
        // Zoom to everything
        app.map.zoomMapTo();
      }
    }, {init: false})

    // Geosearch
    explorer.observe('geoSearchValue', function(filterId) {
      if (app.DEBUG) { console.debug('geoSearchValue', filterId); }
      if (filterId == '') {
        _.each(this.get('filters').where({geosearch: true}), function(model){model.set('active', false)});
        return 
      } // Ignore reset, but remove any active geoAttribute filters
      this.set('selectedParty', ''); // Clear any currently active party

      var filter = this.get('filters').get(filterId);
      if (filter.get('attribute') == 'party') {
        var party = this.get('parties').findWhere({iso2: filter.get('value')});
        this.set('selectedParty', party);
      } else {
        filter.set({active: true, geosearch: true});
      }
    }, {init: false});

    explorer.on('resetGeoSearch', function() {
      this.set('selectedParty', '');
      this.set('geoSearchValue', '');
    });

    // Filter View
    explorer.observe('filterView', function(filterView) {
      if (app.DEBUG) { console.debug('filterView', filterView); }
      app.map.mapObject.remove();
      app.map = initMap(this, filterView);
      // update map to reshow geoSearch if active
      app.map.updateMap();
    }, {init: false})
  }

  initExplorerEvents(ractive);
  return ractive;
}