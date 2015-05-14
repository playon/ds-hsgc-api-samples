angular.module('hsgc')
  .directive('scoreboard', ['$http', '$log', 'hsgcConfig', function($http, $log, config) {
    return {
      restrict: 'EA',
      templateUrl: 'templates/scoreboard.html',
      link: function(scope) {
        //$log.debug('Scoreboard key strategy set to: "'+ config.keyStrategy + '"');

        //todo: this really is very nfhs-network specific - should probably move this outside the core widget code
        if (config.keyStrategy == "unity") {
          $http.get(config.unityRoot + 'games/' + scope.gameKey)
            .success(function(data) {
              var videoAndData = false;
              for (var i = 0; i < data.publishers.length; i++) {
                if (data.publishers[i].key == scope.publisherKey || data.publishers[i].school_key == scope.publisherKey) {
                  if (data.publishers[i].broadcasts.length > 0 || data.publishers[i].vods.length > 0) {
                    videoAndData = true;
                  }
                }
              }
              scope.showStatus = !videoAndData;
            });
        } else {
          scope.showStatus = true;
        }
      }
    };
  }]);