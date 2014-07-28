function populateBaseInfo(boxScore) {
  scores = { };
  scores[boxScore.HomeTeamSeasonId] = boxScore.HomeScore;
  scores[boxScore.AwayTeamSeasonId] = boxScore.AwayScore;
  unityTeamMapping = { };
  unityTeamMapping[boxScore.HomeTeamUnityKey] = boxScore.HomeTeamSeasonId;
  unityTeamMapping[boxScore.AwayTeamUnityKey] = boxScore.AwayTeamSeasonId;
  return {
    homeScore: boxScore.HomeScore,
    awayScore: boxScore.AwayScore,
    periodScores: boxScore.PeriodScores,
    regulationPeriodCount: boxScore.RegulationPeriodCount,
    totalScores: scores,
    awayPeriodScores: boxScore.AwayPeriodScores,
    homePeriodScores: boxScore.HomePeriodScores,
    homeLogo: "http://www.hsgamecenter.com/" + boxScore.HomeTeamLogo + "?width=30&height=30",
    awayLogo: "http://www.hsgamecenter.com/" + boxScore.AwayTeamLogo + "?width=30&height=30",
    homeName: boxScore.HomeTeamName,
    awayName: boxScore.AwayTeamName,
    unityTeamMapping: unityTeamMapping,
    detailLevel: boxScore.DetailLevel,
    scoresAvailable: boxScore.DetailLevel != 'Information',
    getScore: function(unityKey) {
      var tsId = unityTeamMapping[unityKey];
      return scores[tsId];
    }
  }
}

angular.module('hsgc')
  .factory('HSGCApi', [ '$http', '$filter', '$timeout', function($http, $filter, $timeout) {
    var getScores = function(unityGameKey, publisherKey, sport) {
      var url = 'http://api.gray.hsgamecenter.com/games/unity/' + unityGameKey;
      return $http.get(url).then(function(boxScore) {
        return populateBaseInfo(boxScore.data);
      });
    }

    var getLeaders = function(unityGameKey, publisherKey, sport) {
      var url = 'http://api.gray.hsgamecenter.com/games/unity/' + unityGameKey + '?includeLeaders=true';
      return $http.get(url).then(function(boxScore) {
        var bs = populateBaseInfo(boxScore.data);
        if (bs.detailLevel == 'Full') {
          bs.leaders = { leadersAvailable: true };

          bs.leaders.homePassingLeader = $filter('stringFormat')("{0} {1}-{2}, {3} yds, {4} tds", [
            $filter('getPlayerById')(boxScore.Players, boxScore.GameLeaders.HomeTeamPassingLeader.Item1, boxScore.HomeTeamSeasonId).LastName,
            boxScore.GameLeaders.HomeTeamPassingLeader.Item2.PassingCompletions,
            boxScore.GameLeaders.HomeTeamPassingLeader.Item2.PassingAttempts,
            boxScore.GameLeaders.HomeTeamPassingLeader.Item2.PassingYards,
            boxScore.GameLeaders.HomeTeamPassingLeader.Item2.PassingTouchdowns ]);

          bs.leaders.homeRushingLeader = $filter('stringFormat')("{0} car, {1} yds, {2} tds", [
            $filter('getPlayerById')(boxScore.Players, boxScore.GameLeaders.HomeTeamRushingLeader.Item1, boxScore.HomeTeamSeasonId).LastName,
            boxScore.GameLeaders.HomeTeamRushingLeader.Item2.RushingAttempts,
            boxScore.GameLeaders.HomeTeamRushingLeader.Item2.RushingYards,
            boxScore.GameLeaders.HomeTeamRushingLeader.Item2.RushingTouchdowns]);

          bs.leaders.homeReceivingLeader = $filter('stringFormat')("{0} rec, {1} yds, {2} tds", [
            $filter('getPlayerById')(boxScore.Players, boxScore.GameLeaders.HomeTeamReceivingLeader.Item1, boxScore.HomeTeamSeasonId).LastName,
            boxScore.GameLeaders.HomeTeamReceivingLeader.Item2.ReceivingCatches,
            boxScore.GameLeaders.HomeTeamReceivingLeader.Item2.ReceivingYards,
            boxScore.GameLeaders.HomeTeamReceivingLeader.Item2.ReceivingTouchdowns]);

          bs.leaders.awayPassingLeader = $filter('stringFormat')("{0} {1}-{2}, {3} yds, {4} tds", [
            $filter('getPlayerById')(boxScore.Players, boxScore.GameLeaders.AwayTeamPassingLeader.Item1, boxScore.AwayTeamSeasonId).LastName,
            boxScore.GameLeaders.AwayTeamPassingLeader.Item2.PassingCompletions,
            boxScore.GameLeaders.AwayTeamPassingLeader.Item2.PassingAttempts,
            boxScore.GameLeaders.AwayTeamPassingLeader.Item2.PassingYards,
            boxScore.GameLeaders.AwayTeamPassingLeader.Item2.PassingTouchdowns ]);

          bs.leaders.awayRushingLeader = $filter('stringFormat')("{0} car, {1} yds, {2} tds", [
            $filter('getPlayerById')(boxScore.Players, boxScore.GameLeaders.AwayTeamRushingLeader.Item1, boxScore.AwayTeamSeasonId).LastName,
            boxScore.GameLeaders.AwayTeamRushingLeader.Item2.RushingAttempts,
            boxScore.GameLeaders.AwayTeamRushingLeader.Item2.RushingYards,
            boxScore.GameLeaders.AwayTeamRushingLeader.Item2.RushingTouchdowns]);

          bs.leaders.awayReceivingLeader = $filter('stringFormat')("{0} rec, {1} yds, {2} tds", [
            $filter('getPlayerById')(boxScore.Players, boxScore.GameLeaders.AwayTeamReceivingLeader.Item1, boxScore.AwayTeamSeasonId).LastName,
            boxScore.GameLeaders.AwayTeamReceivingLeader.Item2.ReceivingCatches,
            boxScore.GameLeaders.AwayTeamReceivingLeader.Item2.ReceivingYards,
            boxScore.GameLeaders.AwayTeamReceivingLeader.Item2.ReceivingTouchdowns]);
        }
        return bs;
      });
    }

    return {
      getScores : getScores,
      getLeaders : getLeaders
    };
  }]);