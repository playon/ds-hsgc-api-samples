angular.module('hsgc')
  .directive('basketballShotChart', function() {
    return {
      restrict: 'EA',
      templateUrl: 'templates/basketballShotChart.html',
      link: function(scope) {
        scope.selectedShotChartPeriod = 0;
        var firstLoad = true;
        var previousPeriod = -1;
        scope.$on('datacastLoaded', function() {
          if (firstLoad) {
            firstLoad = false;
            scope.selectedShotChartPeriod = null;
            previousPeriod = scope.currentPeriod;
          }

          var periods = [];
          for (var i = 1; i <= scope.currentPeriod; i++) {
            if (i == 1)
              periods.push({ value: i, display: "1st" });
            else if (i == 2)
              periods.push({ value: i, display: "2nd" });
            else if (i == 3)
              periods.push({ value: i, display: "3rd" });
            else if (i == 4)
              periods.push({ value: i, display: "4th" });
            else {
              if (scope.currentPeriod == 5)
                periods.push({ value: i, display: "OT" });
              else
                periods.push({ value: i, display: (i - 4) + " OT" });
            }
          }
          scope.shotChartPeriods = periods;
        });


        scope.getLogo = function(play) {
          return play.TeamSeasonId == scope.homeTeamSeasonId ? scope.homeLogo : scope.awayLogo;
        };

        scope.getShotLeft = function(shot) {
          return ((shot.X - 8)/641)*100;
        };

        scope.getShotTop = function(shot) {
          return ((shot.Y - 8)/428)*100;
        };

        scope.getShotImageClass= function(shot) {
          if (shot.TeamSeasonId == scope.homeTeamSeasonId) {
            if (shot.IsScoring) {
              return "nfhs-scout-shot-chart-shot-made-home";
            } else {
              return "nfhs-scout-shot-chart-shot-missed-home";
            }
          } else {
            if (shot.IsScoring) {
              return "nfhs-scout-shot-chart-shot-made-away";
            } else {
              return "nfhs-scout-shot-chart-shot-missed-away";
            }
          }
        }
      }
    };
  })
  .filter('filterShots', function() {
    return function(plays, awayPlayerFilter, homePlayerFilter, period, includeMade, includeMissed) {
      var shots = [];
      if (typeof(plays) != "undefined") {
        for (var i = 0; i < plays.length; i++) {
          if (plays[i].IsShot) {
            if (awayPlayerFilter != null && typeof(awayPlayerFilter) != "undefined" && plays[i].TeamSeasonId == awayPlayerFilter.TeamSeasonId && plays[i].PlayerId != awayPlayerFilter.PlayerId) {
              continue;
            }
            if (homePlayerFilter != null && typeof(homePlayerFilter) != "undefined" && plays[i].TeamSeasonId == homePlayerFilter.TeamSeasonId && plays[i].PlayerId != homePlayerFilter.PlayerId) {
              continue;
            }
            if (period != null && typeof(period) != "undefined" && plays[i].Quarter != period) {
              //handle OT
              if (plays[i].Quarter <= 4 || period != 5) {
                continue;
              }
            }
            shots.push(plays[i]);
          }
        }
      }

      return shots;
    };
  });