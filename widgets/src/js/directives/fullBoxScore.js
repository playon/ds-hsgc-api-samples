angular.module('hsgc')
  .directive('fullBoxScore', function() {
    return {
      restrict: 'AE',
      transclude: true,
      scope: { unityGameKey: "@game", publisherKey: "@publisher" },
      templateUrl: 'templates/fullBoxScore.html',
      replace: true
    };
  });
