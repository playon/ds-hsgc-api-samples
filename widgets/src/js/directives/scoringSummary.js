angular.module('hsgc')
  .directive('scoringSummary', function() {
    return {
      restrict: 'AE',
      transclude: true,
      scope: { gameId: "@"},
      controller: ['$scope', '$element', '$http', function($scope, $element, $http) {
        //includeScoringPlays isn't working...
        //var url = 'http://api.gray.hsgamecenter.com/games/' + $scope.gameId + '?includeScoringPlays=true';
        var url = 'http://api.gray.hsgamecenter.com/games/' + $scope.gameId + '?includePlayByPlay=true';
        $http.get(url)
          .success(function(data) {
            console.log(data);
            $scope.scoringPlays = data.ScoringPlays;
          });
      }],
      templateUrl: 'templates/scoringSummary.html',
      replace: true
    };
  });