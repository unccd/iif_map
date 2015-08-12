$.getJSON('data/combined.json', function(data){
  console.dir(data); 
  doSummary(data);
  return doFilters(data);
})

function doSummary(data) {
  new Ractive({
    el: '.summary',
    template: '#summary',
    data: { countries: data }
  });
}

function doFilters(data) {
  new Ractive({
    el: '.filters',
    template: '#filters',
    data: { countries: data }
  });
}