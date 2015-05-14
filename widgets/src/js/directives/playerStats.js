angular.module('hsgc')
  .directive('playerStats', ['$timeout', function($timeout) {
    return {
      restrict: 'EA',
      require: '^datacast',
      scope: {
        teamId: "@"
      },
      link: function(scope, element, attrs, datacastCtrl) {
        scope.players = {};

        //scope.teamId is not immediately available during linking.  Wait for a real value, and then set up watches
        attrs.$observe('teamId', function(value) {
          if (scope.teamId != "") {
            scope.$watch(function() {
              return datacastCtrl.getPlayerStatsForTeam(scope.teamId);
            }, function(oldValue, newValue, sc) {
              sc.playerStats = newValue;
            });
            scope.$watch(function() {
              return datacastCtrl.getPlayersForTeam(scope.teamId);
            }, function(oldValue, newValue, sc) {
              sc.players[scope.teamId] = newValue;
            });

            scope.$watch(datacastCtrl.getStatsAvailable, function(newValue, oldValue, sc) {
              sc.statsAvailable = newValue;
            });
          }
        });
      },
      templateUrl: 'templates/playerStats.html'
    };
  }]);