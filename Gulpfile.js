var gulp = require('gulp');
var browserSync = require('browser-sync').create();

// Static server
gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: "./"
    },
    open: false
  });
  gulp.watch(['*.html', 'js/*', 'css/*'], browserSync.reload);
});

// Default taks
gulp.task('default', ['serve']);