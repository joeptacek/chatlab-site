var gulp = require('gulp');
var uglify = require('gulp-uglify');

gulp.task('js', function () {
  return gulp.src('_assets/js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('_site/assets/js'))
});

gulp.task('default', [ 'js' ]);
