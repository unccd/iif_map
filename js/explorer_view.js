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
    geoSearch: '',
    // 
    // DATA
    // 
    data: {
      // Collections
      parties: parties,
      filters: filters,
      // State
      mapView: 1,
      selectedParty: '',
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
        return filters.displayFor(attributes, parties);
      },
      iif_or_plan_filters: function() {return this.get('filters').select(function(i){return i.get('attribute') == 'iif_or_plan'})},
      plan_filters: function() {return this.get('filters').select(function(i){return i.get('attribute') == 'iif_plan_start'})},
      gm_supported_filters: function() {return this.get('filters').select(function(i){return i.get('attribute') == 'gm_supported'})}
    }
  });
  initExplorerEvents(ractive);
  return ractive;
}


// 
// Explorer events
// 

function initExplorerEvents (explorer) {
  // Geosearch
  explorer.observe('geoSearch', function(term){
    if (term == "") { return } // Ignore initial event from Chosen initialisation
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
    this.set('geoSearch', '');
  })

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
    if (this.get('geoSearch') != '') { return }; // There's already some geosearch zoom
    if (party) {
      zoomMapTo([party.iso2]);
    } else {
      zoomMapTo();
    }
  })

  return;
}
