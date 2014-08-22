angular.module('hsgc')
  .directive('gameSummary', function() {
    return {
      restrict: 'AE',
      scope: { gameKey: "@game", publisherKey:"@publisher", sport: "@" },
      controller: ['$scope', '$element', 'HSGCApi', '$timeout', function($scope, $element, HSGCApi, $timeout) {

        (function updateBoxScore() {
          HSGCApi.getFullBox($scope.gameKey, $scope.publisherKey, $scope.sport, { includeTeamAggregates: true }).then(function(result) {
            angular.extend($scope, result);
            $timeout(updateBoxScore, 30*1000);
          });
        })();


      }],
      templateUrl: 'templates/gameSummary.html'
    };
  });
