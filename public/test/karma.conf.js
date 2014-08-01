module.exports = function(config) {
  config.set({

    basePath: '../',

    files: [
      'vendor/*.js',
      'app.js',
      'controllers/*.js',
      'directives/*.js',
      'filters/*.js',
      'services/*.js',
      'test/unit/*.js'
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['Chrome'],

    plugins: [
      'karma-chrome-launcher',
      'karma-jasmine'
    ]
  });
};