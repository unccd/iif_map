var gulp = require('gulp');
var compress = require('compression');
var browserSync = require('browser-sync').create();


// Task for serving blog with Browsersync
gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: "./"
    },
    middleware: function(req, res, next) {
      var gzip = compress();
      gzip(req, res, next);
    },
    open: false,
  })
  // Reloads page when some of the already built files changed:
  gulp.watch(['*.html', 'js/*'], browserSync.reload);
});

gulp.task('default', ['serve']);