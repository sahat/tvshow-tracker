angular.module('MyApp')
  .controller('DetailCtrl', ['$scope', '$routeParams', 'ngProgress', 'Show', function($scope, $routeParams, ngProgress, Show) {
    ngProgress.start();
    Show.getShow($routeParams.id, function(show) {
      $scope.show = show;
      ngProgress.complete();
    });
  }]);