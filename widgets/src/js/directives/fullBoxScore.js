angular.module('hsgc')
  .directive('fullBoxScore', function() {
    return {
      restrict: 'AE',
      scope: {
        unityGameKey: "@game",
        publisherKey: "@publisher",
        sport: "@sport",
      },
      link: function(scope) {
        var listenerUnsubscribe = scope.$on('datacastLoaded', function() {
          hsgcWidgets.datacastLoaded();
          listenerUnsubscribe();
        });
      },
      templateUrl: 'templates/fullBoxScore.html'
    };
  });