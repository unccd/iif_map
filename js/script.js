window.app || (window.app = {});

// 
// App launch
// 
// 
$.getJSON('data/countries.json', function(countries) {
  app.countries = new Backbone.Collection(countries);
  // TODO: Remove externally-loaded json - bootstrap it all
  $.getJSON('data/iif_status.json', function(parties) {

    // Get Filters info and create 2 related Collections
    $.getJSON('admin_scripts/querious/iif_status_def.json', function(filtersJSON) {

      // Init Ractive decorators
      Ractive.decorators.chosen.type.geoSearch = function(node) {
        return {
          width: '100%'
        }
      };

      // Backbone Collection for filtering
      app.parties = new Parties(parties);


      // Use just the attributes for now - might use 'Views' later
      var filterFacets = filtersJSON.attributes;

      // Create FilterDefs by removing options from each attribute
      var filterDefObjects = _.map(filterFacets, function(facet) {
        return _.omit(facet, 'options')
      })
      var filterDefs = new FilterDefs(filterDefObjects);


      // Create FilterOptions by copying properties from the attribute 
      // to each of its options
      filterOptions = _.chain(filterFacets).map(function(filter) {
        
        var attribute = filter.name;

        // Add countries if needed
        if (filter.type == 'country') {
          // Set value and title on options
          var valueField = filter.value_field;
          var titleField = filter.title_field;

          filter.options = _.map(countries, function(country) {
            country.value = country[valueField];
            country.title = country[titleField];
            return country;
          });

          console.debug('Missing Country records for', _.select(app.parties.pluck('party'), function(i){return app.countries.findWhere({short_name: i}) == undefined}));
        }

        return _.map(filter.options, function(option) {
          // Infer value from title if requested - assumes snake case
          if (filter.value_from_title != undefined) {
            var title = option.title;
            // snake_case conversion
            option.value = title.replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
          };

          option.attribute = attribute;
          option.id = attribute + ':' + option.value;
          option.active = true;

          return option;
        });

      }).flatten().value();

      app.filters = new FilterOptions(filterOptions, {collectionToFilter: app.parties});
      app.filters.filterDefs = filterDefs;

      var views = filtersJSON.views;

      // Create Ractive view containing all components
      app.explorer = initExplorer(app.parties, app.filters, views);

      // jVectormap map, binding the Ractive view
      app.map = initMap(app.explorer);

    });
  });
});