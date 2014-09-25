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
        if (scope.sport != 'Football') return;

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
          .then(function(result) {
            if (typeof(result) != "undefined") {
              angular.extend(scope, result);
              scope.$emit('datacastLoaded');
              $timeout(updateBoxScore, 30*1000);
            }
          });
        };

        if (!opts.includeLeaders && !opts.includePlayByPlay && !opts.includePlayerStats && !opts.includeTeamAggregates) {
          updateBoxScore();
        } else {
          nfhs.auth.datacast(scope.gameKey, scope.publisherKey, function(auth) {
            if (auth.authorized) {
              updateBoxScore();
            } else {
              nfhs.utils.getUnityObject('game', scope.gameKey, function (game) {
                //get the specific upsell variables by passing in the unity event object
                nfhs.templater.datacastUpsell(game, function (upsellTemplateVars) {
                  if (typeof(upsellTemplateVars != "undefined") && upsellTemplateVars) {
                    //with the returned upsellTemplateVars, pass into handlebars template
                    var html = nfhsplayer.templates.upsell(upsellTemplateVars);
                    html = html + "<p></p>";
                    //render html
                    element.replaceWith(html);
                  }
                });
              });
            }
          });
        }
      }
    };
  }]);
