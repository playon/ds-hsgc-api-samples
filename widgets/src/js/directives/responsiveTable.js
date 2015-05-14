angular.module('hsgc')
  .directive('responsiveTable', ['$window', '$compile', function($window, $compile) {
    return {
      restrict: 'A',
      transclude: 'element',
      priority: 1001,
      terminal: true,
      link: function link($scope, el, iAttrs, controller, $transclude) {
        var wrapper = angular.element('<div class="nfhs-scout-responsive-table-wrapper" />');
        var scrollable = angular.element('<div class="nfhs-scout-table-scrollable" />');
        var pinned = angular.element('<div class="nfhs-scout-table-pinned" />');
        wrapper.append(scrollable).append(pinned);
        el.replaceWith(wrapper);
        $transclude($scope, function(clone, innerScope) {
          scrollable.append(clone.addClass('nfhs-scout-table-responsive'));
        });
        $transclude($scope, function(clone, innerScope) {
          pinned.append(clone);
        });
      }
    };
  }]);