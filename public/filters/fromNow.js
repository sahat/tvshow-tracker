angular.module('MyApp').
  filter('fromNow', function() {
    return function(date) {
      return moment(date).fromNow();
    }
  });