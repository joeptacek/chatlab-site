var gulp = require('gulp');
var exec = require('child_process').exec;
// var spawn = require('child_process').spawn;
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var uglify = require('gulp-uglify');

gulp.task('css', function () {
  var plugins = [
    autoprefixer(),
    cssnano()
  ];
  return gulp.src('_assets/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(gulp.dest('_site/assets/css'));
});

gulp.task('js', function () {
  return gulp.src('_assets/js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('_site/assets/js'));
});

// EXEC NO WATCH
// gulp.task('jekyll', function () {
//   exec('bundle exec jekyll build --incremental');
// });
//
// SPAWN NO WATCH
// gulp.task('jekyll', function () {
//   spawn('bundle', ['exec', 'jekyll', 'build', '--incremental']);
// });
//
// EXEC WATCH
// gulp.task('jekyll', function () {
//   exec('bundle exec jekyll build --incremental --watch');
// });
//
// SPAWN WATCH
// gulp.task('jekyll', function () {
//   spawn('bundle', ['exec', 'jekyll', 'build', '--incremental', '--watch']);
// });
//
// EXEC NO WATCH WITH CB
gulp.task('jekyll', function (cb) {
  // jekyll build process clobbers everything in _site, but excludes js and css dirs in _site/assets. this is specified in _config.yml (add to separate gulp-specific jekyll config?)
  exec('bundle exec jekyll build --incremental', function (err) {
    if (err) return cb(err); // return error
    cb(); // finished task
  });
});
//
// SPAWN WATCH WITH LOGGING
// gulp.task('jekyll', function () {
//   var child = spawn('bundle', ['exec', 'jekyll', 'build', '--incremental', '--watch'])
//
//   child.stdout.on('data', (data) => {
//     console.log(`stdout: ${data}`);
//   });
//
//   child.stderr.on('data', (data) => {
//     console.log(`stderr: ${data}`);
//   });
// });

gulp.task('watcher', function () {
  gulp.watch('_assets/sass/**/*.scss', ['css']);
  gulp.watch('_assets/js/**/*.js', ['js']);

  // jekyll stuff (alternatively, handled by jekyll build --watch)
  gulp.watch([
    '**/*.+(html|md|markdown|MD)',
    '!_site/**',
    '_data/**/*.+(yml|yaml|csv|json)',
    '_config.yml',
    'favicon*'
  ], ['jekyll']);
});

// Safe to run jekyll, css, and js concurrently. Jekyll build process clobbers everything in _site, but excludes js and css dirs in _site/assets
gulp.task('build', ['jekyll', 'css', 'js']);

gulp.task('watch', ['build', 'watcher']);

gulp.task('default', ['build']);
