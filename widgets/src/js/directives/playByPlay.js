angular.module('hsgc')
  .directive('playByPlay', function() {
    return {
      restrict: 'EA',
      templateUrl: 'templates/playByPlay.html',
      link: function(scope) {
        scope.selectedPeriod = 1;
        var firstLoad = true;
        var previousPeriod = -1;
        scope.$on('datacastLoaded', function() {
          if (firstLoad) {
            firstLoad = false;
            if (!scope.isFinal()) {
              scope.selectedPeriod = scope.currentPeriod;
            }
            previousPeriod = scope.currentPeriod;
          } else {
            if (!scope.isFinal()) {
              if (previousPeriod != scope.currentPeriod) {
                previousPeriod = scope.currentPeriod;
                scope.selectedPeriod = scope.currentPeriod;
              }
            }
          }
        });
      }
    };
  });