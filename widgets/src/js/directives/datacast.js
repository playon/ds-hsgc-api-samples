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
          return $scope.players[teamId];
        };
        this.getPlayerStatsForTeam = function(teamId) {
          return $scope.playerStats[teamId];
        };
        this.getStatsAvailable = function() {
          return $scope.statsAvailable;
        }
      }],
      link: function(scope, element, attrs, ctrlr, transcludeFn) {
        (function updateBoxScore() {
          console.log('polling...');
          HSGCApi.getFullBox(scope.gameKey).then(function(result) {
            angular.extend(scope, result);
            transcludeFn(scope, function(clonedContent) {
              //clonedContent.addClass('test');
              element = element.replaceWith(clonedContent);
              element = clonedContent;
            });
            $timeout(updateBoxScore, 30*1000);
          });
        })();
        //HSGCApi.getScores(scope.unityGameKey).then(function(result) {
        //  angular.extend(scope, result);
          //element.removeClass('test');
        //});
      }
    };
  }]);
