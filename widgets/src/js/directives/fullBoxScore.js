angular.module('hsgc')
  .directive('fullBoxScore', ['hsgcConfig', function(config) {
    return {
      restrict: 'AE',
      scope: {
        unityGameKey: "@game",
        publisherKey: "@publisher",
        sport: "@sport",
        showTeamLinks: "@showTeamLinks"
      },
      link: function(scope) {
        var listenerUnsubscribe = scope.$on('datacastLoaded', function() {
          config.fullBoxScoreFirstLoaded();
          listenerUnsubscribe();
          if (typeof(ga) !== "undefined") {
            ga('create', 'UA-27695189-2', 'auto', {
              'name': 'hsgcWidgets'
            });
            ga('hsgcWidgets.send', 'pageview', '/widgets/' + window.location.hostname + window.location.pathname + window.location.search);
          }
        });
      },
      templateUrl: 'templates/fullBoxScore.html'
    };
  }]);