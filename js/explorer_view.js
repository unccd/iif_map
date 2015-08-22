window.app || (window.app = {});

// 
// Explorer view
// 

function explorer(parties, filters) {
  return new Ractive({
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
      selected: '',
      // Format helpers
      titleCase: function (str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
      }
    },
    computed: {
      // selectedParty: {
      //   get: '${selected}',
      //   set: function (term) {
      //     console.log(term);
      //     return this.set('selected', app.data.first());
      //   }
      // },
      partyCount: function () {return this.get('parties').where({srap: false}).length; },
      srapCount: function () {return this.get('parties').where({srap: true}).length; },
      // Filters
      geo_search: function() {return app.filters.displayFor(['region', 'subregion', 'party']);},
      iif_or_plan_filters: function() {return app.filters.select(function(i){return i.get('attribute') == 'iif_or_plan'})},
      plan_filters: function() {return app.filters.select(function(i){return i.get('attribute') == 'iif_plan_start'})},
      gm_supported_filters: function() {return app.filters.select(function(i){return i.get('attribute') == 'gm_supported'})}
    }
  });
}


// 
// Explorer events
// 

function initExplorerEvents (explorer) {
  // // Explorer
  // explorer.on('selectParty', function(event, object){});

  // MapViewSelector Component
  explorer.on('MapViewSelector.toggleFilter', function(event){
    return app.filters.get(event.context.id).toggle('active');
  });
  explorer.on('MapViewSelector.allOn', function(event, type){
    return app.filters.allOn(type);
  });
  explorer.on('MapViewSelector.allOff', function(event, type){
    return app.filters.allOff(type);
  });
  explorer.on('MapViewSelector.changeMapView', function(event, mapViewIndex) {
    this.set('mapView', mapViewIndex);
  });

  explorer.observe('filters.*', function () {
    var query = this.get('filters').prepareFilterQuery(); 
    this.get('parties').resetWithQuery(query);
    return this.get('parties');
  });
  

  return;
}
