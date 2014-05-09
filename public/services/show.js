angular.module('MyApp')
  .factory('Show', ['$http', function($http) {
      return {
        getShows: function(callback) {
          $http.get('/api/shows').success(function(shows) {
            callback(shows);
          });
        },
        getShow: function(id, callback) {
          $http.get('/api/shows/' + id).success(function(show) {
            callback(show);
          });
        },
        getShowsByGenre: function(genre) {
          return $http.get('/api/shows?genre=' + genre);
        },
        getShowsByAlphabet: function(character) {
          return $http.get('/api/shows?alphabet=' + character);
        }
      };
    }]);