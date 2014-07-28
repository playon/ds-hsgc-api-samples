angular.module('hsgc')
  .directive('gameSummary', function() {
    return {
      restrict: 'AE',
      transclude: true,
      scope: { gameKey: "@game"},
      controller: ['$scope', '$element', '$http', function($scope, $element, $http) {
        var url = 'http://api.gray.hsgamecenter.com/games/unity/' + $scope.gameKey + '?includeTeamAggregates=true';
        $http.get(url)
          .success(function(data) {
            $scope.summaryAvailable = data.HomeTeamStatistics.TotalPlays + data.AwayTeamStatistics.TotalPlays > 0;
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
