const gulp = require('gulp');
const bulkSass = require('gulp-sass-bulk-import');
const gulpReplace = require('gulp-replace');
const path = require('path');
const spritesmith = require('gulp.spritesmith');

// Fix the wildcard imports of the sass copied from the Sitecore default theme provided in @sxa/Theme.
/// The provided sass which is an updated version of the Sitecore default theme is not valid sass - top-level wildcard imports 
// initially handled by gulp-sass-bulk-import but does not work over multiple levels.
// Fix location of "base/.." and "abstracts/.." folders - must be relative due to new build approach using webpack
gulp.task('fix-defaulttheme-sass-for-webpack', function (done) {
    const srcThemeSass = path.resolve('./node_modules/@sxa/Theme/sass/').replace(/\\/g,'/');
    const destinationThemeSass = path.resolve('./sass/');
    gulp
      .src(path.join(srcThemeSass, '*.scss'))
      .pipe(bulkSass())
      // make @import path relative to sass folder
      .pipe(gulpReplace(srcThemeSass, '.'))
      .pipe(gulp.dest(destinationThemeSass));
  
    // fix "base/.. includes on deeper levels"
    gulp
      .src(path.join(srcThemeSass, '*/*.scss'))
      .pipe(gulpReplace('"base/', '"../base/'))
      .pipe(gulpReplace('"abstracts/', '"../abstracts/'))
      .pipe(gulp.dest(destinationThemeSass));
    
    gulp
      .src(path.join(srcThemeSass, '*/*/*.scss'))
      .pipe(gulpReplace('"base/', '"../../base/'))
      .pipe(gulpReplace('"abstracts/', '"../../abstracts/'))
      .pipe(gulp.dest(destinationThemeSass));
      
    done();    
});

gulp.task('sprite-flag', function(done) {
    let spriteData = gulp.src('images/flags/*.png').pipe(spritesmith({
        imgName: 'sprite-flag.png',
        cssName: '_sprite-flag.scss',
        imgPath: 'images/sprite-flag.png',
        cssFormat: 'scss',
        padding: 10,
        algorithm: 'top-down',
        cssOpts: {
            cssSelector: function (sprite) {
                return '.flags-' + sprite.name;
            }
        },
        cssVarMap: function (sprite) {
            sprite.name = 'flags-' + sprite.name;
        }
    }));
    spriteData.img.pipe(gulp.dest('images'));
    spriteData.css.pipe(gulp.dest('sass/base/sprites'));
    done();
});