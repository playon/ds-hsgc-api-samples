angular.module('hsgc').filter('getPlayerShortNameById', function() {
    return function(players, playerId, teamSeasonId) {
        var foundPlayer = {
                PlayerId: playerId,
                TeamSeasonId: teamSeasonId,
                FirstName: '',
                LastName: 'Team',
                JerseyNumber: '',
                DisplayName: 'Team'
            },
            i = 0,
            len = 0;
        if (typeof players[teamSeasonId] !== 'undefined') {
            len = players[teamSeasonId].length;
            for (; i < len; i++) {
                if (
                    players[teamSeasonId][i] !== null &&
                    players[teamSeasonId][i].PlayerId == playerId
                ) {
                    foundPlayer = players[teamSeasonId][i];
                    break;
                }
            }
        }

        return foundPlayer.DisplayName;
    };
});
