angular.module('hsgc')
  .directive('scoreboard', function() {
    return {
      restrict: 'AE',
      transclude: true,
      scope: { gameKey: "@game"},
      controller: ['$scope', '$element', '$http', function($scope, $element, $http) {
        var url = 'http://api.gray.hsgamecenter.com/games/unity/' + $scope.gameKey;
        $http.get(url)
          .success(function(data) {
            $scope.homeScore = data.HomeScore;
            $scope.homeLogo = "http://www.hsgamecenter.com/" + data.HomeTeamLogo + "?width=30&height=30";
            $scope.homeName = data.HomeTeamName;
            $scope.homePeriodScores = data.HomePeriodScores;
            $scope.awayScore = data.AwayScore;
            $scope.awayLogo = "http://www.hsgamecenter.com/" + data.AwayTeamLogo + "?width=30&height=30";
            $scope.awayName = data.AwayTeamName;
            $scope.awayPeriodScores = data.AwayPeriodScores;
          });
      }],
      templateUrl: 'templates/scoreboard.html',
      replace: true
    };
  });