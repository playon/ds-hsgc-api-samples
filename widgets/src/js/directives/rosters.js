angular.module('hsgc')
  .directive('rosters', function() {
    return {
      restrict: 'AE',
      transclude: true,
      scope: { gameId: "@"},
      controller: ['$scope', '$element', '$http', function($scope, $element, $http) {
        var url = 'http://api.gray.hsgamecenter.com/games/' + $scope.gameId + '?includePlayers=true';
        $http.get(url)
          .success(function(data) {
            $scope.homeLogo = "http://www.hsgamecenter.com/" + data.HomeTeamLogo + "?width=30&height=30";
            $scope.homeName = data.HomeTeamName;
            $scope.homeTeamSeasonId = data.HomeTeamSeasonId;
            $scope.players = data.Players;
            $scope.awayLogo = "http://www.hsgamecenter.com/" + data.AwayTeamLogo + "?width=30&height=30";
            $scope.awayName = data.AwayTeamName;
            $scope.awayTeamSeasonId = data.AwayTeamSeasonId;
          });
      }],
      templateUrl: 'templates/rosters.html',
      replace: true
    };
  });
