angular.module('hsgc').filter('timeOnClock', function() {
    return function(seconds) {
        // convert seconds into 'm:ss'
        var minutes = Math.floor(seconds / 60);
        var sec = Math.round(seconds) % 60;
        return minutes + ':' + (sec > 9 ? sec : '0' + sec);
    };
});
