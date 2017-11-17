angular.module('hsgc')
  .directive('datacast', ['HSGCApi', '$timeout', '$log', 'hsgcConfig', function(HSGCApi, $timeout, $log, config) {
    return {
      restrict: 'EA',
      transclude: 'element',
      scope: {
        gameKey: "@datacast",
        publisherKey: "@publisher",
        sport: "@sport"
      },
      controller: ["$scope", function($scope) {
        this.getPlayersForTeam = function(teamId) {
          if (!angular.isUndefined($scope.players)) {
            return $scope.players[teamId];
          }
        };
        this.getPlayerStatsForTeam = function(teamId) {
          if (!angular.isUndefined($scope.playerStats)) {
            return $scope.playerStats[teamId];
          }
        };
        this.getStatsAvailable = function() {
          if (!angular.isUndefined($scope.statsAvailable)) {
            return $scope.statsAvailable;
          }
        };
        this.getAsReportedBy = function(teamId) {
          return $scope.asReportedBy(teamId);
        };
      }],
      link: function(scope, element, attrs, ctrlr, transcludeFn) {
        if (scope.sport !== 'Football' && scope.sport !== 'Basketball' && scope.sport !== 'Volleyball') {
          $log.debug(scope.sport + ' not implemented');
          return;
        }

        transcludeFn(scope, function(clonedContent) {
          element = element.replaceWith(clonedContent);
          element = clonedContent;
        });

        var opts = {
          includeLeaders: angular.isDefined(attrs.includeLeaders),
          includePlayByPlay: angular.isDefined(attrs.includePlayByPlay),
          includePlayerStats: angular.isDefined(attrs.includePlayerStats),
          includeTeamAggregates: angular.isDefined(attrs.includeTeamStats),
          includePlayers: angular.isDefined(attrs.includePlayers)
        };

        var setNextUpdate = function(refreshIn) {
          $timeout(updateBoxScore, refreshIn);
        };

        var firstLoad = true;
        var updateBoxScore = function() {
          HSGCApi.getFullBox(scope.gameKey,
              scope.publisher,
              scope.sport,
              opts
            ).then(
              // success
              function(result) {
                if (typeof(result) !== "undefined") {
                  angular.extend(scope, result);
                  var refreshIn = 30 * 1000;
                  if (firstLoad) {
                    firstLoad = false;
                    
                    //some of the stuff doesn't really work well until the second cycle
                    //hack to fix this stuff is to reload really fast the first time
                    refreshIn = 1000;
                    
                    //this shouldn't be here, but i can't get it to work in the FullBoxScore directive
                    if (scope.sport === 'Football') {
                      if (scope.status === 'InProgress') {
                        scope.selectedDetailTab = 5;                         
                      } else {
                        scope.selectedDetailTab = 1;
                      }
                    }
                  }

                  scope.$emit('datacastLoaded');
                  scope.$broadcast('datacastLoaded');

                  // stop refreshing once game is complete; may miss edits, but those are rare so, meh
                  if (scope.status !== 'Complete') {
                    setNextUpdate(refreshIn);
                  } else {
                    $log.debug('Game complete. Stopping auto-refresh.');
                  }
                }
              },
              function(result) {
                // error
                if (result.status == 402) {
                  // need to pay; will likely need to navigate away anyway, so just stop trying to refresh, and show upsell
                  $log.warning('402 Payment Required');
                  scope.paymentRequired = true;
                  angular.extend(scope, result.boxScore);
                  opts = {};
                } else {
                  // not sure what went wrong; try again in a little while
                  $log.error('Datacast could not be loaded. Will try again. Status code:', result.status, result);
                  setNextUpdate(120 * 1000);
                }
              });
        };

        if (!opts.includeLeaders && !opts.includePlayByPlay && !opts.includePlayerStats && !opts.includeTeamAggregates) {
          return updateBoxScore();
        } else {
          config.beforeLoadDatacast(scope.gameKey, scope.publisherKey, function() {
            return updateBoxScore();
          });
        }
      }
    };
  }]);