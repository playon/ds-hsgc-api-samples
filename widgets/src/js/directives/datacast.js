angular.module('hsgc')
  .directive('datacast', ['HSGCApi', function(HSGCApi) {
    return {
      restrict: 'EA',
      transclude: 'element',
      scope: {
        unityGameKey: "@datacast",
        publisherKey: "@publisher",
        sport: "@sport"
      },
      link: function(scope, element, attrs, ctrlr, transcludeFn) {
        transcludeFn(scope, function(clonedContent) {
          //clonedContent.addClass('test');
          element = element.replaceWith(clonedContent);
          element = clonedContent;
        });

        HSGCApi.getScores(scope.unityGameKey).then(function(result) {
          angular.extend(scope, result);
          //element.removeClass('test');
        });
      }
    };
  }]);
