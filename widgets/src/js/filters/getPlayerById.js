angular.module('hsgc')
  .filter('getPlayerById', function() {
    return function(players, playerId, teamSeasonId) {
      if (typeof(players[teamSeasonId]) === "undefined") {
        return {
          PlayerId: playerId,
          TeamSeasonId: teamSeasonId,
          FirstName: "Team",
          LastName: "",
          JerseyNumber: "",
          DisplayName: ""
        };
      }
      var i = 0,
        len = players[teamSeasonId].length;
      for (; i < len; i++) {
        if (players[teamSeasonId][i].PlayerId == playerId) {
          return players[teamSeasonId][i];
        }
      }

      return {
        PlayerId: playerId,
        TeamSeasonId: teamSeasonId,
        FirstName: "Team",
        LastName: "",
        JerseyNumber: "",
        DisplayName: ""
      };
    }
  });