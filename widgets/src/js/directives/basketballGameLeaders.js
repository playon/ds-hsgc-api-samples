angular.module('hsgc')
	.directive('basketballGameLeaders', function() {
		return {
			restrict: 'EA',
			templateUrl: 'templates/basketballGameLeaders.html'
		};
	});