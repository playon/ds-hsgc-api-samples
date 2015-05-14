angular.module('hsgc')
	.directive('basketballPlayerStats', [function() {
		return {
			restrict: 'EA',
			require: '^datacast',
			templateUrl: 'templates/basketballPlayerStats.html'
		};
	}]);