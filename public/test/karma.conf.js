module.exports = function(config) {
  config.set({

    basePath: '../',

    files: [
      'vendor/angular.js',
      'vendor/*.js',
      'app.js',
      'services/*.js',
      'controllers/*.js',
      'filters/*.js',
      'directives/*.js',
      'test/unit/*.js'
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['PhantomJS'],

    plugins: [
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
      'karma-jasmine'
    ]
  });
};