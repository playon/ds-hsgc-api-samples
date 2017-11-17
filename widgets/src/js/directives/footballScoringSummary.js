angular.module('hsgc')
	.directive('footballScoringSummary', function() {
		return {
			restrict: 'EA',
			templateUrl: 'templates/footballScoringSummary.html'
		};
	});