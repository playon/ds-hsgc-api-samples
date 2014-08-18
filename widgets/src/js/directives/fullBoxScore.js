angular.module('hsgc')
  .directive('fullBoxScore', function() {
    return {
      restrict: 'AE',
      scope: {
        unityGameKey: "@game",
        publisherKey: "@publisher",
        sport: "@sport"
      },
      link: function(scope) {
        var listenerUnsubscribe = scope.$on('datacastLoaded', function() {
          if (typeof(nfhs) != "undefined" && typeof(nfhs.analytics) != "undefined") {
            console.log('sending pageview(data)');
            nfhs.analytics.sendPageView('data');
          }
          listenerUnsubscribe();
        });
      },
      templateUrl: 'templates/fullBoxScore.html'
    };
  });