angular.module('MyApp', ['ngCookies', 'ngSanitize', 'ngResource', 'ngRoute', 'ngAnimate', 'ngProgress', 'mgcrea.ngStrap'])
  .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'MainCtrl',
        title: 'Home Page'
      })
      .when('/page1', {
        templateUrl: 'views/page1.html',
        controller: 'MainCtrl',
        title: 'Page 1'
      })
      .when('/page2', {
        templateUrl: 'views/page2.html',
        controller: 'MainCtrl',
        title: 'Page 2'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        title: 'Login'
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl',
        title: 'Create Account'
      })
      .when('/add', {
        templateUrl: 'views/add-show.html',
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
            $location.path('/login');
            return $q.reject(response);
          }
          else {
            return $q.reject(response);
          }
        }
      };
    }]);
  }])
  .run(function($rootScope, $location, Auth) {

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', function(event, next) {

      if (next.authenticate && !Auth.isLoggedIn()) {
        $location.path('/login');
      }
    });
  });