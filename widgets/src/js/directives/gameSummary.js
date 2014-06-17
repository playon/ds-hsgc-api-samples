angular.module('hsgc')
  .directive('gameSummary', function() {
    return {
      restrict: 'AE',
      transclude: true,
      scope: { gameId: "@"},
      controller: ['$scope', '$element', '$http', function($scope, $element, $http) {
        var url = 'http://api.gray.hsgamecenter.com/games/' + $scope.gameId + '?includeTeamAggregates=true';
        $http.get(url)
          .success(function(data) {
            $scope.homeAcronym = data.HomeTeamAcronym;
            $scope.homeTeamStats = data.HomeTeamStatistics;
            $scope.awayAcronym = data.AwayTeamAcronym;
            $scope.awayTeamStats = data.AwayTeamStatistics;
          });
      }],
      templateUrl: 'templates/gameSummary.html',
      replace: true
    };
  });
