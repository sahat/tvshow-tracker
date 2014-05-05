angular.module('MyApp')
  .controller('AddCtrl', ['$scope', '$alert', '$location', '$http', function($scope, $alert, $location, $http) {
    $scope.addShow = function() {
      $http.post('/api/shows', { showName: $scope.showName })
        .success(function() {
          $scope.showName = '';
          $alert({
            content: 'TV show has been added.',
            placement: 'top-right',
            type: 'success',
            duration: 3
          });
        })
    };
  }]);