angular.module('hsgc')
  .directive('volleyballPlayerStats', [function() {
    return {
      restrict: 'EA',
      require: '^datacast',
      templateUrl: 'templates/volleyballPlayerStats.html'
    };
  }]);
