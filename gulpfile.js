// REQUIRE ---------------------------------------------------------------------

// core
var gulp = require('gulp');
var gutil = require('gulp-util'); // deprecated?
var spawn = require('child_process').spawn;
var bs = require('browser-sync').create();
var sourcemaps = require('gulp-sourcemaps');
var gulpif = require('gulp-if');

// var debug = require('gulp-debug');

// css
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');

// js
var uglify = require('gulp-uglify');

// VARIABLES -------------------------------------------------------------------

var child_jk; // needs to be global so able to kill later

var production = false;
var development = !production;

// _config-gulp.yml excludes _assets (for jekyll watch), keeps assets/js and assets/css (so gulp output isn't clobbered)
// _config-gulp-production.yml also excludes _page/demos
var jk_config_dev = '_config.yml,_config-gulp.yml';
var jk_config_prod = jk_config_dev + ',_config-gulp-production.yml';

var jk_command_build = [
  'bundle',
  'exec',
  'jekyll',
  'build'
  // '--incremental', // i don't 100% trust incremental, but it's somewhat faster
  // '-V', // debug mode
];

// create spawn_env object, using the default process environment as prototype...
var spawn_env = Object.create(process.env);

if (production) {
  // ...in production, add this key-value pair to the spawn_env object
  spawn_env.JEKYLL_ENV = 'production';
  jk_command_build.push('--config', jk_config_prod);
} else {
  jk_command_build.push('--config', jk_config_dev);
}

var jk_command_watch = jk_command_build.concat('--watch');

// TASKS -----------------------------------------------------------------------

// build css (development only: sourcemaps; production only: autoprefixer, cssnano)
gulp.task('css', function () {
  var plugins = [
    autoprefixer(),
    cssnano()
  ];
  return gulp.src('_assets/sass/**/*.scss')
    // .pipe(debug({title: 'Debug (css):'})) // debug mode
    .pipe(gulpif(development, sourcemaps.init())) // only in development
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(development, sourcemaps.write())) // only in development
    .pipe(gulpif(production, postcss(plugins))) // only in production
    .pipe(gulp.dest('_site/assets/css'));
});

// build js
gulp.task('js', function () {
  return gulp.src('_assets/js/**/*.js')
    // .pipe(debug({title: 'Debug (js):'})) // debug mode
    .pipe(gulpif(production, uglify())) // only in production
    .pipe(gulp.dest('_site/assets/js'));
});

// build assets
gulp.task('assets-build', ['css', 'js']);

// (build and) watch assets
gulp.task('assets-watch', ['assets-build'], function () {
  gulp.watch('_assets/sass/**/*.scss', ['css']);
  gulp.watch('_assets/js/**/*.js', ['js']);
});

// build jekyll
gulp.task('jekyll-build', function () {
  spawn(jk_command_build[0], jk_command_build.slice(1), {
    stdio: 'inherit',
    env: spawn_env
  });
});

// (build and) watch jekyll
gulp.task('jekyll-watch', function () {
  // spawn initial jekyll, assign to global to kill later
  child_jk = spawn_jk();

  gulp.watch('@(_config.yml|_config-*.yml)', function () {
    // on changes to jekyll config, kill / re-spawn
    gutil.log('Jekyll config updated, rebooting...');
    child_jk.kill();
    child_jk = spawn_jk();
  });

  function spawn_jk () {
    return spawn(jk_command_watch[0], jk_command_watch.slice(1), {
      stdio: 'inherit',
      env: spawn_env
    });
  }
});

// start browsersync development server
gulp.task('bs', function () {
  // maybe quiet bs the hell down?
  bs.init({
    files: '_site/**', // changes are either injected (CSS / img) or cause browser reload
    server: {
      baseDir: '_site',
      routes: {
        '/chatterjee': '_site'
      }
    },
    // logLevel: 'debug', // debug mode
    // reloadDebounce: 2000, // prevents a ton of reloads while jekyll completes initial build (browsersync might miss meaningful changes later on)
    startPath: "/chatterjee",
    notify: false
  });
});

// build everything
gulp.task('build', ['jekyll-build', 'assets-build']);

// (build and) watch everything
gulp.task('watch', ['jekyll-watch', 'assets-watch']);

// (build and) watch everything AND boot development server
gulp.task('serve', ['watch', 'bs']); // might be better to do these async - specifically, wait until jekyll finishes initial build (use hooks?) and THEN serve via browsersync (or else browsersync watches / reloads while jekyll builds)

// default task
gulp.task('default', ['serve']);

// NOTES -----------------------------------------------------------------------

// require var vs const?

// is it necessary to have EVERY task accept a callback / return a stream? yes, when trying to make another task run in series afterwards - but otherwise?

// spawn vs exec: spawn has somewhat better log formatting via stdio, also performance possibly better

// consider preceding dot for globs (explictly reference cwd)
