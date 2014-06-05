angular.module('hsgc')
  .filter('getPlayerById', function() {
    return function(players, playerId, teamSeasonId) {
      var i=0, len=players.length;
      for (; i<len; i++) {
        if (players[i].PlayerId == playerId && players[i].TeamSeasonId == teamSeasonId) {
          return players[i];
        }
      }
      return null;
    }
  });