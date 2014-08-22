angular.module('hsgc')
  .factory('HSGCApi', [ '$http', '$filter', '$timeout', function($http, $filter, $timeout) {
    var populateBaseInfo = function(boxScore) {
      scores = { };
      scores[boxScore.HomeTeamSeasonId] = boxScore.HomeScore;
      scores[boxScore.AwayTeamSeasonId] = boxScore.AwayScore;
      unityTeamMapping = { };
      unityTeamMapping[boxScore.HomeTeamUnityKey.toLowerCase()] = boxScore.HomeTeamSeasonId;
      unityTeamMapping[boxScore.AwayTeamUnityKey.toLowerCase()] = boxScore.AwayTeamSeasonId;
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
        currentPeriod: boxScore.CurrentPeriod,
        unityTeamMapping: unityTeamMapping,
        scoresAvailable: boxScore.ScoresAvailable,
        statsAvailable: boxScore.StatsAvailable,
        playByPlayAvailable: boxScore.PlayByPlayAvailable,
        leadersAvailable: boxScore.LeadersAvailable,
        status: boxScore.Status,
        getScore: function(unityKey) {
          var tsId = this.unityTeamMapping[unityKey.toLowerCase()];
          return this.totalScores[tsId];
        },
        getPrimaryColor: function(unityKey) {
          return '#ffffff'; //todo: populate color based off api response
        },
        getTeamName: function(unityKey) {
          if (this.unityTeamMapping[unityKey.toLowerCase()] ==this.homeTeamSeasonId) {
            return this.homeName;
          } else {
            return this.awayName;
          }
        },
        getTeamLogo: function(unityKey) {
          if (this.unityTeamMapping[unityKey.toLowerCase()] == this.homeTeamSeasonId) {
            return "http://www.hsgamecenter.com/" + boxScore.HomeTeamLogo + "?width=52&height=52";
          } else {
            return "http://www.hsgamecenter.com/" + boxScore.AwayTeamLogo + "?width=52&height=52";
          }
        },
        isFinal: function() {
          return this.status == 'Complete';
        },
        isWinner: function (teamKey) {
          if (this.isFinal()) {
            if (this.homeScore > this.awayScore && this.unityTeamMapping[teamKey.toLowerCase()] == this.homeTeamSeasonId) {
              return true;
            }
            if (this.homeScore < this.awayScore && this.unityTeamMapping[teamKey.toLowerCase()] == this.awayTeamSeasonId) {
              return true;
            }
          }
          return false;
        }
      }
    };

    var populateLeaderInfo = function(boxScore, bs, $filter) {
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
          bs.leaders.homeRushingLeader = $filter('stringFormat')("{0} {1} car, {2} yds, {3} tds", [
            $filter('getPlayerById')(boxScore.Players, boxScore.GameLeaders.HomeTeamRushingLeader.Item1, boxScore.HomeTeamSeasonId).LastName,
            boxScore.GameLeaders.HomeTeamRushingLeader.Item2.RushingAttempts,
            boxScore.GameLeaders.HomeTeamRushingLeader.Item2.RushingYards,
            boxScore.GameLeaders.HomeTeamRushingLeader.Item2.RushingTouchdowns]);
        }

        if (boxScore.GameLeaders.HomeTeamReceivingLeader) {
          bs.leaders.homeReceivingLeader = $filter('stringFormat')("{0} {1} rec, {2} yds, {3} tds", [
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
          bs.leaders.awayRushingLeader = $filter('stringFormat')("{0} {1} car, {2} yds, {3} tds", [
            $filter('getPlayerById')(boxScore.Players, boxScore.GameLeaders.AwayTeamRushingLeader.Item1, boxScore.AwayTeamSeasonId).LastName,
            boxScore.GameLeaders.AwayTeamRushingLeader.Item2.RushingAttempts,
            boxScore.GameLeaders.AwayTeamRushingLeader.Item2.RushingYards,
            boxScore.GameLeaders.AwayTeamRushingLeader.Item2.RushingTouchdowns]);
        }

        if (boxScore.GameLeaders.AwayTeamReceivingLeader) {
          bs.leaders.awayReceivingLeader = $filter('stringFormat')("{0} {1} rec, {2} yds, {3} tds", [
            $filter('getPlayerById')(boxScore.Players, boxScore.GameLeaders.AwayTeamReceivingLeader.Item1, boxScore.AwayTeamSeasonId).LastName,
            boxScore.GameLeaders.AwayTeamReceivingLeader.Item2.ReceivingCatches,
            boxScore.GameLeaders.AwayTeamReceivingLeader.Item2.ReceivingYards,
            boxScore.GameLeaders.AwayTeamReceivingLeader.Item2.ReceivingTouchdowns]);
        }
      }
    };

    var populatePlayerStats = function(boxScore, bs) {
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
    };

    var populatePlayers = function(boxScore, bs, $filter) {
      bs.players = { };
      bs.players[boxScore.HomeTeamSeasonId] = $filter('filter')(boxScore.Players, { TeamSeasonId: boxScore.HomeTeamSeasonId });
      bs.players[boxScore.AwayTeamSeasonId] = $filter('filter')(boxScore.Players, { TeamSeasonId: boxScore.AwayTeamSeasonId });
    };

    var getFullBox = function(unityGameKey, publisherKey, sport) {
      var url = hsgcWidgets.apiRoot + 'games/unity/' + unityGameKey + '?includeLeaders=true&includePlayByPlay=true&includePlayerStats=true&includeTeamAggregates=true';
      return $http.get(url).then(function(boxScore) {
        var bs = populateBaseInfo(boxScore.data);
        populateLeaderInfo(boxScore.data, bs, $filter);
        populatePlayerStats(boxScore.data, bs);
        populatePlayers(boxScore.data, bs, $filter);
        return bs;
      });
    }

    var getScores = function(unityGameKey, publisherKey, sport) {
      var url = hsgcWidgets.apiRoot + 'games/unity/' + unityGameKey;
      return $http.get(url).then(function(boxScore) {
        return populateBaseInfo(boxScore.data);
      });
    }

    var getLeaders = function(unityGameKey, publisherKey, sport) {
      var url = hsgcWidgets.apiRoot + 'games/unity/' + unityGameKey + '?includeLeaders=true';
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