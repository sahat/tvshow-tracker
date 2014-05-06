angular.module('MyApp')
  .controller('MainCtrl', ['$scope', 'ngProgress', 'Show', function($scope, ngProgress, Show) {
    console.log('Main ctrl');
    ngProgress.start();
    Show.getShows(function(shows) {
      $scope.shows = shows;
      ngProgress.complete();
    });
  }]);