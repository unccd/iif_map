var gulp = require('gulp');
var compress = require('compression');
var browserSync = require('browser-sync').create();

// Static server
gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: "./_site"
    },
    middleware: function(req, res, next) {
      var gzip = compress();
      gzip(req, res, next);
    },
    open: false,

  });
  gulp.watch(['*.html', 'js/*'], browserSync.reload);
});

gulp.task('build', function() {

})

// Default taks
gulp.task('default', ['serve']);