angular.module('hsgc')
  .factory('HSGCApi', [ '$http', '$filter', '$timeout', '$q', 'hsgcConfig', function($http, $filter, $timeout, $q, hsgcConfig) {
    var populateBaseInfo = function(boxScore) {
      scores = { };
      scores[boxScore.HomeTeamSeasonId] = boxScore.HomeScore;
      scores[boxScore.AwayTeamSeasonId] = boxScore.AwayScore;
      unityTeamMapping = { };

      unityTeamMapping[safeToLower(boxScore.HomeTeamUnityKey)] = boxScore.HomeTeamSeasonId;
      unityTeamMapping[safeToLower(boxScore.AwayTeamUnityKey)] = boxScore.AwayTeamSeasonId;
      colors = { };
      colors[safeToLower(boxScore.HomeTeamUnityKey)] = { primary: boxScore.HomeTeamPrimaryColor, secondary: boxScore.HomeTeamSecondaryColor };
      colors[safeToLower(boxScore.AwayTeamUnityKey)] = { primary: boxScore.AwayTeamPrimaryColor, secondary: boxScore.AwayTeamSecondaryColor };

      inOverTime = boxScore.CurrentPeriod > 4;
      homeOTScore = 0;
      awayOTScore = 0;
      if(inOverTime){
         for (var i = 4; i < boxScore.CurrentPeriod; i++) {
            homeOTScore += boxScore.HomePeriodScores[i].Score;
            awayOTScore += boxScore.AwayPeriodScores[i].Score;
         }
      }


      var homeLogoCompute = hsgcConfig.imageRoot + boxScore.HomeTeamLogo;
      if(boxScore.HomeTeamLogo.indexOf('http') == 0){
        //there's a bug with unity where it sometimes returns double urls
        //see: https://github.com/playon/unity-api/pull/163
        homeLogoCompute = boxScore.HomeTeamLogo.substring(boxScore.HomeTeamLogo.lastIndexOf('http'));
      }

      var awayLogoCompute = hsgcConfig.imageRoot + boxScore.AwayTeamLogo;
     if(boxScore.AwayTeamLogo.indexOf('http') == 0){
        //there's a bug with unity where it sometimes returns double urls
        //see: https://github.com/playon/unity-api/pull/163
        awayLogoCompute = boxScore.AwayTeamLogo.substring(boxScore.AwayTeamLogo.lastIndexOf('http'));
      }


      return {
        hsgcGameId: boxScore.GameId,
        hsgcHomeSchoolId: boxScore.HomeSchoolId,
        hsgcAwaySchoolId: boxScore.AwaySchoolId,
        homeTeamSeasonId: boxScore.HomeTeamSeasonId,
        awayTeamSeasonId: boxScore.AwayTeamSeasonId,
        homeTeamKey: boxScore.HomeTeamUnityKey,
        awayTeamKey: boxScore.AwayTeamUnityKey,
        homeScore: boxScore.HomeScore,
        awayScore: boxScore.AwayScore,
        periodScores: boxScore.PeriodScores,
        regulationPeriodCount: boxScore.RegulationPeriodCount,
        totalScores: scores,
        awayPeriodScores: boxScore.AwayPeriodScores,
        homePeriodScores: boxScore.HomePeriodScores,
        homeLogo: homeLogoCompute,
        awayLogo: awayLogoCompute,
        homeName: boxScore.HomeTeamName,
        awayName: boxScore.AwayTeamName,
        homeShortName: boxScore.HomeTeamShortName || boxScore.HomeTeamAcronym,
        awayShortName: boxScore.AwayTeamShortName || boxScore.AwayTeamAcronym,
        homeAcronym: boxScore.HomeTeamAcronym,
        awayAcronym: boxScore.AwayTeamAcronym,
        homeMascot: boxScore.HomeTeamMascot,
        awayMascot: boxScore.AwayTeamMascot,
        homeStats: boxScore.Sport == 'Football' ? boxScore.HomeTeamStatistics : boxScore.HomeTeamTotalStats,
        awayStats: boxScore.Sport == 'Football' ? boxScore.AwayTeamStatistics : boxScore.AwayTeamTotalStats,
        playByPlay: boxScore.PlaysInGame,
        scoringPlays: boxScore.ScoringPlays,
        currentPeriod: boxScore.CurrentPeriod,
        unityTeamMapping: unityTeamMapping,
        scoresAvailable: boxScore.ScoresAvailable,
        statsAvailable: boxScore.StatsAvailable,
        playByPlayAvailable: boxScore.PlayByPlayAvailable,
        leadersAvailable: boxScore.LeadersAvailable,
        status: boxScore.Status,
        statusDisplay: boxScore.StatusDisplay,
        colors: colors,
        inOverTime: inOverTime,
        awayOvertimeScore: awayOTScore,
        homeOvertimeScore: homeOTScore,
        gameDetailLink: boxScore.GameDetailLink,

        getScore: function(unityKey) {
          var tsId = this.unityTeamMapping[safeToLower(unityKey)];
          return this.totalScores[tsId];
        },
        getPrimaryColor: function(unityKey) {
          return colors[unityKey].primary; //todo: populate color based off api response
        },
        getTeamName: function(unityKey) {
          if (this.unityTeamMapping[safeToLower(unityKey)] ==this.homeTeamSeasonId) {
            return this.homeName;
          } else {
            return this.awayName;
          }
        },
        getTeamLogo: function(unityKey) {
          if (this.unityTeamMapping[safeToLower(unityKey)] == this.homeTeamSeasonId) {
            return this.homeLogo;
          } else {
            return this.awayLogo;
          }
        },
        isFinal: function() {
          return this.status == 'Complete';
        },
        isWinner: function (teamKey) {
          if (this.isFinal()) {
            if (this.homeScore > this.awayScore && this.unityTeamMapping[safeToLower(teamKey)] == this.homeTeamSeasonId) {
              return true;
            }
            if (this.homeScore < this.awayScore && this.unityTeamMapping[safeToLower(teamKey)] == this.awayTeamSeasonId) {
              return true;
            }
          }
          return false;
        }
      }
    };

    var populateLeaderInfo = function(boxScore, bs, $filter) {
      if (boxScore.Sport == 'Basketball') {
        if (bs.statsAvailable) {
          bs.leadersAvailable = true;
          bs.leaders = {};
          bs.leaders[bs.homeTeamSeasonId] = {
            points: { value: 0 },
            rebounds: { value: 0 },
            assists: { value: 0 }
          };
          bs.leaders[bs.awayTeamSeasonId] = {
            points: { value: 0 },
            rebounds: { value: 0 },
            assists: { value: 0 }
          };

          boxScore.PlayerStatistics.forEach(function(ps) {
            if (ps.PlayerId > 0) {
              if (bs.leaders[ps.TeamSeasonId].points.value < ps.TotalPoints) {
                bs.leaders[ps.TeamSeasonId].points.value = ps.TotalPoints;
                bs.leaders[ps.TeamSeasonId].points.firstName = ps.FirstName;
                bs.leaders[ps.TeamSeasonId].points.lastName = ps.LastName;
                bs.leaders[ps.TeamSeasonId].points.jerseyNumber = ps.JerseyNumber;
              }
              if (bs.leaders[ps.TeamSeasonId].rebounds.value < ps.TotalRebounds) {
                bs.leaders[ps.TeamSeasonId].rebounds.value = ps.TotalRebounds;
                bs.leaders[ps.TeamSeasonId].rebounds.firstName = ps.FirstName;
                bs.leaders[ps.TeamSeasonId].rebounds.lastName = ps.LastName;
                bs.leaders[ps.TeamSeasonId].rebounds.jerseyNumber = ps.JerseyNumber;
              }
              if (bs.leaders[ps.TeamSeasonId].assists.value < ps.Assists) {
                bs.leaders[ps.TeamSeasonId].assists.value = ps.Assists;
                bs.leaders[ps.TeamSeasonId].assists.firstName = ps.FirstName;
                bs.leaders[ps.TeamSeasonId].assists.lastName = ps.LastName;
                bs.leaders[ps.TeamSeasonId].assists.jerseyNumber = ps.JerseyNumber;
              }
            }
          });
        }
        return;
      }

      if (bs.leadersAvailable) {
        bs.leaders = { };

        if (boxScore.GameLeaders.HomeTeamPassingLeader) {
          bs.leaders.homePassingLeader = $filter('stringFormat')("{0} {1}-{2}, {3} yds, {4} tds", [
            $filter('getPlayerById')(bs.players, boxScore.GameLeaders.HomeTeamPassingLeader.Item1, boxScore.HomeTeamSeasonId).LastName,
            boxScore.GameLeaders.HomeTeamPassingLeader.Item2.PassingCompletions,
            boxScore.GameLeaders.HomeTeamPassingLeader.Item2.PassingAttempts,
            boxScore.GameLeaders.HomeTeamPassingLeader.Item2.PassingYards,
            boxScore.GameLeaders.HomeTeamPassingLeader.Item2.PassingTouchdowns ]);
        }

        if (boxScore.GameLeaders.HomeTeamRushingLeader) {
          bs.leaders.homeRushingLeader = $filter('stringFormat')("{0} {1} car, {2} yds, {3} tds", [
            $filter('getPlayerById')(bs.players, boxScore.GameLeaders.HomeTeamRushingLeader.Item1, boxScore.HomeTeamSeasonId).LastName,
            boxScore.GameLeaders.HomeTeamRushingLeader.Item2.RushingAttempts,
            boxScore.GameLeaders.HomeTeamRushingLeader.Item2.RushingYards,
            boxScore.GameLeaders.HomeTeamRushingLeader.Item2.RushingTouchdowns]);
        }

        if (boxScore.GameLeaders.HomeTeamReceivingLeader) {
          bs.leaders.homeReceivingLeader = $filter('stringFormat')("{0} {1} rec, {2} yds, {3} tds", [
            $filter('getPlayerById')(bs.players, boxScore.GameLeaders.HomeTeamReceivingLeader.Item1, boxScore.HomeTeamSeasonId).LastName,
            boxScore.GameLeaders.HomeTeamReceivingLeader.Item2.ReceivingCatches,
            boxScore.GameLeaders.HomeTeamReceivingLeader.Item2.ReceivingYards,
            boxScore.GameLeaders.HomeTeamReceivingLeader.Item2.ReceivingTouchdowns]);
        }

        if (boxScore.GameLeaders.AwayTeamPassingLeader) {
          bs.leaders.awayPassingLeader = $filter('stringFormat')("{0} {1}-{2}, {3} yds, {4} tds", [
            $filter('getPlayerById')(bs.players, boxScore.GameLeaders.AwayTeamPassingLeader.Item1, boxScore.AwayTeamSeasonId).LastName,
            boxScore.GameLeaders.AwayTeamPassingLeader.Item2.PassingCompletions,
            boxScore.GameLeaders.AwayTeamPassingLeader.Item2.PassingAttempts,
            boxScore.GameLeaders.AwayTeamPassingLeader.Item2.PassingYards,
            boxScore.GameLeaders.AwayTeamPassingLeader.Item2.PassingTouchdowns ]);
        }

        if (boxScore.GameLeaders.AwayTeamRushingLeader) {
          bs.leaders.awayRushingLeader = $filter('stringFormat')("{0} {1} car, {2} yds, {3} tds", [
            $filter('getPlayerById')(bs.players, boxScore.GameLeaders.AwayTeamRushingLeader.Item1, boxScore.AwayTeamSeasonId).LastName,
            boxScore.GameLeaders.AwayTeamRushingLeader.Item2.RushingAttempts,
            boxScore.GameLeaders.AwayTeamRushingLeader.Item2.RushingYards,
            boxScore.GameLeaders.AwayTeamRushingLeader.Item2.RushingTouchdowns]);
        }

        if (boxScore.GameLeaders.AwayTeamReceivingLeader) {
          bs.leaders.awayReceivingLeader = $filter('stringFormat')("{0} {1} rec, {2} yds, {3} tds", [
            $filter('getPlayerById')(bs.players, boxScore.GameLeaders.AwayTeamReceivingLeader.Item1, boxScore.AwayTeamSeasonId).LastName,
            boxScore.GameLeaders.AwayTeamReceivingLeader.Item2.ReceivingCatches,
            boxScore.GameLeaders.AwayTeamReceivingLeader.Item2.ReceivingYards,
            boxScore.GameLeaders.AwayTeamReceivingLeader.Item2.ReceivingTouchdowns]);
        }
      }
    };

    var safeToLower = function(toLower){
      if(typeof(toLower) == "undefined"){
        return "";
      }
      else{
        return toLower.toLowerCase();
      }
    };

    var populatePlayerStats = function(boxScore, bs) {
      bs.playerStats = { };
      if (boxScore.Sport == 'Basketball') {
        bs.playerStats[boxScore.HomeTeamSeasonId] = boxScore.HomeTeamPlayerStats;
        bs.playerStats[boxScore.AwayTeamSeasonId] = boxScore.AwayTeamPlayerStats;
        return;
      }
      //football
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

    var getFullBox = function(unityGameKey, publisherKey, sport, options) {
      if (sport == "Football" || sport == "Basketball") {
        var config = { params: { } };
        angular.extend(config.params, options);

        var url = hsgcConfig.apiRoot + 'games/thirdparty/' + hsgcConfig.keyStrategy + '/' + unityGameKey;
        return $http.get(url, config).then(
          //success
          function(boxScore) {
            var bs = populateBaseInfo(boxScore.data);
            populatePlayers(boxScore.data, bs, $filter);
            populateLeaderInfo(boxScore.data, bs, $filter);
            populatePlayerStats(boxScore.data, bs);
            return bs;
          },
          //error
          function(response) {
            hsgcConfig.datacastLoadError(response.data, response.status, response.statusText);
            var result = {
              status: response.status,
              statusText: response.statusText
            };

            if (response.status == 402) {
              result.boxScore = populateBaseInfo(response.data);
              hsgcConfig.datacastPaymentRequired(response.data);
            }
            return $q.reject(result);
          });
      } else {
        //I don't know how to return an empty promise
        var deferred = $q.defer();
        deferred.resolve();
        return deferred.promise;
      }
    }

    return {
      getFullBox : getFullBox
    };
  }]);