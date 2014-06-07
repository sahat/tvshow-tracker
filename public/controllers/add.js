angular.module('MyApp')
  .controller('AddCtrl', ['$scope', '$alert', 'Show', function($scope, $alert, Show) {
    $scope.addShow = function() {
      Show.save({ showName: $scope.showName }, function() {
        $scope.showName = '';
        $alert({
          content: 'TV show has been added.',
          placement: 'top-right',
          type: 'success',
          duration: 3
        });
      });
    };
  }]);