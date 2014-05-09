angular.module('MyApp')
  .controller('MainCtrl', ['$scope', 'ngProgress', 'Show', function($scope, ngProgress, Show) {
    ngProgress.start();

    $scope.alphabet = Show.alphabet;
    $scope.genres = Show.genres;
    $scope.headingTitle = 'Top 12 Shows';

    Show.getShows(function(shows) {
      $scope.shows = shows;
      ngProgress.complete();
    });

    $scope.filterByGenre = function(genre) {
      ngProgress.start();
      Show.getShowsByGenre(genre).success(function(shows) {
        $scope.shows = shows;
        $scope.headingTitle = genre;
        ngProgress.complete();
      });
    };

    $scope.filterByAlphabet = function(char) {
      ngProgress.start();
      Show.getShowsByAlphabet(char).success(function(shows) {
        $scope.shows = shows;
        $scope.headingTitle = char;
        ngProgress.complete();
      });
    };
  }]);