angular.module('MyApp')
  .controller('AddCtrl', ['$rootScope', '$scope', '$alert', '$location', '$window', function($rootScope, $scope, $alert, $location, $window) {
    $scope.addShow = function() {
      $http.post('/api/shows', $scope.showName)
        .success(function() {
          $location.path('/');
          $alert({
            content: 'TV show has been added.',
            placement: 'top-right',
            type: 'success',
            duration: 3
          });
        });
    };
  }]);