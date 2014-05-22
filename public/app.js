angular.module('MyApp', ['ngCookies', 'ngResource', 'ngAnimate', 'ngMessages', 'ngRoute', 'mgcrea.ngStrap'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'MainCtrl',
        title: 'Home Page'
      })
      .when('/shows/:id', {
        controller: 'DetailCtrl',
        templateUrl: 'views/detail.html'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        title: 'Lo gin'
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl',
        title: 'Create Account'
      })
      .when('/add', {
        templateUrl: 'views/add.html',
        controller: 'AddCtrl',
        title: 'Add Show'
      })
      .otherwise({
        redirectTo: '/'
      });
  }])
  .config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
  }])
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
      return {
        responseError: function(response) {
          if (response.status === 401 || response.status === 403) {
            $location.path('#/login');
            return $q.reject(response);
          } else {
            return $q.reject(response);
          }
        }
      };
    }]);
  }])
  .run(['$rootScope', '$location', 'Auth', function($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', function(event, next) {
      if (next.authenticate && !Auth.isLoggedIn()) {
        $location.path('/login');
      }
    });
  }]);