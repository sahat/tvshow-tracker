angular.module('MyApp')
  .controller('DetailCtrl', ['$scope', '$rootScope', '$routeParams', 'ngProgress', 'Show', 'Subscription',
    function($scope, $rootScope, $routeParams, ngProgress, Show, Subscription) {

      ngProgress.start();

      Show.getShow($routeParams.id, function(show) {
        $scope.show = show;

        // function
        if ($rootScope.user) {
          $rootScope.currentUser.isSubscribed = false;
        }

        $scope.subscribe = function() {
          Subscription.subscribe(show, $rootScope.currentUser)
            .success(function() {
              $rootScope.currentUser.isSubscribed = true;
            });
        };

        $scope.unsubscribe = function() {
          Subscription.unsubscribe(show, $rootScope.currentUser)
            .success(function() {
              $rootScope.currentUser.isSubscribed = false;
            });
        };

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