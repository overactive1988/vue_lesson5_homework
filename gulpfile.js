const fs = require('fs'),
  gulp = require('gulp'),
  postcss = require('gulp-postcss'),
  sourcemaps = require('gulp-sourcemaps'),
  browser = require('browser-sync'),
  rename = require('gulp-rename'),
  plumber = require('gulp-plumber'),
  cache = require('gulp-cached'),
  changed = require('gulp-changed'),
  uglify = require('gulp-uglify'),
  path = require('path'),
  cssmqpacker = require('css-mqpacker'),
  cssnano = require('cssnano'),
  discardComments = require('postcss-discard-comments'),
  postcssPresetEnv = require('postcss-preset-env'),
  cssimport = require('postcss-import'),
  pug = require('gulp-pug'),
  iconfont = require('gulp-iconfont'),
  svgmin = require('gulp-svgmin'),
  consolidate = require('gulp-consolidate'),
  colorFunction = require('postcss-color-function'),
  postcssMixins = require('postcss-mixins')

// const gulpWebpack = require("gulp-webpack");
// const webpack = require("webpack");

var filePath = {
  base: 'htdocs/',
  html: 'htdocs/',
  css: 'htdocs/',
  js: 'htdocs/',
  src: {
    css: ['src/css/**/*.css', '!src/css/**/_*.css'],
    watchcss: ['src/css/**/*.css', 'src/css/**/*.css'],
    pug: ['src/pug/**/*.pug', '!src/pug/**/_*.pug'],
    watchpug: ['src/pug/**/*.pug'],
    js: ['src/js/**/*.js', '!src/js/**/_*.js'],
    watchjs: ['src/js/**/*.js', 'src/js/**/*.js'],
  },
}

gulp.task('server', function () {
  browser({
    //open: 'external',
    port: 9014,
    server: {
      baseDir: filePath.base,
    },
    startPath: '/',
    ghostMode: false,
  })
})

var autoprefixerBrowsers = [
  'last 3 versions',
  'ie >= 10',
  'iOS >= 8',
  'Android >= 4',
]
// var autoprefixerBrowsers = ['last 3 versions', 'ie 8'];

var postcssPresetEnvOption = {
  importFrom: 'src/css/_global_vars.css',
  stage: 0,
  browsers: autoprefixerBrowsers,
  preserve: false,
}

gulp.task('pcss', function () {
  return (
    gulp
      .src(filePath.src.css)
      .pipe(plumber())
      //.pipe(changed(filePath.css, {extension: '.css'}))
      .pipe(sourcemaps.init())
      .pipe(
        rename({
          extname: '.css',
        })
      )
      .pipe(
        postcss([
          cssimport(),
          postcssMixins(),
          postcssPresetEnv(postcssPresetEnvOption),
          colorFunction({
            preserveCustomProps: true,
          }),
          cssmqpacker(),
          discardComments({
            removeAll: true,
          }),
        ])
      )
      .pipe(gulp.dest(filePath.css))
      .pipe(
        postcss([
          cssnano({
            zindex: false,
          }),
        ])
      )
      .pipe(
        rename({
          suffix: '.min',
        })
      )
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(filePath.css))
  )
})

gulp.task('pcss-production', function () {
  return (
    gulp
      .src(filePath.src.css)
      .pipe(plumber())
      //.pipe(changed(filePath.css, {extension: '.css'}))
      .pipe(
        rename({
          extname: '.css',
        })
      )
      .pipe(
        postcss([
          cssimport(),
          postcssMixins(),
          postcssPresetEnv(postcssPresetEnvOption),
          colorFunction({
            preserveCustomProps: true,
          }),
          cssmqpacker(),
          discardComments({
            removeAll: true,
          }),
        ])
      )
      .pipe(gulp.dest(filePath.css))
      .pipe(
        postcss([
          cssnano({
            zindex: false,
          }),
        ])
      )
      .pipe(
        rename({
          suffix: '.min',
        })
      )
      .pipe(gulp.dest(filePath.css))
  )
})

