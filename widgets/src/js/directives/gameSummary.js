angular.module('hsgc')
  .directive('gameSummary', function() {
    return {
      restrict: 'AE',
      scope: {
        gameKey: "@game",
        publisherKey: "@publisher",
        sport: "@"
      },
      controller: ['$scope', '$element', 'HSGCApi', '$timeout', 'hsgcConfig', function($scope, $element, HSGCApi, $timeout, config) {

        var updateBoxScore = function() {
          HSGCApi.getFullBox($scope.gameKey, $scope.publisherKey, $scope.sport, {
            includeTeamAggregates: true
          }).then(function(result) {
            // success
            angular.extend($scope, result);
            $timeout(updateBoxScore, 30 * 1000);
          }, function(result) {
            // error
            $timeout(updateBoxScore, 60 * 1000);
          });
        };
        config.beforeLoadDatacast($scope.gameKey, $scope.publisherKey, function() {
          updateBoxScore();
        });
      }],
      templateUrl: 'templates/gameSummary.html'
    };
  });