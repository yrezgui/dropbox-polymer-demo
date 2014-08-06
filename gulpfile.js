var config      = require('./config.js');
var gulp        = require('gulp');
var clean       = require('gulp-clean');
var less        = require('gulp-less');
var jade        = require('gulp-jade');
var es          = require('event-stream');
var path        = require('path');
var runSequence = require('run-sequence');
var _           = require('lodash');
var template    = require('gulp-template');

var assetsMap = {};

function changeFolder(subfolder) {
  return es.through(function process(data) {
    var finalpath = path.relative(data.base, data.path);
    finalpath = path.join(subfolder, finalpath);

    data.path = path.join('/tmp', finalpath);
    data.base = '/tmp/';
    this.emit('data', data);
  });
}

function updateAssetsMap(type) {
  if(!assetsMap[type]) {
    assetsMap[type] = [];
  }

  return es.mapSync(function process(data) {
    var file = data.path.split(data.base)[1];

    if(assetsMap[type].indexOf(file) === -1) {
      assetsMap[type].push(file);
    }

    return data;
  });
}

gulp.task('clean', function cleanTask() {
  return gulp.src(config.path.build, {read: false})
             .pipe(clean());
});

gulp.task('scripts', function scriptsTask() {
  return gulp.src(config.path.scripts)
             .pipe(gulp.dest(config.path.build));
});

gulp.task('images', function imagesTask() {
  return es.concat(
    gulp.src(config.path.images).pipe(changeFolder('img')),
    gulp.src(config.vendor.images).pipe(changeFolder('vendor'))

  ).pipe(gulp.dest(config.path.build));
});

function processViews() {
  return es.concat(
    gulp.src('src/**/*.html'),
    gulp.src('src/**/*.jade')
        .pipe(jade({pretty: true, locals: {assets: assetsMap}}))

  ).pipe(gulp.dest(config.path.build));
}

gulp.task('views', function viewsTask(callback) {

  return processViews();
});

gulp.task('vendor', function viewsTask(callback) {
  return gulp.src('bower_components/**/*')
             .pipe(changeFolder('vendor'))
             .pipe(gulp.dest(config.path.build));
});

gulp.task('build', function buildTask(callback) {
  return runSequence(
    'clean',
    ['vendor', 'views', 'images', 'scripts'],
    callback
  );
});

gulp.task('watch', ['build'], function watchTask(callback){

  console.log('watching...');

  gulp.watch(config.path.images,    ['images']);
  gulp.watch(config.path.scripts,     ['scripts']);
  gulp.watch(config.path.views,     ['views']);
});

gulp.task('default', ['watch']);