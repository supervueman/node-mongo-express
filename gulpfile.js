/* eslint-disable node/no-unpublished-require */

const gulp = require(`gulp`),
      sass = require(`gulp-sass`),
      autoprefixer = require(`gulp-autoprefixer`),
      cssnano = require(`gulp-cssnano`),
      plumber = require(`gulp-plumber`),
      concat = require(`gulp-concat`),
      uglify = require(`gulp-uglify`);

/* eslint-enable node/no-unpublished-require */

gulp.task(`sass`, () => {
  return gulp
    .src(`dev/sass/**/*.sass`)
    .pipe(plumber())
    .pipe(sass())
    .pipe(
      autoprefixer([`last 15 version`, `>1%`, `ie 8`, `ie 7`], {
        cascade: true
      })
    )
    .pipe(cssnano())
    .pipe(gulp.dest(`public/css`));
});

gulp.task(`js`, () => {
  return gulp
    .src([
      `dev/js/common.js`
    ])
    .pipe(concat(`scripts.min.js`))
    .pipe(uglify())
    .pipe(gulp.dest(`public/js`));
});

gulp.task(`default`, [`sass`, `js`], () => {
  gulp.watch(`dev/sass/**/*.sass`, [`sass`]);
  gulp.watch(`dev/js/common.js`, [`js`]);
});
