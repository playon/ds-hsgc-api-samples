angular.module('hsgc')
  .directive('volleyballPlayByPlay', function() {
    return {
      restrict: 'EA',
      templateUrl: 'templates/volleyballPlayByPlay.html',
      link: function(scope) {
        scope.selectedPeriod = 0;
        var firstLoad = true;
        var previousPeriod = -1;
        scope.$on('datacastLoaded', function() {
          if (firstLoad) {
            firstLoad = false;
            if (!scope.isFinal()) {
              scope.selectedPeriod = scope.currentPeriod;
            } else {
              scope.selectedPeriod = 1;
            }
            previousPeriod = scope.currentPeriod;
          } else {
            if (!scope.isFinal()) {
              if (previousPeriod != scope.currentPeriod) {
                previousPeriod = scope.currentPeriod;
                scope.selectedPeriod = scope.currentPeriod;
              }
            }
          }
          var periods = [];
          for (var i = 1; i <= scope.currentPeriod; i++) {
            periods.push({
              value: i,
              display: i
            });
          }
          scope.playByPlayPeriods = periods;
        });

        scope.getTeamAcronym = function(play) {
          return play.TeamSeasonId == scope.homeTeamSeasonId ? scope.homeAcronym : scope.awayAcronym;
        };
      }
    };
  });