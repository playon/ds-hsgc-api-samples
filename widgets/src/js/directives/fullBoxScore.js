angular.module('hsgc')
  .directive('fullBoxScore', function() {
    return {
      restrict: 'AE',
      scope: {
        unityGameKey: "@game",
        publisherKey: "@publisher",
        sport: "@sport"
      },
      templateUrl: 'templates/fullBoxScore.html'
    };
  });