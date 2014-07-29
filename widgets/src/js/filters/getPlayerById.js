angular.module('hsgc')
  .filter('getPlayerById', function() {
    return function(players, playerId) {
      var i=0, len=players.length;
      for (; i<len; i++) {
        if (players[i].PlayerId == playerId) {
          return players[i];
        }
      }
      return null;
    }
  });