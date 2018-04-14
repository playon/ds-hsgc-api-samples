angular.module('hsgc').directive('basketballPlayByPlay', function() {
    return {
        restrict: 'EA',
        templateUrl: 'templates/basketballPlayByPlay.html',
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
                    if (i == 1)
                        periods.push({
                            value: i,
                            display: '1st'
                        });
                    else if (i == 2)
                        periods.push({
                            value: i,
                            display: '2nd'
                        });
                    else if (i == 3)
                        periods.push({
                            value: i,
                            display: '3rd'
                        });
                    else if (i == 4)
                        periods.push({
                            value: i,
                            display: '4th'
                        });
                    else {
                        if (scope.currentPeriod == 5)
                            periods.push({
                                value: i,
                                display: 'OT'
                            });
                        else
                            periods.push({
                                value: i,
                                display: i - 4 + ' OT'
                            });
                    }
                }
                scope.playByPlayPeriods = periods;
            });

            scope.getLogo = function(play) {
                return play.TeamSeasonId == scope.homeTeamSeasonId
                    ? scope.homeLogo
                    : scope.awayLogo;
            };

            scope.getTeamAcronym = function(play) {
                return play.TeamSeasonId == scope.homeTeamSeasonId
                    ? scope.homeAcronym
                    : scope.awayAcronym;
            };
        }
    };
});
