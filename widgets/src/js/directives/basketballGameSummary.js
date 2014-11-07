angular.module('hsgc')
  .directive('basketballGameSummary', function() {
    return {
      restrict: 'AE',
      scope: { gameKey: "@game", publisherKey:"@publisher", sport: "@" },
      controller: ['$scope', '$element', 'HSGCApi', '$timeout', function($scope, $element, HSGCApi, $timeout) {

        var updateBoxScore = function() {
          HSGCApi.getFullBox($scope.gameKey, $scope.publisherKey, $scope.sport, { includePlayerStats: true }).then(function(result) {
            angular.extend($scope, result);
            $timeout(updateBoxScore, 30*1000);
          });
        };
        hsgcWidgets.beforeLoadDatacast($scope.gameKey, $scope.publisherKey, function() {
            updateBoxScore();
        });
      }],
      templateUrl: 'templates/basketballGameSummary.html'
    };
  });
