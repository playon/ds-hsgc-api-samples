angular.module('hsgc').directive('scoreboard', [
    '$http',
    '$log',
    'hsgcConfig',
    function($http, $log, config) {
        return {
            restrict: 'EA',
            templateUrl: 'templates/scoreboard.html',
            link: function(scope) {
                $log.debug('Show Team Links:', config.showTeamLinks);
                scope.showTeamLinks = config.showTeamLinks;

                $log.debug('Scoreboard key strategy set', config.keyStrategy);

                //todo: this really is very NFHS Network specific—should probably move this outside the core widget code
                if (config.keyStrategy === 'unity') {
                    $http
                        .get(config.unityRoot + 'games/' + scope.gameKey)
                        .success(function(data) {
                            var videoAndData = false;
                            for (var i = 0; i < data.publishers.length; i++) {
                                if (
                                    data.publishers[i].key ==
                                        scope.publisherKey ||
                                    data.publishers[i].school_key ==
                                        scope.publisherKey
                                ) {
                                    if (
                                        data.publishers[i].broadcasts.length > 0
                                    ) {
                                        videoAndData = true;
                                    }
                                }
                            }
                            scope.showStatus = !videoAndData;
                        })
                        .error(function(data) {
                            $log.debug(
                                'Unity configuration for game',
                                scope.gameKey,
                                'could not be loaded. Defaulting to showing the game status.',
                                data
                            );
                            scope.showStatus = true;
                        });
                } else {
                    scope.showStatus = true;
                }
            }
        };
    }
]);
