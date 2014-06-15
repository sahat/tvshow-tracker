angular.module('MyApp')
  .factory('Subscription', ['$http', function($http) {
    return {
      subscribe: function(show) {
        return $http.post('/api/subscribe', { showId: show._id });
      },
      unsubscribe: function(show) {
        return $http.post('/api/unsubscribe', { showId: show._id });
      }
    };
  }]);