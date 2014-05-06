angular.module('MyApp')
  .controller('SignupCtrl', ['$rootScope', '$scope', '$alert', '$location', '$window', 'Auth', function($rootScope, $scope, $alert, $location, $window, Auth) {
    $scope.signup = function() {
      Auth.signup({ email: $scope.email, password: $scope.password })
        .then(function(data) {
          $location.path('/');
          $alert({
            title: 'Congratulations!',
            content: 'Your account has been created.',
            placement: 'top-right',
            type: 'success',
            duration: 3
          });
        })
        .catch(function(response) {
          $alert({
            title: 'Error!',
            content: response.data,
            placement: 'top-right',
            type: 'danger',
            duration: 3
          });
        });
    };
  }]);