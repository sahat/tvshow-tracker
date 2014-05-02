angular.module('MyApp')
  .controller('NavbarCtrl', ['$scope', '$location', '$alert', 'Auth', function($scope, $location, $alert, Auth) {
    console.log('navbar controller loaded!');

    $scope.dropdown = [
      {
        text: "My Shows",
        href: '#page2'
      },
      {
        divider: true
      },
      {
        text: 'Logout',
        click: 'logout()'
      }
    ];

    $scope.logout = function() {
      Auth.logout()
        .then(function() {
          $location.path('/');
          $alert({
            content: 'You have been logged out.',
            placement: 'top-right',
            type: 'info',
            duration: 3
          });
        });
    };
  }]);