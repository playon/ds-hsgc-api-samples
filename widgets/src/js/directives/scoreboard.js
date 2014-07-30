angular.module('hsgc')
  .directive('scoreboard', function() {
    return {
      restrict: 'EA',
      templateUrl: 'templates/scoreboard.html',
    };
  });