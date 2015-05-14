angular.module('hsgc')
  .directive('footballDriveChart', function() {
    return {
      restrict: 'EA',
      templateUrl: 'templates/footballDriveChart.html',
      link: function(scope) {
        scope.selectedPeriod = 0;
        scope.lastPlay = {};
        scope.previousPlay = {};

        scope.$on('datacastLoaded', function() {
          if (angular.isUndefined(scope.playByPlay))
            return;

          scope.lastPlay = scope.playByPlay[scope.playByPlay.length - 1];
          scope.previousPlay = scope.playByPlay[scope.playByPlay.length - 2];
        });

        scope.getSpot = function(play) {
          var team = (play.TeamSeasonId == scope.homeTeamSeasonId && play.Spot <= 50) || (play.TeamSeasonId == scope.awayTeamSeasonId && play.Spot > 50) ? scope.homeAcronym : scope.awayAcronym;
          var spot = play.Spot <= 50 ? play.Spot : 100 - play.Spot;

          return team + ' ' + spot;
        };

        scope.getSpotDirectionClass = function(play) {
          if (play.TeamSeasonId == scope.homeTeamSeasonId) {
            return "nfhs-scout-drivechart-homespot";
          } else {
            return "nfhs-scout-drivechart-awayspot";
          }
        }

        scope.getScrimmageLeft = function(play) {
          if (play.TeamSeasonId == scope.homeTeamSeasonId) {
            return 100 - play.Spot;
          } else if (play.TeamSeasonId == scope.awayTeamSeasonId) {
            return play.Spot;
          }
        }

        scope.getGoalLeft = function(play) {
          var distance_offset = play.Distance;
          if (play.TeamSeasonId == scope.homeTeamSeasonId) {
            distance_offset = distance_offset * -1;
          }

          return scope.getScrimmageLeft(play) + distance_offset;
        }

        scope.downEmbelish = function(number) {
          if (number == 1) {
            return "1st";
          } else if (number == 2) {
            return "2nd";
          } else if (number == 3) {
            return "3rd";
          } else if (number == 4) {
            return "4th";
          }
        }
      }
    };
  });