angular.module('hsgc')
  .directive('scoreboard', function() {
    return {
      restrict: 'AE',
      transclude: true,
      scope: { gameKey: "@game"},
      controller: ['$scope', 'HSGCApi', function($scope, HSGCApi) {
        HSGCApi.getFullBox($scope.gameKey)
          .then(function(result) {
            angular.extend($scope, result);
          });
      }],
      templateUrl: 'templates/scoreboard.html',
      replace: true
    };
  });