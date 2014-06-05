angular.module('hsgc')
  .filter('timeOnClock', function() {
    return function(seconds) {
      var minutes = Math.floor(seconds/60);
      var seconds = seconds % 60;
      return minutes + ':' + ("0" + seconds).slice(-2);;
    };
  });