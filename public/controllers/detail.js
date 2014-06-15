angular.module('MyApp')
  .controller('DetailCtrl', ['$scope', '$rootScope', '$routeParams', 'Show', 'Subscription',
    function($scope, $rootScope, $routeParams, Show, Subscription) {
      Show.get({ _id: $routeParams.id }, function(show) {
        $scope.show = show;

        $scope.isSubscribed = function() {
          return $scope.show.subscribers.indexOf($rootScope.currentUser._id) !== -1;
        };

        $scope.subscribe = function() {
          Subscription.subscribe(show).success(function() {
            $scope.show.subscribers.push($rootScope.currentUser._id);
          });
        };

        $scope.unsubscribe = function() {
          Subscription.unsubscribe(show).success(function() {
            var index = $scope.show.subscribers.indexOf($rootScope.currentUser._id);
            $scope.show.subscribers.splice(index, 1);
          });
        };

        $scope.nextEpisode = show.episodes.filter(function(episode) {
          return new Date(episode.firstAired) > new Date();
        })[0];
      });
    }]);