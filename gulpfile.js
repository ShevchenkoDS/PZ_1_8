const {src, dest, parallel, series, watch} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const pipeline = require('readable-stream').pipeline;
const rename = require("gulp-rename");
const del = require('del');


//функція для обробки стилів
const styles = () => {
  return src('./src/scss/**/*.scss')
  .pipe(sass({
    outputStyle: 'expanded'
  }).on('error', sass.logError))
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(cssnano())
  .pipe(dest('./app/css'))
  .pipe(browserSync.stream());
}

//функція переміщення html файлів
const htmlToApp = () => {
  return src('./src/*.html')
  .pipe(dest('./app'))
  .pipe(browserSync.stream());
}

//функція для обробки картинок
const imgToApp = () => {
  return src(['./src/img/**.jpg', './src/img/**.jpeg', './src/img/**.png', './src/img/**.svg'])
    .pipe(imagemin())
    .pipe(dest('./app/img'));
}

//функція обробки JS
const compressJS = () => {
  return src('./src/js/*.js')
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(dest('./app/js'));
}

//функція очистки
const clean = () =>{
  return del('./app/*');
}

const watchFiles = () => {
  browserSync.init({
    server: {
        baseDir: "./app"
    }
  });

  watch('./src/scss/**/*.scss', styles);
  watch('./src/img/**.jpeg'), imgToApp;
  watch('./src/img/**.jpg'), imgToApp;
  watch('./src/img/**.png'), imgToApp;
  watch('./src/*.html', htmlToApp);
  watch('./src/js/**/*.js', compressJS);
}


exports.styles = styles;
exports.htmlToApp = htmlToApp;
exports.imgToApp = imgToApp;
exports.watchFiles = watchFiles;

exports.default = series(clean, compressJS, parallel(htmlToApp, imgToApp), styles, watchFiles);