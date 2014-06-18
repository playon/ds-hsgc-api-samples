angular.module('hsgc')
  .filter('rosterPlayersToDisplay', function() {
    return function(players) {
      var realPlayers = [];
      if (players) {
        for (var i = 0; i < players.length; i++) {
          if (players[i].PlayerId > 0 && players[i].FirstName && players[i].LastName) {
            realPlayers.push(players[i]);
          }
        }
      }
      return realPlayers;
    }
  });
