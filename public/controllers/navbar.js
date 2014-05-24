angular.module('MyApp')
  .controller('NavbarCtrl', ['$scope', '$alert', 'Auth', function($scope, $alert, Auth) {
    $scope.logout = function() {
      Auth.logout();
    };
  }]);