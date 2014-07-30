//var apiRoot = "http://api.gamecenter.dev/v1/";
var apiRoot = 'http://api.gray.hsgamecenter.com/v1/';

function populateBaseInfo(boxScore) {
  scores = { };
  scores[boxScore.HomeTeamSeasonId] = boxScore.HomeScore;
  scores[boxScore.AwayTeamSeasonId] = boxScore.AwayScore;
  unityTeamMapping = { };
  unityTeamMapping[boxScore.HomeTeamUnityKey] = boxScore.HomeTeamSeasonId;
  unityTeamMapping[boxScore.AwayTeamUnityKey] = boxScore.AwayTeamSeasonId;
  return {
    homeTeamSeasonId: boxScore.HomeTeamSeasonId,
    awayTeamSeasonId: boxScore.AwayTeamSeasonId,
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
    homeAcronym: boxScore.HomeTeamAcronym,
    awayAcronym: boxScore.AwayTeamAcronym,
    homeStats: boxScore.HomeTeamStatistics,
    awayStats: boxScore.AwayTeamStatistics,
    playByPlay: boxScore.PlaysInGame,
    scoringPlays: boxScore.ScoringPlays,
    currentPeriod: 1, //todo: if game is live, show current period, otherwise show first period
    unityTeamMapping: unityTeamMapping,
    scoresAvailable: boxScore.ScoresAvailable,
    statsAvailable: boxScore.StatsAvailable,
    playByPlayAvailable: boxScore.PlayByPlayAvailable,
    leadersAvailable: boxScore.LeadersAvailable,
    getScore: function(unityKey) {
      var tsId = unityTeamMapping[unityKey];
      return scores[tsId];
    }
  }
}

function populateLeaderInfo(boxScore, bs, $filter) {
  if (bs.leadersAvailable) {
    bs.leaders = { };

    if (boxScore.GameLeaders.HomeTeamPassingLeader) {
      bs.leaders.homePassingLeader = $filter('stringFormat')("{0} {1}-{2}, {3} yds, {4} tds", [
        $filter('getPlayerById')(boxScore.Players, boxScore.GameLeaders.HomeTeamPassingLeader.Item1, boxScore.HomeTeamSeasonId).LastName,
        boxScore.GameLeaders.HomeTeamPassingLeader.Item2.PassingCompletions,
        boxScore.GameLeaders.HomeTeamPassingLeader.Item2.PassingAttempts,
        boxScore.GameLeaders.HomeTeamPassingLeader.Item2.PassingYards,
        boxScore.GameLeaders.HomeTeamPassingLeader.Item2.PassingTouchdowns ]);
    }

    if (boxScore.GameLeaders.HomeTeamRushingLeader) {
      bs.leaders.homeRushingLeader = $filter('stringFormat')("{0} car, {1} yds, {2} tds", [
        $filter('getPlayerById')(boxScore.Players, boxScore.GameLeaders.HomeTeamRushingLeader.Item1, boxScore.HomeTeamSeasonId).LastName,
        boxScore.GameLeaders.HomeTeamRushingLeader.Item2.RushingAttempts,
        boxScore.GameLeaders.HomeTeamRushingLeader.Item2.RushingYards,
        boxScore.GameLeaders.HomeTeamRushingLeader.Item2.RushingTouchdowns]);
    }

    if (boxScore.GameLeaders.HomeTeamReceivingLeader) {
      bs.leaders.homeReceivingLeader = $filter('stringFormat')("{0} rec, {1} yds, {2} tds", [
        $filter('getPlayerById')(boxScore.Players, boxScore.GameLeaders.HomeTeamReceivingLeader.Item1, boxScore.HomeTeamSeasonId).LastName,
        boxScore.GameLeaders.HomeTeamReceivingLeader.Item2.ReceivingCatches,
        boxScore.GameLeaders.HomeTeamReceivingLeader.Item2.ReceivingYards,
        boxScore.GameLeaders.HomeTeamReceivingLeader.Item2.ReceivingTouchdowns]);
    }

    if (boxScore.GameLeaders.AwayTeamPassingLeader) {
      bs.leaders.awayPassingLeader = $filter('stringFormat')("{0} {1}-{2}, {3} yds, {4} tds", [
        $filter('getPlayerById')(boxScore.Players, boxScore.GameLeaders.AwayTeamPassingLeader.Item1, boxScore.AwayTeamSeasonId).LastName,
        boxScore.GameLeaders.AwayTeamPassingLeader.Item2.PassingCompletions,
        boxScore.GameLeaders.AwayTeamPassingLeader.Item2.PassingAttempts,
        boxScore.GameLeaders.AwayTeamPassingLeader.Item2.PassingYards,
        boxScore.GameLeaders.AwayTeamPassingLeader.Item2.PassingTouchdowns ]);
    }

    if (boxScore.GameLeaders.AwayTeamRushingLeader) {
      bs.leaders.awayRushingLeader = $filter('stringFormat')("{0} car, {1} yds, {2} tds", [
        $filter('getPlayerById')(boxScore.Players, boxScore.GameLeaders.AwayTeamRushingLeader.Item1, boxScore.AwayTeamSeasonId).LastName,
        boxScore.GameLeaders.AwayTeamRushingLeader.Item2.RushingAttempts,
        boxScore.GameLeaders.AwayTeamRushingLeader.Item2.RushingYards,
        boxScore.GameLeaders.AwayTeamRushingLeader.Item2.RushingTouchdowns]);
    }

    if (boxScore.GameLeaders.AwayTeamReceivingLeader) {
      bs.leaders.awayReceivingLeader = $filter('stringFormat')("{0} rec, {1} yds, {2} tds", [
        $filter('getPlayerById')(boxScore.Players, boxScore.GameLeaders.AwayTeamReceivingLeader.Item1, boxScore.AwayTeamSeasonId).LastName,
        boxScore.GameLeaders.AwayTeamReceivingLeader.Item2.ReceivingCatches,
        boxScore.GameLeaders.AwayTeamReceivingLeader.Item2.ReceivingYards,
        boxScore.GameLeaders.AwayTeamReceivingLeader.Item2.ReceivingTouchdowns]);
    }
  }
}

