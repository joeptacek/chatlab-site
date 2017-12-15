// core
var gulp = require('gulp');
var gutil = require('gulp-util');
// var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
// var debug = require('gulp-debug');

// css
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

// js
var cssnano = require('cssnano');
var uglify = require('gulp-uglify');

// tasks
gulp.task('css', function () {
  var plugins = [
    autoprefixer(),
    cssnano()
  ];
  return gulp.src('_assets/sass/**/*.scss')
    // .pipe(debug({title: 'Debug (css):'}))
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(gulp.dest('_site/assets/css'));
});

gulp.task('js', function () {
  return gulp.src('_assets/js/**/*.js')
    // .pipe(debug({title: 'Debug (js):'}))
    .pipe(uglify())
    .pipe(gulp.dest('_site/assets/js'));
});

gulp.task('assets-build', ['css', 'js'], function (done) {
  done(); // including callback so assets-watch can use assets-build as dependency; good form (?), but possibly unnecessary?
});

// BTW: jekyll build process clobbers everything in _site, but excludes js and css dirs in _site/assets. this is specified in _config.yml (add to separate gulp-specific jekyll config?)
// is it ok to skip adding callback to task?
// removed --watch for now (letting Gulp handle this)
// spawn vs exec: spawn has better log formatting via stdio, also performance possibly better
// jekyll seems more lenient with errors when building with --incremental

gulp.task('jekyll-build', function () {
  spawn('bundle', [
    'exec',
    'jekyll',
    'build',
    '--config',
    '_config.yml,_config-gulp.yml',
    '--incremental'
  ], {stdio: 'inherit'})
});

gulp.task('jekyll-watch', function () {
  spawn('bundle', [
    'exec',
    'jekyll',
    'build',
    '--config',
    '_config.yml,_config-gulp.yml',
    '--incremental', 
    '--watch'
  ], {stdio: 'inherit'})
});

gulp.task('assets-watch', ['assets-build'], function () {
  gulp.watch('_assets/sass/**/*.scss', ['css']);
  gulp.watch('_assets/js/**/*.js', ['js']);
});

// Safe to run jekyll, css, and js concurrently. Jekyll build process clobbers everything in _site, but excludes js and css dirs in _site/assets
gulp.task('build', ['jekyll-build', 'assets-build']);

gulp.task('watch', ['jekyll-watch', 'assets-watch']);

gulp.task('default', ['build']);
