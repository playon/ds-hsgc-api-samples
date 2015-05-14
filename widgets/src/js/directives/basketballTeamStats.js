angular.module('hsgc')
	.directive('basketballTeamStats', [function() {
		return {
			restrict: 'EA',
			require: '^datacast',
			templateUrl: 'templates/basketballTeamStats.html'
		};
	}]);