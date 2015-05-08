angular.module('hsgc')
  .directive('volleyballHitChart', [ '$window', '$log', function($window, $log) {
    return {
      restrict: 'EA',
      templateUrl: 'templates/volleyballHitChart.html',
      link: function(scope, element) {
        scope.selectedHitChartPeriod = 0;
        scope.tooltip = { description: '', x: 0, y: 0 };
        var firstLoad = true,
            previousPeriod = -1,
            // bind template elements that aren't simply bindable to values
            canvas = null,
            // border contants
            courtPerimeter = { x: 20, y: 10 }
            ;

        scope.$on('datacastLoaded', function() {
          if (firstLoad) {
            firstLoad = false;
            scope.selectedHitChartPeriod = null;  // default to All Games
            previousPeriod = scope.currentPeriod; // default to current period

            // set background image on the canvas
            canvas = element.find('canvas');
            // $log.debug(canvas);

            scope.$watch(function() { 
                return $window.innerWidth; 
              }, scope.resize);
            //scope.$on('$destory', function() { canvas.off('resize'); });  // remove the resize listener from the canvas to prevent memory leak

            paper.setup(canvas[0]);
            // call resize now to get the base size to use for the court loading
            scope.resize();

            // copy the appropriately sized volleyball image as a raster to the canvas
            new paper.Raster(canvas.width() >= 1280 ? 'http://cdn.hsgamecenter.com/img/volleyball-court-1280x640.png' :
              'http://cdn.hsgamecenter.com/img/volleyball-court-640x320.png');
          }

          var periods = [];
          for (var i = 1; i <= scope.currentPeriod; i++) {
            periods.push({ value: i, display: i });
          }
          scope.hitChartPeriods = periods;
        });

        scope.resize = function() {
          var width = canvas.width(),
              // scale height to half of the width (court image is always a 2:1 ratio) then add a little padding for the perimeter
              height = (width / 2) + (courtPerimeter.y * 2);
          $log.debug(width, height);

          canvas.height(height);
          paper.view.viewSize = new paper.Size(width, height);

          // if (delegate) { delegate.apply() };
/* put this in calls not in digest already
          scope.$apply(function(){
             //do something to update current scope based on the new datas and let angular update the view.
          });
*/
        }

        scope.getLogo = function(play) {
          return play.TeamSeasonId == scope.homeTeamSeasonId ? scope.homeLogo : scope.awayLogo;
        };

        scope.getShotLeft = function(shot) {
          //the image used here does not have the same ratio as a regulation high school court
          //the percentage returned by the service assumes a court size of 84'x50', but our image is 637x424, so scale the x percentage appropriately
          var xScale = (84.0 / 50.0) / (637.0 / 424.0);
          var percent = shot.X * 100 * xScale;
          if (shot.TeamSeasonId != scope.awayTeamSeasonId) {
            percent = 100 - percent;
          }
          return percent;
        };
      }
    };
  }])
  .filter('filterShots', function() {
    return function(plays, awayPlayerFilter, homePlayerFilter, period, includeMade, includeMissed) {
      var shots = [];
      if (typeof(plays) != "undefined") {
        for (var i = 0; i < plays.length; i++) {
          if (plays[i].IsShot) {
            if (awayPlayerFilter != null && typeof(awayPlayerFilter) != "undefined" && plays[i].TeamSeasonId == awayPlayerFilter.TeamSeasonId && plays[i].PlayerId != awayPlayerFilter.PlayerId) {
              continue;
            }
            if (homePlayerFilter != null && typeof(homePlayerFilter) != "undefined" && plays[i].TeamSeasonId == homePlayerFilter.TeamSeasonId && plays[i].PlayerId != homePlayerFilter.PlayerId) {
              continue;
            }
            if (period != null && typeof(period) !== "undefined" && plays[i].GameNumber != period) {
              continue;
            }
            shots.push(plays[i]);
          }
        }
      }

      return shots;
    };
  });