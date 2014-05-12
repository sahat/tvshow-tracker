angular.module('MyApp', ['ngCookies', 'ngAnimate', 'ngSanitize', 'ngResource', 'ngRoute', 'mgcrea.ngStrap', 'chieffancypants.loadingBar'])
  .config(['$routeProvider', '$httpProvider', '$locationProvider',
    function($routeProvider, $httpProvider, $locationProvider) {

      $locationProvider.html5Mode(true);

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

      // Intercept 401s and 403s and redirect you to login
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