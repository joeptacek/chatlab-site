// REQUIRE ---------------------------------------------------------------------

// core
var gulp = require('gulp');
var gutil = require('gulp-util'); // deprecated! use fancy-log instead (per gulp-util team)
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

var child_jk_watch; // needs to be global so we can kill later

// check process.argv array for "-p" flag; alternatively, for more complicated parsing can use minimist or yargs
var production = false;
if (process.argv.includes("-p")) {
  production = true;
}

// _config-gulp.yml excludes _assets (for jekyll watch), keeps assets/js and assets/css (so gulp output isn't clobbered)
// _config-gulp-production.yml also excludes _page/demos
var jk_config_dev = '_config.yml,_config-gulp.yml';
var jk_config_prod = jk_config_dev + ',_config-gulp-production.yml';

var jk_command_build = [
  'bundle',
  'exec',
  'jekyll',
  'build', // trailing comma is fine
  // '--incremental', // i don't 100% trust incremental (still experimental), but it's somewhat faster
  // '-V' // debug
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

// build css
gulp.task('css', function () {
  var plugins = [
    autoprefixer(),
    cssnano()
  ];
  return gulp.src('_assets/sass/**/*.scss')
    // .pipe(debug({title: 'Debug (css):'})) // debug
    .pipe(gulpif(!production, sourcemaps.init())) // only in development
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(!production, sourcemaps.write())) // only in development
    .pipe(gulpif(production, postcss(plugins))) // only in production
    .pipe(gulp.dest('_site/assets/css'));
});

// build js
gulp.task('js', function () {
  return gulp.src('_assets/js/**/*.js')
    // .pipe(debug({title: 'Debug (js):'})) // debug
    .pipe(gulpif(production, uglify())) // only in production
    .pipe(gulp.dest('_site/assets/js'));
});

// build assets
gulp.task('assets-build', ['css', 'js'], function (cb) {
  // css and js return streams (and run in parallel?) so assets-build will wait until they finish
  cb(); // for assets-watch, deploy
});

// (build and) watch assets
gulp.task('assets-watch', ['assets-build'], function (cb) {
  // assets-build returns callback so assets-watch will wait until it finishes
  gulp.watch('_assets/sass/**/*.scss', ['css']);
  gulp.watch('_assets/js/**/*.js', ['js']);
  cb(); // for watch
});

// build jekyll
gulp.task('jekyll-build', function (cb) {
  child_jk_build = spawn_jk_build();

  child_jk_build.stdout.on('data', function (buff) {
    // send jekyll output to log TODO: also log stderr etc.
    // using console.log() introduces extra newlines, so just write out to main gulp process (need to convert buffer to string)
    process.stdout.write(buff.toString());

    // execute callback when jekyll finishes build; listen for hints on child process stdout
    // apparently `includes` can find a string in a buffer, toString() conversion not necessary
    if (buff.includes("Auto-regeneration: disabled")) {
      cb();
    }
  });

  function spawn_jk_build () {
    return spawn(jk_command_build[0], jk_command_build.slice(1), {
      env: spawn_env
    });
  }
});

// (build and) watch jekyll
gulp.task('jekyll-watch', function (cb) {
  // spawn initial jekyll child process, assign to global to kill later
  child_jk_watch = spawn_jk_watch();

  child_jk_watch.stdout.on('data', function (buff) {
    // send jekyll output to log TODO: also log stderr etc.
    // using console.log() introduces extra newlines, so just write out to main gulp process (need to convert buffer to string)
    process.stdout.write(buff.toString());

    // execute callback when jekyll-watch finishes initial build; listen for hints on child process stdout
    if (buff.includes("Auto-regeneration: enabled")) {
      cb();
    }
  });

  gulp.watch('@(_config.yml|_config-*.yml)', function () {
    // on changes to jekyll config, kill / re-spawn
    gutil.log('Jekyll config updated, rebooting...');
    child_jk_watch.kill();
    child_jk_watch = spawn_jk_watch();
  });

  function spawn_jk_watch () {
    return spawn(jk_command_watch[0], jk_command_watch.slice(1), {
      env: spawn_env
    });
  }
});

// build everything
gulp.task('build', ['assets-build', 'jekyll-build'], function (cb) {
  // assets-build and jekyll-build return callback (and run in parallel?) so build will wait until they finish
  cb(); // for deploy
});

// (build and) watch everything
gulp.task('watch', ['assets-watch', 'jekyll-watch'], function (cb) {
  // assets-watch and jekyll-watch return callback (and run in parallel?) so watch will wait until they finish
  cb(); // for serve
});

gulp.task('serve', ['watch'], function () {
  // watch returns callback so serve will wait until it finishes
  // start browsersync development server (currently no need for separate gulp task, but could turn this into its own function)
  bs.init({
    // maybe quiet bs the hell down?
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
  // currently no need to return callback
});

// build for production and deploy to production server
gulp.task('deploy', ['build'], function () {
  // build returns callback so deploy will wait until it finishes
  // deployment tasks
  production = true;
});

// default task
gulp.task('default', ['serve']);

// NOTES -----------------------------------------------------------------------

// TODO: maybe improve DRYness of spawn_jk_build vs. spawn_jk_watch
// TODO: maybe use named function for stdout.on listeners (DRY), passing hint string
// TODO: task callbacks can accept error objects, look into this?
// TODO: move hard-coded constants (e.g., paths) to separate file
// TODO: clean up quotes (consistent double / single)
// TODO: make deploy task (build with production flag, rsync backup/copy to server; need SSH key)
// TODO: do any / all of this with npm scripts?
// TODO: require var vs const?
// TODO: is it necessary to have EVERY task accept a callback / return a stream? yes, when trying to make another task run in series afterwards - but otherwise?
// TODO: spawn vs exec: spawn has somewhat better log formatting via stdio, also performance possibly better
// TODO: consider preceding dot for globs (explictly reference cwd)
