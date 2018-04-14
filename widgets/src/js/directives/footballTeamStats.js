angular.module('hsgc')
	.directive('footballTeamStats', function() {
		return {
			restrict: 'EA',
			templateUrl: 'templates/footballTeamStats.html',
			link: function(scope/*, element, attrs*/) {
				scope.timeOfPossessionRegex = /^00:/;
			}
		};
	});
