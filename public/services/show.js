angular.module('MyApp')
  .factory('Show', function($resource) {
    return $resource('/api/shows/:_id');
  });