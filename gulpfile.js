var gulp = require('gulp');
var spawn = require('child_process').spawn;
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

gulp.task('jekyll', function (done) {
  return spawn('bundle', ['exec', 'jekyll', 'build', '--incremental'], {stdio: 'inherit'})
    .on('close', done);
});

gulp.task('build', ['css', 'js']);

gulp.task('watch', [ 'build' ], function () {
  gulp.watch('_assets/sass/**/*.scss', ['css']);
  gulp.watch('_assets/js/**/*.js', ['js']);
  // gulp.watch(['./*.html'], ['jekyll'])
});

gulp.task('default', [ 'build' ]);
