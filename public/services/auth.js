angular.module('MyApp')
  .factory('Auth', ['$http', '$location', '$rootScope', '$cookieStore',
    function($http, $location, $rootScope, $cookieStore) {

    // Get currentUser from cookie
    $rootScope.currentUser = $cookieStore.get('user') || null;
    $cookieStore.remove('user');

    return {
      login: function(user, callback) {
        var cb = callback || angular.noop;

        return $http.post('/login', user).then(function(user) {
          $rootScope.currentUser = user;
          return cb();
        });
      },

      logout: function(callback) {
        var cb = callback || angular.noop;

        return $http.get('/logout').then(function() {
          $rootScope.currentUser = null;
          return cb();
        });
      },

      signup: function(user, callback) {
        var cb = callback || angular.noop;

        return $http.post('/signup', user).then(function(user) {
          $rootScope.currentUser = user;
          return cb();
        });
      },

      currentUser: function() {
        return $rootScope.currentUser;
      },

      isLoggedIn: function() {
        var user = $rootScope.currentUser;
        return !!user;
      }

    };
  }]);