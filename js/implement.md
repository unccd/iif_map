# Features

Need 3 different maps
Need to keep geo and status filters independently manageable 
Need to add an accordion
Need to add a geo-search box


# Filters and State

Have a PartiesCollection and a FiltersCollection.
FiltersCollection contains FilterModels which are carefully defined to form queries on PartiesCollection.
FiltersCollection has a `_prepareQueries` method which converts it into a set of queries to apply to the PartiesCollection.
User can set/unset the 'active' attribute on FilterModels.
Observe changes to the FiltersCollection, and reactively update the PartiesCollection by calling `resetWithQuery` and passing the FiltersCollection.