angular.module('MyApp')
  .factory('Subscription', ['$http', '$rootScope', '$cookieStore', function($http, $rootScope, $cookieStore) {
    return {
      subscribe: function(show, user) {
        return $http.post('/api/subscribe', { showId: show._id, userId: user._id }).success(function(data) {
          console.log($cookieStore.get('user'))
          $rootScope.currentUser = $cookieStore.get('user');
          $cookieStore.remove('user');
        });
      },
      unsubscribe: function(show, user) {
        return $http.post('/api/unsubscribe', { showId: show._id, userId: user._id }).success(function(data) {
          $rootScope.currentUser = $cookieStore.get('user');
          $cookieStore.remove('user');
        });
      },
      subscriptionStatus: function(show, user) {
        return $http.post('/api/subscribed')
      }
    };
  }]);