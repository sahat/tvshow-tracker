angular.module('MyApp')
  .factory('Show', ['$http', function($http) {
      return {
        getShows: function(callback) {
          $http.get('/api/shows').success(function(shows) {
            callback(shows);
          });
        }
      };
    }]);