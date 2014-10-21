angular.module('hsgc')
  .directive('fullBoxScore',['$location', function($location) {
    return {
      restrict: 'AE',
      scope: {
        unityGameKey: "@game",
        publisherKey: "@publisher",
        sport: "@sport"
      },
      link: function(scope) {
        var listenerUnsubscribe = scope.$on('datacastLoaded', function() {
          hsgcWidgets.fullBoxScoreFirstLoaded();
          listenerUnsubscribe();
        });
      },
      templateUrl: 'templates/fullBoxScore.html'
    };
  }]);