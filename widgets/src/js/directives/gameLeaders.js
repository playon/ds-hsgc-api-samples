angular.module('hsgc')
  .directive('gameLeaders', function() {
    return {
      restrict: 'AE',
      //transclude: true,
      scope: { gameKey: "@game"},
      controller: ['$scope', '$element', 'HSGCApi', function($scope, $element, HSGCApi) {
        HSGCApi.getFullBox($scope.gameKey).then(function(result) {
          angular.extend($scope, result);
        });
      }],
      templateUrl: 'templates/gameLeaders.html',
      replace: true
    };
  });