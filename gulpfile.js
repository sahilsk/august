var gulp = require('gulp');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename'); 
// Basic usage 
gulp.task('browserify', function() {
    // Single entry point to browserify 
    gulp.src('client/app_client.js')
        .pipe(browserify({
          insertGlobals : true,
          transform: ['babelify'],
          debug : !gulp.env.production
        }))
         .pipe(rename('bundle.js'))
        .pipe(gulp.dest('./public/javascripts'));
});

gulp.task('watch', function(){
 	gulp.watch(["client/app_client.js", "components/*.js"], ['browserify'] );
});