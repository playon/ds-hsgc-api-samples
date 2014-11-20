angular.module('hsgc')
  .directive('fullBoxScore', ['hsgcConfig', function(config) {
    return {
      restrict: 'AE',
      scope: {
        unityGameKey: "@game",
        publisherKey: "@publisher",
        sport: "@sport"
      },
      link: function(scope) {
        var listenerUnsubscribe = scope.$on('datacastLoaded', function() {
          config.fullBoxScoreFirstLoaded();
          listenerUnsubscribe();
        });
      },
      templateUrl: 'templates/fullBoxScore.html'
    };
  }]);