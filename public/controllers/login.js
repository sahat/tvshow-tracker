angular.module('MyApp')
  .controller('LoginCtrl', ['$rootScope', '$scope', '$alert', '$location', '$window', 'Auth', function($rootScope, $scope, $alert, $location, $window, Auth) {
    $scope.login = function() {
      Auth.login({ email: $scope.email, password: $scope.password })
        .then(function() {
          $location.path('/');
          $alert({
            title: 'Cheers!',
            content: 'You have successfully logged in.',
            placement: 'top-right',
            type: 'success',
            duration: 3
          });
        })
        .catch(function(response) {
          $alert({
            title: 'Error!',
            content: 'Invalid username or password.',
            placement: 'top-right',
            type: 'danger',
            duration: 3
          });
        });
    };
  }]);