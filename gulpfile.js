// TODO: REFACTOR GULPFILE FOR GULP 4 / NODE 10

// REQUIRE ---------------------------------------------------------------------

// core
var gulp = require('gulp');
var spawn = require('child_process').spawn;
var bs = require('browser-sync').create();
var sourcemaps = require('gulp-sourcemaps'); // TODO: skip?
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

//// args ----------------------------------------------------------------------
var args = process.argv;

// for more complicated parsing can use minimist or yargs
var production = ['--production', 'deploy'].some(target => args.includes(target));
var development = !(production);

//// jekyll stuff --------------------------------------------------------------

var child_jk_watch; // needs to be global so we can kill later

var jk_config_gulp = '_config-gulp.yml'; // _config-gulp.yml excludes _assets (for jekyll watch), keeps assets/js and assets/css (so gulp output isn't clobbered)
var jk_config_gulp_production = '_config-gulp-production.yml'; // _config-gulp-production.yml excludes _page/demos; enables analytics; sets baseurl to /chatterjee

var jk_build_command = [
  'bundle',
  'exec',
  'jekyll',
  'build', // trailing comma is fine
  // '--incremental', // i don't 100% trust incremental (still experimental), but it's somewhat faster
  // '-V' // debug
];

if (production) {
  jk_build_command.push('--config', jk_config_gulp_production);
} else {
  jk_build_command.push('--config', jk_config_gulp);
}

var jk_watch_command = jk_build_command.concat('--watch');

// TASKS -----------------------------------------------------------------------

