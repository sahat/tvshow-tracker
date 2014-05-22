angular.module('MyApp')
  .factory('Auth', ['$http', '$location', '$rootScope', '$cookieStore',
    function($http, $location, $rootScope, $cookieStore) {

    $rootScope.currentUser = $cookieStore.get('user');
    $cookieStore.remove('user');

      console.log($rootScope.currentUser);

    return {
      login: function(user) {
        return $http.post('/api/login', user).success(function(data) {
          $rootScope.currentUser = data;
        });
      },

      signup: function(user) {
        return $http.post('/api/signup', user).success(function(data) {
          console.log(data);
          $rootScope.currentUser = data;
        });
      },

      logout: function() {
        return $http.get('/api/logout').success(function() {
          $rootScope.currentUser = null;
        });
      }
    };
  }]);