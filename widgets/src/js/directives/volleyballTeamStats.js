angular.module('hsgc')
	.directive('volleyballTeamStats', [function() {
		return {
			restrict: 'EA',
			require: '^datacast',
			templateUrl: 'templates/volleyballTeamStats.html'
		};
	}]);