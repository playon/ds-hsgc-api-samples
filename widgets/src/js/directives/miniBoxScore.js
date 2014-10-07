angular.module('hsgc')
  .directive('miniBoxScore', function() {
        return {
      restrict: 'AE',
      scope: {
        unityGameKey: "@game",
        sport: "@sport"
      },
      link: function(scope) {
        var listenerUnsubscribe = scope.$on('datacastLoaded', function() {
          listenerUnsubscribe();
        });
      },
      templateUrl: 'templates/miniBoxScore.html'
    };
  });