function populatePlayerStats(boxScore, bs) {
  bs.playerStats = { };
  bs.playerStats[boxScore.HomeTeamSeasonId] = {
    passingStats: boxScore.HomeTeamPassingStatistics,
    rushingStats: boxScore.HomeTeamRushingStatistics,
    receivingStats: boxScore.HomeTeamReceivingStatistics,
    defensiveStats: boxScore.HomeTeamDefensiveStatistics,
    kickingStats: boxScore.HomeTeamKickingStatistics,
    puntingStats: boxScore.HomeTeamPuntingStatistics,
    puntReturnStats: boxScore.HomeTeamPuntReturnStatistics,
    kickReturnStats: boxScore.HomeTeamKickReturnStatistics
  };

  bs.playerStats[boxScore.AwayTeamSeasonId] = {
    passingStats: boxScore.AwayTeamPassingStatistics,
    rushingStats: boxScore.AwayTeamRushingStatistics,
    receivingStats: boxScore.AwayTeamReceivingStatistics,
    defensiveStats: boxScore.AwayTeamDefensiveStatistics,
    kickingStats: boxScore.AwayTeamKickingStatistics,
    puntingStats: boxScore.AwayTeamPuntingStatistics,
    puntReturnStats: boxScore.AwayTeamPuntReturnStatistics,
    kickReturnStats: boxScore.AwayTeamKickReturnStatistics
  };
}

function populatePlayers(boxScore, bs, $filter) {
  bs.players = { };
  bs.players[boxScore.HomeTeamSeasonId] = $filter('filter')(boxScore.Players, { TeamSeasonId: boxScore.HomeTeamSeasonId });
  bs.players[boxScore.AwayTeamSeasonId] = $filter('filter')(boxScore.Players, { TeamSeasonId: boxScore.AwayTeamSeasonId });
}

angular.module('hsgc')
  .factory('HSGCApi', [ '$http', '$filter', '$timeout', function($http, $filter, $timeout) {
    var getFullBox = function(unityGameKey, publisherKey, sport) {
      var url = apiRoot + '/games/unity/' + unityGameKey + '?includeLeaders=true&includePlayByPlay=true&includePlayerStats=true&includeTeamAggregates=true';
      return $http.get(url).then(function(boxScore) {
        var bs = populateBaseInfo(boxScore.data);
        populateLeaderInfo(boxScore.data, bs, $filter);
        populatePlayerStats(boxScore.data, bs);
        populatePlayers(boxScore.data, bs, $filter);
        return bs;
      });
    }

    var getScores = function(unityGameKey, publisherKey, sport) {
      var url = apiRoot + 'games/unity/' + unityGameKey;
      return $http.get(url).then(function(boxScore) {
        return populateBaseInfo(boxScore.data);
      });
    }

    var getLeaders = function(unityGameKey, publisherKey, sport) {
      var url = apiRoot + 'games/unity/' + unityGameKey + '?includeLeaders=true';
      return $http.get(url).then(function(boxScore) {
        var bs = populateBaseInfo(boxScore.data);
        populateLeaderInfo(boxScore.data, bs, $filter);
        return bs;
      });
    }

    return {
      getScores : getScores,
      getLeaders : getLeaders,
      getFullBox : getFullBox
    };
  }]);