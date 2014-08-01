angular.module('MyApp')
  .controller('AddCtrl', function($scope, $alert, $typeahead, Show) {
    $scope.addShow = function() {
      Show.save({ showName: $scope.showName },
        function() {
          $scope.showName = '';
          $scope.addForm.$setPristine();
          $alert({
            animation: 'fadeZoomFadeDown',
            content: 'TV show has been added.',
            type: 'material',
            duration: 3
          });
        },
        function(response) {
          $scope.showName = '';
          $scope.addForm.$setPristine();
          $alert({
            animation: 'fadeZoomFadeDown',
            content: response.data.message,
            type: 'material',
            duration: 3
          });
        });
    };
  });