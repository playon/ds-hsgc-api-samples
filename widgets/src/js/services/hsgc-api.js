angular.module('hsgc')
  .factory('HSGCApi', [ '$http', '$q', '$timeout', function($http, $q, $timeout) {
    var getScores = function(unityGameKey, publisherKey, sport) {
      var url = 'http://api.gray.hsgamecenter.com/games/unity/' + unityGameKey;
      var extractScores = function(boxScore) {
        console.log(boxScore);
        return boxScore.HomeScore;
      };
      return $http.get(url).then(function(boxScore) {
        scores = { };
        scores[boxScore.data.HomeTeamSeasonId] = boxScore.data.HomeScore;
        scores[boxScore.data.AwayTeamSeasonId] = boxScore.data.AwayScore;
        unityTeamMapping = { };
        unityTeamMapping[boxScore.data.HomeTeamUnityKey] = boxScore.data.HomeTeamSeasonId;
        unityTeamMapping[boxScore.data.AwayTeamUnityKey] = boxScore.data.AwayTeamSeasonId;
        return {
          homeScore: boxScore.data.HomeScore,
          awayScore: boxScore.data.AwayScore,
          periodScores: boxScore.data.PeriodScores,
          regulationPeriodCount: boxScore.data.RegulationPeriodCount,
          totalScores: scores,
          awayPeriodScores: boxScore.data.AwayPeriodScores,
          homePeriodScores: boxScore.data.HomePeriodScores,
          homeLogo: "http://www.hsgamecenter.com/" + boxScore.data.HomeTeamLogo + "?width=30&height=30",
          awayLogo: "http://www.hsgamecenter.com/" + boxScore.data.AwayTeamLogo + "?width=30&height=30",
          homeName: boxScore.data.HomeTeamName,
          awayName: boxScore.data.AwayTeamName,
          unityTeamMapping: unityTeamMapping,
          getScore: function(unityKey) {
            var tsId = unityTeamMapping[unityKey];
            return scores[tsId];
          }
        }
      });
    }

    return {
      getScores : getScores
    };
  }]);