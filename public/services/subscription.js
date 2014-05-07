angular.module('MyApp')
  .factory('Subscription', ['$http', '$rootScope', '$cookieStore', function($http, $rootScope, $cookieStore) {
    return {
      subscribe: function(show, user) {
        return $http.post('/api/subscribe', { showId: show._id, userId: user._id }).success(function(data) {
        });
      },
      unsubscribe: function(show, user) {
        return $http.post('/api/unsubscribe', { showId: show._id, userId: user._id }).success(function(data) {
        });
      }
    };
  }]);