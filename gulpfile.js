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

// BTW: jekyll build process clobbers everything in _site, but excludes js and css dirs in _site/assets. this is specified in _config.yml (add to separate gulp-specific jekyll config?)
// is it ok to skip adding callback to task?
// removed --watch for now (letting Gulp handle this)
// spawn vs exec: spawn has better log formatting via stdio, also performance possibly better
// jekyll seems more lenient with errors when building with --incremental

// EXEC (TASK WITH NO CALLBACK)
// gulp.task('jekyll', function () {
//   exec('bundle exec jekyll build --incremental');
// });

// SPAWN (TASK WITH NO CALLBACK)
// gulp.task('jekyll', function () {
//   spawn('bundle', ['exec', 'jekyll', 'build', '--incremental']);
// });

// EXEC WITH LOGGING VIA CALLBACK (TASK WITH NO CALLBACK)
// ...

// SPAWN WITH LOGGING VIA INHERITED STDIO (TASK WITH NO CALLBACK)
gulp.task('jekyll', function () {
  spawn('bundle', ['exec', 'jekyll', 'build', '--incremental'], {stdio: 'inherit'})
});

// EXEC WITH LOGGING VIA CALLBACK (TASK WITH CALLBACK)
// gulp.task('jekyll', function (done) {
//   exec('bundle exec jekyll build --incremental', function (error, stdout, stderr) {
//     if (error) {
//         gutil.log('Jekyll: ', error);
//         return;
//     }
//     gutil.log('Jekyll: ', stdout);
//     gutil.log('Jekyll: ', stderr);
//     done();
//   });
// });

// SPAWN WITH LOGGING VIA INHERITED STDIO (TASK WITH CALLBACK)
// gulp.task('jekyll', function (done) {
//   spawn('bundle', ['exec', 'jekyll', 'build', '--incremental'], {stdio: 'inherit'})
//     .on('close', done);
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
