angular.module('MyApp')
  .controller('MainCtrl', ['$scope', 'Show', function($scope, Show) {
    console.log('main controller loaded!');
    Show.getShows(function(shows) {
      $scope.shows = shows;
    });
  }]);