angular.module('MyApp')
  .factory('Auth', function($http, $location, $rootScope, $alert, $window, $document) {
    var token = $window.localStorage.token;
    if (token) {
      var payload = JSON.parse($window.atob(token.split('.')[1]));
      $rootScope.currentUser = payload.user;
    }

    $window.fbAsyncInit = function() {
      FB.init({
        appId: '624059410963642',
        responseType: 'token',
        version: 'v2.0'
      });
    };

    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    return {
      facebookLogin: function() {
        FB.login(function(response) {
          FB.api('/me', function(profile) {
            var data = {
              signedRequest: response.authResponse.signedRequest,
              profile: profile
            };
            $http.post(config.providers.facebook.url, data).success(function(token) {
              var payload = JSON.parse($window.atob(token.split('.')[1]));
              $window.localStorage.token = token;
              $rootScope.currentUser = payload.user;
              $location.path('/');
              $alert({
                title: 'Cheers!',
                content: 'You have successfully signed-in with Facebook.',
                placement: 'top-right',
                type: 'success',
                duration: 3
              });
            });
          });
        }, { scope: 'email, public_profile' });
      },
      login: function(user) {
        return $http.post('/api/login', user)
          .success(function(data, status, headers, config) {
            $window.localStorage.token = data.token;
            var payload = JSON.parse($window.atob(data.token.split('.')[1]));
            $rootScope.currentUser = payload.user;
            $location.path(config.loginRedirect);
            $alert({
              title: 'Cheers!',
              content: 'You have successfully logged in.',
              placement: 'top-right',
              type: 'success',
              duration: 3
            });
          })
          .error(function() {
            delete $window.localStorage.token;
            $alert({
              title: 'Error!',
              content: 'Invalid username or password.',
              placement: 'top-right',
              type: 'danger',
              duration: 3
            });
          });
      },
      signup: function(user) {
        return $http.post('/api/signup', user)
          .success(function() {
            $location.path('/login');

            $alert({
              title: 'Congratulations!',
              content: 'Your account has been created.',
              placement: 'top-right',
              type: 'success',
              duration: 3
            });
          })
          .error(function(response) {
            $alert({
              title: 'Error!',
              content: response.data,
              placement: 'top-right',
              type: 'danger',
              duration: 3
            });
          });
      },
      logout: function() {
        return $http.get('/api/logout').success(function() {
          delete $window.localStorage.token;
          $rootScope.currentUser = null;
          $alert({
            content: 'You have been logged out.',
            placement: 'top-right',
            type: 'info',
            duration: 3
          });
        });
      }
    };
  });