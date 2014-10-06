angular.module('hsgc')
  .directive('playByPlay', function() {
    return {
      restrict: 'EA',
      templateUrl: 'templates/playByPlay.html',
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
        });

        scope.$watch('selectedPeriod', function(newValue) {
          if (angular.isUndefined(scope.playByPlay))
            return;

          var periodPlays = scope.playByPlay.filter(function(play) {
            return play.Quarter == newValue;
          });

          var drives = [];
          var currentDrive = -1;
          for(var i = 0; i < periodPlays.length; i++) {
            if (periodPlays[i].Drive != currentDrive) {
              drives.push([]);
              currentDrive = periodPlays[i].Drive;
            }
            drives[drives.length - 1].push(periodPlays[i]);
          }
          scope.selectedPeriodPlays = drives;
        });

        scope.getSpot = function(play) {
          var team = (play.TeamSeasonId == scope.homeTeamSeasonId && play.Spot <= 50) || (play.TeamSeasonId == scope.awayTeamSeasonId && play.Spot > 50)
            ? scope.homeAcronym : scope.awayAcronym;
          var spot = play.Spot <= 50 ? play.Spot : 100 - play.Spot;

          return team + ' ' + spot;
        };

        scope.getLogo = function(play) {
          return play.TeamSeasonId == scope.homeTeamSeasonId ? scope.homeLogo : scope.awayLogo;
        };
      }
    };
  });