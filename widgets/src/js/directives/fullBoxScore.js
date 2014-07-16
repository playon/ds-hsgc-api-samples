angular.module('hsgc')
  .directive('fullBoxScore', function() {
    return {
      restrict: 'AE',
      transclude: true,
      scope: {
        unityGameKey: "@game",
        publisherKey: "@publisher"
      },
      controller: ['$scope', function($scope) {
        $scope.getSubscribeUrl = function(dataOnly) {
          var base = '/subscribe/';

          var qs = '?' +
            'publisher_key=' + $scope.publisherKey +
            '&game_key=' + $scope.unityGameKey +
            '&referrer=' + encodeURIComponent(window.location.href);

          var subscriptionType = 'event';
          if (dataOnly) {
            subscriptionType = 'stats';
          }
          return base + subscriptionType + qs;
        };
      }],
      templateUrl: 'templates/fullBoxScore.html',
      replace: true
    };
  });
