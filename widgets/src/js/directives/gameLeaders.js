angular.module('hsgc')
  .directive('gameLeaders', function() {
    return {
      restrict: 'EA',
      templateUrl: 'templates/gameLeaders.html'
    };
  });