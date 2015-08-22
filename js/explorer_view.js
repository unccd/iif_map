window.app || (window.app = {});

// 
// Explorer view
// 

function initExplorer(parties, filters) {
  var ractive = new Ractive({
    // 
    // CONFIG
    // 
    el: '#container',
    template: '#explorer',
    components: { MapViewSelector: MapViewSelector },
    adapt: ['Backbone'],
    // 
    // DATA
    // 
    data: {
      // Collections
      parties: parties,
      filters: filters,
      // State
      selectedParty: '',
      geoSearch: '',
      mapView: 1, // TODO: Do what with this?
      // Format helpers
      titleCase: function (str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
      }
    },
    computed: {
      partyCount: function () {return this.get('parties').where({srap: false}).length; },
      srapCount: function () {return this.get('parties').where({srap: true}).length; },
      // Filters
      geo_search: function() {
        var filters = this.get('filters');
        var parties = this.get('parties');
        var attributes = ['region', 'subregion', 'party'];

        return filters.presentForGeosearch(attributes, parties);
      },
      iif_or_plan_filters: function() {
        var filters = this.get('filters');
        return filters.presentForFiltersList('iif_or_plan', filters, this.get('parties'));
      },
      plan_filters: function() {
        var filters = this.get('filters');
        return filters.presentForFiltersList('iif_plan_start', filters, this.get('parties'));
      },
      gm_supported_filters: function() {
        var filters = this.get('filters');
        return filters.presentForFiltersList('gm_supported', filters, this.get('parties'));
      }
    }
  });
  initExplorerEvents(ractive);
  return ractive;
}


// 
// Explorer events
// 

function initExplorerEvents (explorer) {

  // MapViewSelector Component
  explorer.on('MapViewSelector.toggleFilter', function(event){
    return this.get('filters').get(event.context.id).toggle('active');
  });
  explorer.on('MapViewSelector.allOn', function(event, type){
    return this.get('filters').allOn(type);
  });
  explorer.on('MapViewSelector.allOff', function(event, type){
    return this.get('filters').allOff(type);
  });
  explorer.on('MapViewSelector.changeMapView', function(event, mapViewIndex) {
    this.set('mapView', mapViewIndex);
  });

  // Recalculate filterQuery when Filters change
  // This is the only place where changes are observed outside the ractive
  explorer.observe('filters.*', function () {
    var query = this.get('filters').prepareFilterQuery(); 
    this.get('parties').resetWithQuery(query);
    updateMap();
  });

  explorer.observe('selectedParty', function(party) {
    if (this.get('geoSearch') != '') {return;} // Clear geosearch and skip any zooming.

    // Figure zoom on selectedParty
    if (party) {
      zoomMapTo([party.iso2]);
    } else {
      zoomMapTo();
    }
  })

  // Geosearch
  explorer.observe('geoSearch', function(term){
    if (term == "") { return } // Ignore initial event from Chosen initialisation

    this.set('selectedParty', ''); // Clear any currently active party

    var split = term.split(':');
    var attribute = split[0];
    var value = split[1];
    if (attribute == 'party') {
      var party = this.get('parties').findWhere({party: value});
      this.set('selectedParty', party);
      updateMap();
    } else {
      var object = {attribute: attribute, value: value, active: false, geo: true};
      this.get('filters').add(object);
    }
  });
  
  explorer.on('resetGeoSearch', function() {
    var filters = this.get('filters');
    _.each(filters.where({geo: true}), function(model) {
      model.destroy();
    });
    this.set('selectedParty', '');
    this.set('geoSearch', '');
  })

}
