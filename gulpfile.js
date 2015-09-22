var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var webpackConfig = require('./webpack.config.js');
var through = require('through2');
require('./node_modules/zland-core/gulp/modulegulpfile')(__dirname, webpackConfig);

gulp.task('default', ['zland-assets'], function() {
  gulp.start('serve');
});


gulp.task('test', function() {
  var root = __dirname;
  return gulp.src(
    [root + "/**/*.js", root + "/**/*.jsx", "!node_modules/**/*", '!gulp/**/*', '!' + root + '/node_modules']
  )
  .pipe(
    through.obj(function(file, enc, cb) {
      console.log(file.path);
      cb(null, file);
    })
  )
  .pipe($.markdox({
    template: root + '/node_modules/gulp-zlanddoc/lib/markdoxCustomTemplate.ejs',
    formatter: $.zlanddoc.markdoxCustomFormatter.format
  }))
  .pipe($.rename(function (path) {
    path.extname = path.extname + ".md";
  }))
  .pipe(gulp.dest("./"));
});
