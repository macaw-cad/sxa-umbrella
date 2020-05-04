module.exports = {
  // Specify all MediaLibrary files for upload AND distribution
  mediaLibraryUploadAndDistributionGlob: [
    '../Media Library/Base Themes/**',
    '!../Media Library/Base Themes/**/src/**',      // never include something from the src folder,
    '../Media Library/Extension Themes/**',
    '!../Media Library/Extension Themes/**/src/**', // never include something from the src folder,
    '../Media Library/Themes/**/*',
    '!../Media Library/Themes/**/src/**',           // never include something from the src folder,
    '!../Media Library/Themes/**/images/flags/**',  // Skip the flags folder when a fixed legacy theme is used
  ],

  // Specify all MediaLibrary files for upload only, will NOT be part of distribution
  // This can be useful when for example images in Media Library/Project are managed by front-end dev in code
  mediaLibraryUploadOnlyGlob: [
  ],

  // Specify all MediaLibrary files to include for cleaning
  mediaLibraryCleanGlob: [
    '../Media Library/Base Themes/**/scripts/**',
    '../Media Library/Base Themes/**/styles/**',
    '!../Media Library/Base Themes/**/src/**',         // never clean something from the src folder,
    '../Media Library/Extension Themes/**/scripts/**',
    '../Media Library/Extension Themes/**/styles/**',
    '!../Media Library/Extension Themes/**/src/**',    // never clean something from the src folder,
    '../Media Library/Themes/**/scripts/**',
    '../Media Library/Themes/**/styles/**',
    '!../Media Library/Themes/**/src/**',              // never clean something from the src folder,
  ],

  // The "limiter.schedule()" functionality of the NPM package Bottleneck (https://www.npmjs.com/package/bottleneck)
  // is used to handle file changes and requests to the Sitecore API.  Play with this configuration to 
  // optimize for your situation. 
  bottleneckConfig: {
    maxConcurrent: 5,
    minTime: 100
  },

  // Enable to see more information on what happens
  verbose: false
};