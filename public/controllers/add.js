angular.module('MyApp')
  .controller('AddCtrl', ['$scope', '$alert', '$http', function($scope, $alert, $http) {
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