angular.module('MyApp')
  .controller('NavbarCtrl', ['$scope', '$alert', 'Auth', function($scope, $alert, Auth) {

    Auth.isLoggedIn();

    $scope.logout = function() {
      Auth.logout();
    };
  }]);