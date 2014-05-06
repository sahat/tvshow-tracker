angular.module('MyApp')
  .factory('Show', ['$http', function($http) {
      return {
        getShows: function(callback) {
          $http.get('/api/shows').success(function(shows) {
            callback(shows);
          });
        },
        getShow: function(id, callback) {
          console.log(id);
          $http.get('/api/shows/' + id).success(function(show) {
            callback(show);
          });
        }
      };
    }]);