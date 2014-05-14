angular.module('MyApp')
  .controller('MainCtrl', ['$scope', 'Show', function($scope, Show) {
    $scope.alphabet = Show.alphabet;
    $scope.genres = Show.genres;
    $scope.headingTitle = 'Top 12 Shows';

    Show.getShows().success(function(shows) {
      $scope.shows = shows;
    });

    $scope.filterByGenre = function(genre) {
      Show.getShowsByGenre(genre).success(function(shows) {
        $scope.shows = shows;
        $scope.headingTitle = genre;
      });
    };

    $scope.filterByAlphabet = function(char) {
      Show.getShowsByAlphabet(char).success(function(shows) {
        $scope.shows = shows;
        $scope.headingTitle = char;
      });
    };
  }]);