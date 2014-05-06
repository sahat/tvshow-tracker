angular.module('MyApp')
  .controller('NavbarCtrl', ['$scope', '$alert', 'Auth', function($scope, $alert, Auth) {
    $scope.logout = function() {
      Auth.logout().then(function() {
        $alert({
          content: 'You have been logged out.',
          placement: 'top-right',
          type: 'info',
          duration: 3
        });
      });
    };
  }]);