gulp.task('pug', function () {
  return gulp
    .src(filePath.src.pug)
    .pipe(plumber())
    .pipe(
      changed(filePath.html, {
        extension: '.html',
      })
    )
    .pipe(
      pug({
        pretty: true,
        basedir: 'src/pug/',
      })
    )
    .pipe(gulp.dest(filePath.html))
})
gulp.task('pug-all', function () {
  return gulp
    .src(filePath.src.pug)
    .pipe(plumber())
    .pipe(
      pug({
        pretty: true,
        basedir: 'src/pug/',
      })
    )
    .pipe(gulp.dest(filePath.html))
})

gulp.task('iconfont', function () {
  var runTimestamp = Math.round(Date.now() / 1000)
  var fontName = 'anagroup-icons'

  var lastUnicode = 0xea01 //59905

  // Read source directory and sort by name
  var files = fs.readdirSync('src/icons/svg')

  // Filter files with containing unicode value
  // and set last unicode
  files.forEach(function (file) {
    var basename = path.basename(file)
    var matches = basename.match(/^(?:((?:u[0-9a-f]{4,6},?)+)\-)?(.+)\.svg$/i)
    var currentCode = -1

    if (matches && matches[1]) {
      currentCode = parseInt(matches[1].split('u')[1], 16)
    }

    if (currentCode >= lastUnicode) {
      lastUnicode = ++currentCode
    }
  })

  return (
    gulp
      .src('src/icons/svg/*.svg')
      .pipe(plumber())
      //.pipe(svgmin())
      .pipe(
        iconfont({
          fontName: fontName,
          formats: ['ttf', 'eot', 'woff', 'svg'],
          normalize: true,
          // startUnicode: 0xF001,
          fontHeight: 500,
          timestamp: runTimestamp,
          prependUnicode: true,
          startUnicode: lastUnicode, // Set startUnicode option to determined unicode from filenames
        })
      )
      .on('glyphs', function (glyphs, options) {
        var options = {
          className: fontName,
          fontName: fontName,
          fontPath: '../fonts/',
          glyphs: glyphs.map(function (glyph) {
            return {
              name: glyph.name,
              codepoint: glyph.unicode[0].charCodeAt(0),
            }
          }),
        }

        // CSS
        gulp
          .src('src/icons/templates/template.css')
          .pipe(plumber())
          .pipe(consolidate('lodash', options))
          .pipe(
            rename({
              basename: fontName,
            })
          )
          .pipe(gulp.dest('src/icons/css'))

        // フォント一覧 HTML
        gulp
          .src('src/icons/templates/template.html')
          .pipe(plumber())
          .pipe(consolidate('lodash', options))
          .pipe(
            rename({
              basename: 'icon-sample',
            })
          )
          .pipe(gulp.dest('src/icons/html'))
      })
      .pipe(gulp.dest('src/icons/fonts'))
  )
})

/*
gulp.task("gulpWebpack", () => {
  gulp
    .src(SRC + "js/app.js")
    .pipe(
      gulpWebpack({
        watch: true,
        output: {
          filename: "app.js"
        },
        plugins: [
          // 圧縮用の記述
          new webpack.optimize.UglifyJsPlugin()
        ],
        module: {
          loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            query: {
              presets: ["es2015"]
            }
          }]
        }
      })
    )
    .pipe(gulp.dest(PUBLIC + "common/js/"))
    .pipe(browser.reload({
      stream: true
    }));
});
*/

/*
gulp.task("js", function () {
  return gulp
    .src(filePath.src.js)
    .pipe(plumber())
    .pipe(gulp.dest(filePath.js));
});
*/

gulp.task('watch', function () {
  gulp.watch(filePath.src.watchcss, gulp.task('pcss-production'))
  gulp.watch(filePath.src.watchpug, gulp.task('pug'))
  // gulp.watch(filePath.src.watchjs, gulp.task("js"));
})

gulp.task('default', gulp.parallel('server', 'watch'))
