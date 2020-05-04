"use strict";

const fs = require('fs');
const path = require('path');
const del = require('del');
const through = require('through2');
const gulp = require('gulp');
const Bottleneck = require('Bottleneck');

const fileActionResolver = require('./util/fileActionResolver');

// We are in the tools subfolder, set rootPath to root where package.json lives
global.rootPath = path.resolve(path.join(__dirname, '..'));

const serverAndUserConfig = JSON.parse(fs.readFileSync(path.join(global.rootPath, 'config/config.json')));

const gulpConfig = require('../config/gulp.config.js');

const cleanGlob = [
  ...gulpConfig.mediaLibraryCleanGlob,
];

const fullDeployGlob = [
  ...gulpConfig.mediaLibraryUploadAndDistributionGlob,
  ...gulpConfig.mediaLibraryUploadOnlyGlob,
  '../Rendering Variants/**/-/scriban/metadata.json', // Scriban files imported per directory - specifying metadata.json is enough
];

const watchGlob = [
  ...gulpConfig.mediaLibraryUploadAndDistributionGlob,
  ...gulpConfig.mediaLibraryUploadOnlyGlob,
  '../Rendering Variants/**/-/scriban/metadata.json', 
  '../Rendering Variants/**/-/scriban/**/*.scriban',
];

const copyToDistGlob = [
  ...gulpConfig.mediaLibraryUploadAndDistributionGlob,
];

const context = {
  server: serverAndUserConfig.server,
  user: { ...serverAndUserConfig.user },
  limiter: new Bottleneck(gulpConfig.bottleneckConfig),
  verbose: gulpConfig.verbose
}

const clean = done => {
  del.sync(cleanGlob, { force: true });
  done();
}

const fullDeploy = async done => {
  let fileList = [];
  gulp
    .src(fullDeployGlob, {
      strict: true,
      silent: false
    })
    .pipe(through.obj(function (file, enc, cb) {
      fileList.push(file.path);
      cb(null);
  }))
  .pipe(gulp.dest('./temp/'))
  .on ('end', function () {
      fileList.forEach(filePath => {
        if (fs.lstatSync(filePath).isFile()) {
            if (context.verbose) {
              console.log(`Processing file '${filePath.replace(global.rootPath + '\\', '')}'`);
            }
            fileActionResolver('change', filePath, context);
        }
      });
  });
  console.log(`Full deployment on server ${serverAndUserConfig.server}`.yellow);
  done();
}

const watch = () => {
  console.log(`Preparing watch mode for server ${serverAndUserConfig.server}`.yellow);
  gulp.watch(watchGlob, {
    delay: 500,
  }).on('all', (fileEvent, filePath) => {
    if (context.verbose) {
      console.log(`Changed file [${fileEvent}] '${path.resolve(__dirname, filePath).replace(global.rootPath + '\\', '')}'`);
    }
    fileActionResolver(fileEvent, filePath, context);
  });
}

const copyToDist = (done) => {
  gulp
    .src(copyToDistGlob)
    .pipe(gulp.dest('../dist'));
  done();
}

// Exported Gulp tasks
exports.clean = clean;
exports.fullDeploy = fullDeploy;
exports.watch = watch;
exports.copyToDist = copyToDist;