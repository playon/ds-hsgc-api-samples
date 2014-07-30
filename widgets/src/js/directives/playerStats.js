angular.module('hsgc')
  .directive('playerStats', function() {
    return {
      restrict: 'EA',
      require: '^datacast',
      scope: { teamId: "@" },
      link: function(scope, element, attrs, datacastCtrl) {
        scope.players = datacastCtrl.getPlayersForTeam(scope.teamId);
        scope.playerStats = datacastCtrl.getPlayerStatsForTeam(scope.teamId);
        scope.statsAvailable = datacastCtrl.getStatsAvailable();
      },
      templateUrl: 'templates/playerStats.html'
    };
  });
