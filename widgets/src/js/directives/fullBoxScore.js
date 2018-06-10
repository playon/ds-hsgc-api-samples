angular.module('hsgc').directive('fullBoxScore', [
    'hsgcConfig',
    '$log',
    function(config, $log) {
        return {
            restrict: 'AE',
            scope: {
                gameKey: '@game',
                publisherKey: '@publisher',
                sport: '@sport',
                showTeamLinks: '@showTeamLinks'
            },
            link: function(scope) {
                // setup an initializer function to run only once upon first successful load of the game data
                var listenerUnsubscribe = scope.$on(
                    'datacastLoaded',
                    function() {
                        config.fullBoxScoreFirstLoaded();
                        listenerUnsubscribe();
                        if (typeof ga !== 'undefined' && config.gaTracker) {
                            ga('create', config.gaTracker, 'auto', {
                                name: 'hsgcWidgets'
                            });
                            ga(
                                'hsgcWidgets.send',
                                'pageview',
                                '/widgets/' +
                                    window.location.hostname +
                                    window.location.pathname +
                                    window.location.search
                            );
                        }
                    }
                );

                // setup analytics heartbeat
                if (typeof ga !== 'undefined' && config.gaTracker) {
                    var runCountdown = 10; // this number * default refresh (usually 30 seconds)
                    scope.$on('datacastLoaded', function() {
                        // runs on each datacast refresh, but that's a bit overkill; slow it down some
                        if (--runCountdown <= 0) {
                            $log.debug('Sending GA heartbeat');
                            ga(
                                'send',
                                'event',
                                'heartbeat',
                                'heartbeat',
                                'stats',
                                { nonInteraction: true }
                            );
                            runCountdown = 10;
                        } else {
                            $log.debug(
                                'Skipping GA heartbeat until this countdown is below zero: ',
                                runCountdown
                            );
                        }
                    });
                }
            },
            templateUrl: 'templates/fullBoxScore.html'
        };
    }
]);
