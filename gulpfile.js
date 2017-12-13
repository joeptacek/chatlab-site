var gulp = require('gulp');
var child = require('child_process');
// var sourcemaps = require('gulp-sourcemaps');
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
    // .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(plugins))
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest('_site/assets/css'));
});

gulp.task('js', function () {
  return gulp.src('_assets/js/**/*.js')
    // .pipe(sourcemaps.init())
    .pipe(uglify())
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest('_site/assets/js'));
});

gulp.task('jekyll', function (done) {
  return child.spawn('bundle', ['exec', 'jekyll', 'build', '--incremental'], {stdio: 'inherit'})
    .on('close', done);
});

gulp.task('build', ['css', 'js']);

gulp.task('watch', [ 'build' ], function () {
  gulp.watch('_assets/sass/**/*.scss', ['css']);
  gulp.watch('_assets/js/**/*.js', ['js']);
  // gulp.watch(['./*.html'], ['jekyll'])
});

gulp.task('default', [ 'build' ]);