// build css -------------------------------------------------------------------
gulp.task('css', function () {
  var plugins = [
    autoprefixer(), // consider playing with this (currently, not prefixing flexbox; consider setting browserslist key via package.json)
    cssnano()
  ];
  return gulp.src('_assets/sass/**/*.scss')
    // .pipe(debug({title: 'Debug (css):'})) // debug
    .pipe(gulpif(development, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(development, sourcemaps.write()))
    .pipe(gulpif(!(development), postcss(plugins)))
    .pipe(gulp.dest('_site/assets/css'));
});

// build js --------------------------------------------------------------------
gulp.task('js', function () {
  return gulp.src('_assets/js/**/*.js')
    // .pipe(debug({title: 'Debug (js):'})) // debug
    .pipe(gulpif(!(development), uglify()))
    .pipe(gulp.dest('_site/assets/js'));
});

// build assets ----------------------------------------------------------------
gulp.task('assets-build', ['css', 'js'], function (cb) {
  // css and js return streams (and run in parallel?) so assets-build will wait until they finish
  cb(); // for assets-watch, build, deploy
});

// (build and) watch assets ----------------------------------------------------
gulp.task('assets-watch', ['assets-build'], function (cb) {
  // assets-build returns callback so assets-watch will wait until it finishes
  gulp.watch('_assets/sass/**/*.scss', ['css']);
  gulp.watch('_assets/js/**/*.js', ['js']);
  cb(); // for watch
});

// build jekyll ----------------------------------------------------------------
gulp.task('jekyll-build', function (cb) {
  child_jk_build = spawn_jk_build();

  child_jk_build.stderr.on('data', function (buff) {
    process.stderr.write(buff.toString());
  });

  child_jk_build.stdout.on('data', function (buff) {
    // send jekyll output to log TODO: also log stderr etc.
    // using console.log() introduces extra newlines, so just write out to main gulp process (need to convert buffer to string)
    process.stdout.write(buff.toString());

    // execute callback when jekyll finishes build; listen for hints on child process stdout
    // apparently `includes` can find a string in a buffer, toString() conversion not necessary
    if (buff.includes("Auto-regeneration: disabled")) {
      cb(); // for build
    }
  });

  // turn this into arrow expression, move up to child_jk_build variable assignment
  function spawn_jk_build () {
    return spawn(jk_build_command[0], jk_build_command.slice(1));
  }
});

// (build and) watch jekyll ----------------------------------------------------
gulp.task('jekyll-watch', function (cb) {
  // spawn initial jekyll child process, assign to global to kill later
  child_jk_watch = spawn_jk_watch();

  child_jk_watch.stderr.on('data', function (buff) {
    process.stderr.write(buff.toString());
  });

  child_jk_watch.stdout.on('data', function (buff) {
    // event listener for INITIAL Jekyll child process (killed / respawned Jekyll gets its own listener, below)

    // send jekyll output to log TODO: also log stderr etc.
    // using console.log() introduces extra newlines, so just write out to main gulp process (need to convert buffer to string)
    process.stdout.write(buff.toString());

    // execute callback when jekyll-watch finishes initial build; listen for hints on child process stdout
    if (buff.includes("Auto-regeneration: enabled")) {
      // assumes (correctly?) that Jekyll will send this output only once for THIS child process (multiple callbacks cause errors); if Jekyll is killed / respawned, it might send this output again but THIS event listener won't hear it
      cb(); // for watch
    }
  });

  gulp.watch('@(_config.yml|_config-*.yml)', function (event) {
    // on changes to jekyll config, kill / re-spawn

    if (event.type === 'changed') {
      // restricting to change events; otherwise on the very first build, this watch object will respond to files being *added* to _site and _site/demos (sort of unclear why not just watching config files), and then unecessarily kill / respawn Jekyll, and also occasionally screw up the existing event listener / callback
      console.log('Jekyll config updated, rebooting...');
      child_jk_watch.kill();
      child_jk_watch = spawn_jk_watch();

      child_jk_watch.stderr.on('data', function (buff) {
        process.stderr.write(buff.toString());
      })

      child_jk_watch.stdout.on('data', function (buff) {
        // event listener for respawned Jekyll
        process.stdout.write(buff.toString());
      });
    }
  });

  // turn this into arrow expression, move up to child_jk_watch variable assignment(s)
  function spawn_jk_watch () {
    return spawn(jk_watch_command[0], jk_watch_command.slice(1));
  }
});

// MAIN CLI TASKS //////////////////////////////////////////////////////////////

// build everything ------------------------------------------------------------
gulp.task('build', ['assets-build', 'jekyll-build'], function (cb) {
  // assets-build and jekyll-build return callback (and run in parallel?) so build will wait until they finish
  cb(); // for deploy
});

// (build and) watch everything ------------------------------------------------
gulp.task('watch', ['assets-watch', 'jekyll-watch'], function (cb) {
  // assets-watch and jekyll-watch return callback (and run in parallel?) so watch will wait until they finish
  cb(); // for serve
});

// (watch everything and) serve site -------------------------------------------
gulp.task('serve', ['watch'], function () {
  // watch returns callback so serve will wait until it finishes
  // start browsersync development server (currently no need for separate gulp task, but could turn this into its own function)
  if (production) {
    bs.init({
      files: '_site/**', // changes are either injected (CSS / img) or cause browser reload
      server: {
        baseDir: '_site',
        routes: {
          '/chatterjee': '_site' // on the UPenn server, / refers to ccn.upenn.edu, but chatlab-site assets are all at ccn.upenn.edu/chatterjee, so Jekyll prepends all URLs with /chatterjee/; because assets are actually at / here, need to have browsersync reroute requests there
        }
      },
      // logLevel: 'debug', // debug mode
      // reloadDebounce: 2000, // prevents a ton of reloads while jekyll completes initial build (browsersync might miss meaningful changes later on)
      startPath: "/chatterjee",
      notify: false
    });
  } else {
    bs.init({
      files: '_site/**', // changes are either injected (CSS / img) or cause browser reload
      server: '_site',
      // logLevel: 'debug', // debug mode
      // reloadDebounce: 2000, // prevents a ton of reloads while jekyll completes initial build (browsersync might miss meaningful changes later on)
      notify: false
    });
  }
  // currently no need to return callback
});

// (build for production and) deploy to production server ----------------------
gulp.task('deploy', ['build'], function () {
  // build returns callback so deploy will wait until it finishes deployment tasks

  // when deploy is called via CLI `gulp deploy`, production will be set to true for the build task
  // if deploy is ever called from another CLI task (e.g., as dependency), production would NOT be set to true for build; could (re-)enable production by adding the other task to the array of CLI commands requiring production
  // could also use `this.seq` to set conditionally set production within all the lowest-level dependencies (e.g., css, js, jekyll-build), based on whether the Gulp task seq array (might be gulp v3 specific) includes certain tasks (e.g., deploy); avoids needing to maintain a `prod_args` list, but seems messier; in gulp v4, could do something like this using gulp.tree

  var rsync_command = [
    'rsync',
    '-ahzP',
    '--delete',
    './_site/',
    'jptacek@hosting.med.upenn.edu:/home/ccn/web_docs/chatterjee'
  ];

  spawn(rsync_command[0], rsync_command.slice(1), { stdio: 'inherit' });
});

// default task
gulp.task('default', ['serve']);

// NOTES -----------------------------------------------------------------------

// TODO: cache invalidation
// TODO: image optimization
// TODO: maybe improve DRYness of spawn_jk_build vs. spawn_jk_watch
// TODO: maybe use named function for stdout.on listeners (DRY), passing hint string
// TODO: task callbacks can accept error objects, look into this?
// TODO: move hard-coded constants (e.g., paths) to separate file
// TODO: clean up quotes (consistent double / single)
// TODO: do any / all of this with npm scripts?
// TODO: require var vs const?
// TODO: is it necessary to have EVERY task accept a callback / return a stream? yes, when trying to make another task run in series afterwards - but otherwise? (yes in gulp 4?)
// TODO: spawn vs exec: spawn has somewhat better log formatting via stdio, also performance possibly better
// TODO: consider preceding dot for globs (explictly reference cwd)
