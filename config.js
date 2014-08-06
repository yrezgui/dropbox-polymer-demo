var config = module.exports = {};

config.path = {
  build:          './www',
  styles:         ['./src/**/*.less'],
  scripts:        ['./src/**/*.js'],
  configScripts:  ['./src/**/*.cfg'],
  views:          ['./src/**/*.jade', './src/**/*.html'],
  fonts:          ['./src/fonts/**/*'],
  images:         ['./src/images/**/*'],
  manifest:       ['./src/manifest.webapp']
};