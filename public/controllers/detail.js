angular.module('MyApp')
  .controller('DetailCtrl', ['$scope', '$rootScope', '$routeParams', 'Show', 'Subscription',
    function($scope, $rootScope, $routeParams, Show, Subscription) {
      Show.get({ _id: $routeParams.id }, function(show) {
        $scope.show = show;

        $scope.isSubscribed = function() {
          return $scope.show.subscribers.indexOf($rootScope.currentUser._id) !== -1;
        };

        $scope.subscribe = function() {
          Subscription.subscribe(show, $rootScope.currentUser).success(function() {
            $scope.show.subscribers.push($rootScope.currentUser._id);
          });
        };

        $scope.unsubscribe = function() {
          Subscription.unsubscribe(show, $rootScope.currentUser).success(function() {
            var index = $scope.show.subscribers.indexOf($rootScope.currentUser._id);
            $scope.show.subscribers.splice(index, 1);
          });
        };

        // mapreduce?
        $scope.nextEpisode = null;
        for (var i = 0; i < show.episodes.length; i++) {
          var today = new Date();
          var episodeAirDate = new Date(show.episodes[i].firstAired);
          if (episodeAirDate > today) {
            $scope.nextEpisode = show.episodes[i];
            break;
          }
        }
      });
    }]);