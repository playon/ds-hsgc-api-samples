angular.module('hsgc')
	.directive('teamStats', function() {
		return {
			restrict: 'EA',
			templateUrl: 'templates/teamStatistics.html',
			link: function(scope, element, attrs) {
				scope.timeOfPossessionRegex = /^00:/;
			}
		};
	});