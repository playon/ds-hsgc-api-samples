angular.module('hsgc')
  .directive('playerStats', function() {
    return {
      restrict: 'AE',
      transclude: true,
      scope: { gameKey: "@game", homeTeam: "@" },
      controller: ['$scope', '$element', 'HSGCApi', function($scope, $element, HSGCApi) {
        HSGCApi.getFullBox($scope.gameKey).then(function(result) {
          $scope.statsAvailable = result.statsAvailable;
          var seasonId = $scope.homeTeam ? result.homeTeamSeasonId : result.awayTeamSeasonId;
          angular.extend($scope, result.playerStats[seasonId]);
          $scope.players = result.players[seasonId];
        });
      }],
      templateUrl: 'templates/playerStats.html',
      replace: true
    };
  });
