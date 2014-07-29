angular.module('hsgc')
  .directive('scoringSummary', function() {
    return {
      restrict: 'AE',
      transclude: true,
      scope: { gameKey: "@game"},
      controller: ['$scope', '$element', '$http', function($scope, $element, $http) {
        HSGCApi.getFullBox($scope.gameKey).then(function(result) {
          angular.extend($scope, result);
        });
      }],
      templateUrl: 'templates/scoringSummary.html',
      replace: true
    };
  });