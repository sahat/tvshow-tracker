angular.module('MyApp')
  .controller('DetailCtrl', ['$scope', '$routeParams', 'ngProgress', 'Show', function($scope, $routeParams, ngProgress, Show) {
    ngProgress.start();
    Show.getShow($routeParams.id, function(show) {
      $scope.show = show;
      $scope.nextEpisode = null;
      for (var i = 0; i < show.episodes.length; i++) {
        var today = new Date();
        var episodeAirDate = new Date(show.episodes[i].firstAired);
        if (episodeAirDate > today) {
          $scope.nextEpisode = show.episodes[i];
          break;
        }
      }
      ngProgress.complete();
    });
  }]);