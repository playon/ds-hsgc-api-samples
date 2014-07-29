angular.module('hsgc')
  .directive('teamStats', function() {
    return {
      restrict: 'AE',
      transclude: true,
      scope: { gameKey: "@game"},
      controller: ['$scope', '$element', 'HSGCApi', function($scope, $element, HSGCApi) {
        HSGCApi.getFullBox($scope.gameKey).then(function(result) {
          angular.extend($scope, result);
        });
      }],
      templateUrl: 'templates/teamStatistics.html',
      replace: true
    };
  });