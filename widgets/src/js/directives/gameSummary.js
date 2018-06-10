angular.module('hsgc').directive('gameSummary', ['$location', function($location) {
    return {
        restrict: 'AE',
        scope: {
            gameKey: '@game',
            publisherKey: '@publisher',
            sport: '@'
        },
        controller: [
            '$scope',
            '$element',
            'HSGCApi',
            '$log',
            '$timeout',
            'hsgcConfig',
            function($scope, $element, HSGCApi, $log, $timeout, config) {
                $scope.apiKey = null;
                // try to get game key and/or apiKey from the request parameters
                if (!$scope.gameKey) {
                    $scope.gameKey = $location.search().gameKey;
                }
                if (config.keyStrategy === "ds-key" && !$scope.apiKey) {
                    $scope.apiKey = $location.search().apiKey;
                }

                var setNextUpdate = function(refreshIn) {
                    $timeout(updateBoxScore, refreshIn);
                };

                var updateBoxScore = function() {
                    HSGCApi.getFullBox(
                        $scope.gameKey,
                        $scope.publisherKey,
                        $scope.apiKey,
                        $scope.sport,
                        {
                            includeTeamAggregates: true,
                            // TODO: remove this temporary fix to match datacast so browser caching can be used, once they share a datacast update/refresh handler and/or observer
                            includeLeaders: true,
                            includePlayByPlay: true,
                            includePlayerStats: true,
                            includePlayers: true
                        }
                    ).then(
                        function(result) {
                            if (typeof result !== 'undefined') {
                                // success
                                angular.extend($scope, result);

                                // stop refreshing once game is complete; may miss edits, but those are rare so, meh
                                if (result.status !== 'Complete') {
                                    setNextUpdate(30 * 1000);
                                } else {
                                    $log.debug(
                                        'Game complete. Stopping auto-refresh.'
                                    );
                                }
                            }
                        },
                        function(result) {
                            // error
                            if (result.status == 402) {
                                // need to pay; will likely need to navigate away anyway, so just stop trying to refresh, and show upsell
                                $log.warning('402 Payment Required');
                                $scope.paymentRequired = true;
                                angular.extend($scope, result.boxScore);
                            } else {
                                // not sure what went wrong; try again in a little while
                                $log.error(
                                    'Datacast could not be loaded. Will try again. Status code:',
                                    result.status,
                                    result
                                );
                                setNextUpdate(120 * 1000);
                            }
                        }
                    );
                };

                config.beforeLoadDatacast(
                    $scope.gameKey,
                    $scope.publisherKey,
                    function() {
                        updateBoxScore();
                    }
                );
            }
        ],
        templateUrl: 'templates/gameSummary.html'
    };
}]);
