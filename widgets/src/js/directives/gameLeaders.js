angular.module('hsgc')
  .directive('gameLeaders', function() {
    return {
      restrict: 'AE',
      transclude: true,
      scope: { gameId: "@"},
      controller: ['$scope', '$element', '$http', '$filter', function($scope, $element, $http, $filter) {
        var url = 'http://api.gray.hsgamecenter.com/games/' + $scope.gameId + '?includeLeaders=true';
        $http.get(url)
          .success(function(data) {
            $scope.homeLogo = "http://www.hsgamecenter.com/" + data.HomeTeamLogo + "?width=30&height=30";
            $scope.homeName = data.HomeTeamName;
            $scope.homePassingLeader = $filter('stringFormat')("{0} {1}-{2}, {3} yds, {4} tds", [
              $filter('getPlayerById')(data.Players, data.GameLeaders.HomeTeamPassingLeader.Item1, data.HomeTeamSeasonId).LastName,
              data.GameLeaders.HomeTeamPassingLeader.Item2.PassingCompletions,
              data.GameLeaders.HomeTeamPassingLeader.Item2.PassingAttempts,
              data.GameLeaders.HomeTeamPassingLeader.Item2.PassingYards,
              data.GameLeaders.HomeTeamPassingLeader.Item2.PassingTouchdowns ]);

            $scope.homeRushingLeader = $filter('stringFormat')("{0} car, {1} yds, {2} tds", [
              $filter('getPlayerById')(data.Players, data.GameLeaders.HomeTeamRushingLeader.Item1, data.HomeTeamSeasonId).LastName,
              data.GameLeaders.HomeTeamRushingLeader.Item2.RushingAttempts,
              data.GameLeaders.HomeTeamRushingLeader.Item2.RushingYards,
              data.GameLeaders.HomeTeamRushingLeader.Item2.RushingTouchdowns]);

            $scope.homeReceivingLeader = $filter('stringFormat')("{0} rec, {1} yds, {2} tds", [
              $filter('getPlayerById')(data.Players, data.GameLeaders.HomeTeamReceivingLeader.Item1, data.HomeTeamSeasonId).LastName,
              data.GameLeaders.HomeTeamReceivingLeader.Item2.ReceivingCatches,
              data.GameLeaders.HomeTeamReceivingLeader.Item2.ReceivingYards,
              data.GameLeaders.HomeTeamReceivingLeader.Item2.ReceivingTouchdowns]);

            $scope.awayLogo = "http://www.hsgamecenter.com/" + data.AwayTeamLogo + "?width=30&height=30";
            $scope.awayName = data.AwayTeamName;
            $scope.awayPassingLeader = $filter('stringFormat')("{0} {1}-{2}, {3} yds, {4} tds", [
              $filter('getPlayerById')(data.Players, data.GameLeaders.AwayTeamPassingLeader.Item1, data.AwayTeamSeasonId).LastName,
              data.GameLeaders.AwayTeamPassingLeader.Item2.PassingCompletions,
              data.GameLeaders.AwayTeamPassingLeader.Item2.PassingAttempts,
              data.GameLeaders.AwayTeamPassingLeader.Item2.PassingYards,
              data.GameLeaders.AwayTeamPassingLeader.Item2.PassingTouchdowns ]);

            $scope.awayRushingLeader = $filter('stringFormat')("{0} car, {1} yds, {2} tds", [
              $filter('getPlayerById')(data.Players, data.GameLeaders.AwayTeamRushingLeader.Item1, data.AwayTeamSeasonId).LastName,
              data.GameLeaders.AwayTeamRushingLeader.Item2.RushingAttempts,
              data.GameLeaders.AwayTeamRushingLeader.Item2.RushingYards,
              data.GameLeaders.AwayTeamRushingLeader.Item2.RushingTouchdowns]);

            $scope.awayReceivingLeader = $filter('stringFormat')("{0} rec, {1} yds, {2} tds", [
              $filter('getPlayerById')(data.Players, data.GameLeaders.AwayTeamReceivingLeader.Item1, data.AwayTeamSeasonId).LastName,
              data.GameLeaders.AwayTeamReceivingLeader.Item2.ReceivingCatches,
              data.GameLeaders.AwayTeamReceivingLeader.Item2.ReceivingYards,
              data.GameLeaders.AwayTeamReceivingLeader.Item2.ReceivingTouchdowns]);
          });
      }],
      templateUrl: 'templates/gameLeaders.html',
      replace: true
    };
  });