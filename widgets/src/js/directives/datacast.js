angular.module('hsgc')
  .directive('datacast', ['HSGCApi', '$timeout', function(HSGCApi, $timeout) {
    var pollingStarted = false;
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
          if (!angular.isUndefined($scope.players))
            return $scope.players[teamId];
        };
        this.getPlayerStatsForTeam = function(teamId) {
          if (!angular.isUndefined($scope.playerStats))
            return $scope.playerStats[teamId];
        };
        this.getStatsAvailable = function() {
          if (!angular.isUndefined($scope.statsAvailable))
            return $scope.statsAvailable;
        }
      }],
      link: function(scope, element, attrs, ctrlr, transcludeFn) {
        if (scope.sport != 'Football' && scope.sport != 'Basketball') return;

        transcludeFn(scope, function(clonedContent) {
          //clonedContent.addClass('test');
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

        var updateBoxScore = function() {
          HSGCApi.getFullBox( scope.gameKey,
                              scope.publisher,
                              scope.sport,
                              opts
                              )
          .then(
            //success
            function(result) {
              if (typeof(result) != "undefined") {
                angular.extend(scope, result);
                scope.$emit('datacastLoaded');
                $timeout(updateBoxScore, 30*1000);
              }
            },
            //failure
            function(result) {
              if (result.status == 402) {
                scope.paymentRequired = true;
                angular.extend(scope, result.boxScore);
                opts = {};
                $timeout(updateBoxScore, 30*1000);
              }
            });
        };

        if (!opts.includeLeaders && !opts.includePlayByPlay && !opts.includePlayerStats && !opts.includeTeamAggregates) {
          updateBoxScore();
        } else {
          hsgcWidgets.beforeLoadDatacast(scope.gameKey, scope.publisherKey, function() {
            updateBoxScore();
          });
        }
      }
    };
  }]);
