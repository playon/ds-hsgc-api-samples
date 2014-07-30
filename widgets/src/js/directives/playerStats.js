angular.module('hsgc')
  .directive('playerStats', ['$timeout', function($timeout) {
    return {
      restrict: 'EA',
      require: '^datacast',
      scope: { teamId: "@" },
      link: function(scope, element, attrs, datacastCtrl) {
        //TODO: this timeout shouldn't be necessary, but for some reason i can't get the results to apply on the first api poll.
        //without the timeout, they show up on subsequent polls
        $timeout(function() {
          scope.$watch(function() {
            return datacastCtrl.getPlayerStatsForTeam(scope.teamId);
          }, function(oldValue, newValue, sc) {
            sc.playerStats = newValue;
            //scope.statsAvailable = datacastCtrl.getStatsAvailable();
          });
          scope.$watch(function() {
            return datacastCtrl.getPlayersForTeam(scope.teamId) ;
          } , function(oldValue, newValue, sc) {
            sc.players = newValue;
            //scope.statsAvailable = datacastCtrl.getStatsAvailable();
          });

          scope.$watch(datacastCtrl.getStatsAvailable, function(newValue, oldValue, sc) {
            sc.statsAvailable = newValue;
          });
        }, 2000);


        //scope.players = datacastCtrl.getPlayersForTeam(scope.teamId);
        //scope.playerStats = datacastCtrl.getPlayerStatsForTeam(scope.teamId);
        //scope.statsAvailable = datacastCtrl.getStatsAvailable();
      },
      templateUrl: 'templates/playerStats.html'
    };
  }]);
