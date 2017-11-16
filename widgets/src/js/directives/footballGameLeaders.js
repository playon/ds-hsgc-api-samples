angular.module('hsgc')
	.directive('gameLeaders', function() {
		return {
			restrict: 'EA',
			templateUrl: 'templates/footballGameLeaders.html'
		};
	});