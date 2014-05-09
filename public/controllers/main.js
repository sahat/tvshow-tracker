angular.module('MyApp')
  .controller('MainCtrl', ['$scope', 'Show', function($scope, Show) {
    NProgress.start();

    $scope.alphabet = Show.alphabet;
    $scope.genres = Show.genres;
    $scope.headingTitle = 'Top 12 Shows';

    Show.getShows(function(shows) {
      $scope.shows = shows;
      NProgress.done();
    });

    $scope.filterByGenre = function(genre) {
      NProgress.start();
      Show.getShowsByGenre(genre).success(function(shows) {
        $scope.shows = shows;
        $scope.headingTitle = genre;
        NProgress.done();
      });
    };

    $scope.filterByAlphabet = function(char) {
      NProgress.start();
      Show.getShowsByAlphabet(char).success(function(shows) {
        $scope.shows = shows;
        $scope.headingTitle = char;
        NProgress.done();
      });
    };
  }]);