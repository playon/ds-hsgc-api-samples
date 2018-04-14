angular.module('hsgc').filter('percentage', [
    '$window',
    function($window) {
        return function(input, decimals, prefix, suffix) {
            decimals = angular.isNumber(decimals) ? decimals : 3;
            suffix = suffix || '%';
            prefix = prefix || '';

            if ($window.isNaN(input) || !$window.isFinite(input)) {
                return '';
            }

            return (
                prefix +
                Math.round(input * Math.pow(10, decimals + 2)) /
                    Math.pow(10, decimals) +
                suffix
            );
        };
    }
]);
