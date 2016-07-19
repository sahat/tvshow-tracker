angular.module('MyApp')
  .directive('uniqueEmail', function($http) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        element.bind('blur', function() {
          if (ngModel.$modelValue) {
            $http.get('/api/users', { params: { email: ngModel.$modelValue } }).success(function(data) {
              ngModel.$setValidity('unique', data.available);
            });
          }
        });
        element.bind('keyup', function() {
          ngModel.$setValidity('unique', true);
        });
      }
    };
  });