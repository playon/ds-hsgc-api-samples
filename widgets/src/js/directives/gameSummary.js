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
            includeTeamAggregates: true,
            // TODO: remove this temporary fix to match datacast so browser caching can be used, once they share a datacast update/refresh handler and/or observer
            includeLeaders: true,
            includePlayByPlay: true,
            includePlayerStats: true,
            includePlayers: true
          }).then(function(result) {
            // success
            angular.extend($scope, result);
            $timeout(updateBoxScore, 30 * 1000);
          }, function(result) {
            // error
            $timeout(updateBoxScore, 120 * 1000);
          });
        };
        config.beforeLoadDatacast($scope.gameKey, $scope.publisherKey, function() {
          updateBoxScore();
        });
      }],
      templateUrl: 'templates/gameSummary.html'
    };
  });