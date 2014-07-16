angular.module('hsgc')
  .directive('playerStats', function() {
    return {
      restrict: 'AE',
      transclude: true,
      scope: { gameKey: "@game", homeTeam: "@" },
      controller: ['$scope', '$element', '$http', function($scope, $element, $http) {
        var url = 'http://api.gray.hsgamecenter.com/games/unity/' + $scope.gameKey + '?includePlayerStats=true';
        $http.get(url)
          .success(function(data) {
            if ($scope.homeTeam) {
              $scope.teamName = data.HomeTeamName;
              $scope.players = data.Players;
              $scope.teamId = data.HomeTeamSeasonId;
              $scope.passingStats = data.HomeTeamPassingStatistics;
              $scope.rushingStats = data.HomeTeamRushingStatistics;
              $scope.receivingStats = data.HomeTeamReceivingStatistics;
              $scope.defensiveStats = data.HomeTeamDefensiveStatistics;
              $scope.kickingStats = data.HomeTeamKickingStatistics;
              $scope.puntingStats = data.HomeTeamPuntingStatistics;
              $scope.puntReturnStats = data.HomeTeamPuntReturnStatistics;
              $scope.kickReturnStats = data.HomeTeamKickReturnStatistics;
            } else {
              $scope.teamName = data.AwayTeamName;
              $scope.players = data.Players;
              $scope.teamId = data.AwayTeamSeasonId;
              $scope.passingStats = data.AwayTeamPassingStatistics;
              $scope.rushingStats = data.AwayTeamRushingStatistics;
              $scope.receivingStats = data.AwayTeamReceivingStatistics;
              $scope.defensiveStats = data.AwayTeamDefensiveStatistics;
              $scope.kickingStats = data.AwayTeamKickingStatistics;
              $scope.puntingStats = data.AwayTeamPuntingStatistics;
              $scope.puntReturnStats = data.AwayTeamPuntReturnStatistics;
              $scope.kickReturnStats = data.AwayTeamKickReturnStatistics;
            }
          });
      }],
      templateUrl: 'templates/playerStats.html',
      replace: true
    };
  });
