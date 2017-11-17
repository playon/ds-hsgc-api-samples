angular.module('hsgc')
  .directive('footballPlayerStats', ['$timeout', function($timeout) {
    return {
      restrict: 'EA',
      require: '^datacast',
      scope: {
        teamId: "@"
      },
      link: function(scope, element, attrs, datacastCtrl) {
        scope.players = {};
        scope.anyPlayerStatsAvailable = false;

        // scope.teamId is not immediately available during linking; wait for a real value, and then set up watches
        attrs.$observe('teamId', function(value) {
          if (scope.teamId != "") {
            scope.$watch(function() {
              return datacastCtrl.getPlayerStatsForTeam(scope.teamId);
            }, function(oldValue, newValue, sc) {
              sc.playerStats = newValue;
              sc.anyPlayerStatsAvailable = newValue && (newValue.passingStats.length + newValue.rushingStats.length + 
                newValue.receivingStats.length + newValue.defensiveStats.length + newValue.kickingStats.length + 
                newValue.puntingStats.length +  newValue.puntReturnStats.length + newValue.kickReturnStats.length > 0);
            });

            scope.$watch(function() {
              return datacastCtrl.getPlayersForTeam(scope.teamId);
            }, function(oldValue, newValue, sc) {
              sc.players[scope.teamId] = newValue;
            });

            scope.$watch(datacastCtrl.getStatsAvailable, function(newValue, oldValue, sc) {
              sc.statsAvailable = newValue;
            });

            scope.$watch(function() {
              return datacastCtrl.getAsReportedBy(scope.teamId);
            }, function(newValue, oldValue, sc) {
              sc.asReportedBy = newValue;
            });
          }
        });
      },
      templateUrl: 'templates/footballPlayerStats.html'
    };
  }]);