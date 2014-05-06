angular.module('MyApp')
  .factory('Auth', ['$http', '$location', '$rootScope', '$cookieStore',
    function($http, $location, $rootScope, $cookieStore) {

    // Get currentUser from cookie
    $rootScope.currentUser = $cookieStore.get('user') || null;
    $cookieStore.remove('user');

    return {
      login: function(user, callback) {
        var cb = callback || angular.noop;

        return $http.post('/api/login', user).success(function(data) {
          console.log(data);
          $rootScope.currentUser = data;
          return cb();
        });
      },

      logout: function(callback) {
        var cb = callback || angular.noop;

        return $http.get('/api/logout').success(function() {
          $rootScope.currentUser = null;
          return cb();
        });
      },

      signup: function(user, callback) {
        var cb = callback || angular.noop;

        return $http.post('/api/signup', user).success(function(data) {
          $rootScope.currentUser = data;
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