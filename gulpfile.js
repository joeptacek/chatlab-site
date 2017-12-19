// core
var gulp = require('gulp');
var gutil = require('gulp-util');
var spawn = require('child_process').spawn;
var bs = require('browser-sync').create();
// var debug = require('gulp-debug');

// css
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');

// js
var uglify = require('gulp-uglify');

// tasks
gulp.task('jekyll-build', function () {
  spawn('bundle', [
    'exec',
    'jekyll',
    'build',
    '--config',
    '_config.yml,_config-gulp.yml',
  ], {stdio: 'inherit'});
});

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

gulp.task('assets-build', ['css', 'js']);

var child_jk; // needs to be global
gulp.task('jekyll-watch', function () {
  // spawn initial jekyll, assign to global so can kill later
  child_jk = spawn_jk();

  gulp.watch('@(_config.yml|_config-*.yml)', function () {
    // on changes to jekyll config, kill / re-spawn
    gutil.log('Jekyll config updated, rebooting...');
    child_jk.kill();
    child_jk = spawn_jk();
  });

  function spawn_jk () {
    return spawn('bundle', [
      'exec',
      'jekyll',
      'build',
      '--config',
      '_config.yml,_config-gulp.yml',
      '--watch'
    ], {stdio: 'inherit'});
  }
});

gulp.task('assets-watch', ['assets-build'], function () {
  gulp.watch('_assets/sass/**/*.scss', ['css']);
  gulp.watch('_assets/js/**/*.js', ['js']);
});

gulp.task('bs', function () {
  bs.init({
    files: '_site/**',
    server: '_site',
  });
});

// safe to run jekyll, css, and js concurrently - jekyll build process clobbers
// everything in _site, but excludes js and css dirs in _site/assets
gulp.task('build', ['jekyll-build', 'assets-build']);
gulp.task('watch', ['jekyll-watch', 'assets-watch']);
gulp.task('serve', ['watch', 'bs']);
gulp.task('default', ['build']);

// require var vs const?

// is it necessary to have EVERY task accept a callback / return a stream? yes,
// when trying to make another task run in series afterwards - but otherwise?

// jekyll build process clobbers everything in _site, but excludes js and css
// dirs in _site/assets (this is specified in _config-gulp.yml)

// spawn vs exec: spawn has better log formatting via stdio, also performance
// possibly better

// jekyll seems more lenient with errors when building with --incremental
