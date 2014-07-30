angular.module('hsgc')
  .directive('teamStats', function() {
    return {
      restrict: 'EA',
      templateUrl: 'templates/teamStatistics.html'
    };
  });