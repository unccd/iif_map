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
      geo_search: function() {return this.get('filters').displayFor(['region', 'subregion', 'party']);},
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
  // // Explorer
  // explorer.on('selectParty', function(event, object){});

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

  return;
}
