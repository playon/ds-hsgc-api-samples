angular.module('hsgc')
  .directive('footballDriveChart', ['$window', '$log', function($window, $log) {
    return {
      restrict: 'EA',
      templateUrl: 'templates/footballDriveChart.html',
      link: function(scope, element) {
        scope.selectedPeriod = 0;
        scope.lastPlay = {};
        scope.previousPlay = {};
        var paper = typeof(window.paper) === 'undefined' ? null : window.paper;
        var firstload = true;
        var footballFieldCanvas = null;

        scope.$watch('selectedDetailTab', function(newValue, oldValue) {
          /* 
            whenever the drive chart tab is shown (when it wasn't previously), 
            run the resize code because the first load couldn't size it 
            appropriately before the DOM was rendered and the CSS widths applied
            */
          if (newValue === 5 && newValue !== oldValue) {
            scope.resize();
          }
        });

        scope.$on('datacastLoaded', function() {
          console.log("loaded")
          if (angular.isUndefined(scope.playByPlay))
            return;

          if (firstload) {
            firstload = false;

            footballFieldCanvas = $(element.find('canvas')[0]);
            paper.setup(footballFieldCanvas);

            window.angular.element($window).on('resize', scope.resize);
            scope.$on('$destroy', function() {
              window.angular.element($window).off('resize', scope.resize);
            }); // remove the resize listener from the canvas to prevent memory leak
          }

          scope.lastPlay = scope.playByPlay[scope.playByPlay.length - 1];
          scope.previousPlay = scope.playByPlay[scope.playByPlay.length - 2];

          scope.resize();
        });

        scope.resize = function() {
          var desiredWidth = element.parent().width();
          var desiredHeight = 0;
          if (desiredWidth < 1) {
            desiredWidth = footballFieldCanvas.width();
          }
          //football fields including endzones are 4:9 = height:width ratio
          desiredHeight = 4 * desiredWidth / 9;

          footballFieldCanvas.prop({
            width: desiredWidth,
            height: desiredHeight
          });

          paper.view.viewSize = new paper.Size(desiredWidth, desiredHeight);
          scope.drawDriveChart();
        };

        scope.drawField = function() {
          var fieldSize = paper.view.viewSize;
          var field = new paper.Path.Rectangle(new paper.Rectangle(new paper.Point(0,0), fieldSize));
          field.fillColor = "#008A2E";

          var endzoneWidth = fieldSize.width / 12;
          var playingFieldWidth = fieldSize.width - 2 * endzoneWidth;
          var fiveYardLines = [];
          for (var i = 0; i <= 20; i++) {
            fiveYardLines.push(endzoneWidth + i * playingFieldWidth / 20);
          };
          var awayEndzone = new paper.Path.Rectangle(new paper.Rectangle(0, 0, endzoneWidth, fieldSize.height));
          awayEndzone.fillColor = "#ff0000";

          var homeEndzone = new paper.Path.Rectangle(new paper.Rectangle(fiveYardLines[fiveYardLines.length - 1], 0, endzoneWidth, fieldSize.height));
          homeEndzone.fillColor = "#0000ff";

          for (var i = 0; i < fiveYardLines.length; i++) {
            var line = new paper.Path.Line(new paper.Point(fiveYardLines[i], 0), new paper.Point(fiveYardLines[i], fieldSize.height));
            line.strokeColor = "#ffffff";
            if (i % 2 === 0) {
              line.strokeWidth = 3;
            }
          }
        };

        scope.drawDrive = function() {

        };

        scope.drawDriveChart = function() {
          scope.drawField();
          paper.view.draw();
        };

        scope.getSpot = function(play) {
          var team = (play.TeamSeasonId == scope.homeTeamSeasonId && play.Spot <= 50) || (play.TeamSeasonId == scope.awayTeamSeasonId && play.Spot > 50) ? scope.homeAcronym : scope.awayAcronym;
          var spot = play.Spot <= 50 ? play.Spot : 100 - play.Spot;

          return team + ' ' + spot;
        };

        scope.getSpotDirectionClass = function(play) {
          if (play.TeamSeasonId == scope.homeTeamSeasonId) {
            return "nfhs-scout-drivechart-homespot";
          } else {
            return "nfhs-scout-drivechart-awayspot";
          }
        }

        scope.getScrimmageLeft = function(play) {
          if (play.TeamSeasonId == scope.homeTeamSeasonId) {
            return 100 - play.Spot;
          } else if (play.TeamSeasonId == scope.awayTeamSeasonId) {
            return play.Spot;
          }
        }

        scope.getGoalLeft = function(play) {
          var distance_offset = play.Distance;
          if (play.TeamSeasonId == scope.homeTeamSeasonId) {
            distance_offset = distance_offset * -1;
          }

          return scope.getScrimmageLeft(play) + distance_offset;
        }

        scope.downEmbelish = function(number) {
          if (number == 1) {
            return "1st";
          } else if (number == 2) {
            return "2nd";
          } else if (number == 3) {
            return "3rd";
          } else if (number == 4) {
            return "4th";
          }
        }
      }
    };
  }]);