angular.module('hsgc').filter('timeOnClock', function() {
    return function(seconds) {
        var minutes = Math.floor(seconds / 60);
        var sec = seconds % 60;
        return minutes + ':' + ('0' + sec).slice(-2);
    };
});
