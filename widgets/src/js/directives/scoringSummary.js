angular.module('hsgc')
	.directive('scoringSummary', function() {
		return {
			restrict: 'EA',
			templateUrl: 'templates/scoringSummary.html'
		};
	});