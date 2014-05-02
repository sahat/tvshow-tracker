var gulp = require('gulp');
var sass = require('gulp-sass');
//var csso = require('gulp-csso');
//var uglify = require('gulp-uglify');
//var concat = require('gulp-concat');
var plumber = require('gulp-plumber');

gulp.task('sass', function() {
  gulp.src('public/stylesheets/style.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest('public/stylesheets'));
});

//gulp.task('compress', function() {
//  gulp.src([
//    'scripts/lib/jquery-2.1.0.min.js',
//    'scripts/lib/angular.min.js',
//    'scripts/lib/*.js',
//    'scripts/app.js',
//    'scripts/constants/*.js',
//    'scripts/controllers/*.js',
//    'scripts/directives/*.js',
//    'scripts/services/*.js'
//  ])
//    .pipe(concat('compiled.js'))
//    .pipe(uglify())
//    .pipe(gulp.dest('scripts'));
//});

gulp.task('watch', function() {
  gulp.watch('public/stylesheets/*.scss', ['sass']);
//  gulp.watch(['scripts/**/*.js', '!scripts/compiled.js'], ['compress']);
});

gulp.task('default', ['sass', 'watch']);
