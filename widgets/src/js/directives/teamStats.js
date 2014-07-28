angular.module('hsgc')
  .directive('teamStats', function() {
    return {
      restrict: 'AE',
      transclude: true,
      scope: { gameKey: "@game"},
      controller: ['$scope', '$element', '$http', function($scope, $element, $http) {
        var url = 'http://api.gray.hsgamecenter.com/games/unity/' + $scope.gameKey + '?includeTeamAggregates=true';
        $http.get(url)
          .success(function(data) {
            $scope.teamStatsAvailable =  data.HomeTeamStatistics.TotalPlays + data.AwayTeamStatistics.TotalPlays > 0;
            $scope.homeLogo = "http://www.hsgamecenter.com/" + data.HomeTeamLogo + "?width=30&height=30";
            $scope.homeName = data.HomeTeamName;
            $scope.homeTeamStats = data.HomeTeamStatistics;
            $scope.awayLogo = "http://www.hsgamecenter.com/" + data.AwayTeamLogo + "?width=30&height=30";
            $scope.awayName = data.AwayTeamName;
            $scope.awayTeamStats = data.AwayTeamStatistics;
          });
      }],
      templateUrl: 'templates/teamStatistics.html',
      replace: true
    };
  });