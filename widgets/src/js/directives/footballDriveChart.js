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
          if (angular.isUndefined(scope.playByPlay))
            return;

          if (firstload) {
            firstload = false;

            footballFieldCanvas = $(element.find('canvas')[0]);
            paper.setup(footballFieldCanvas[0]);

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
          var desiredWidth = element.parent().width() - 20;
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
          var yardLines = [];
          for (var i = 0; i <= 100; i++) {
            yardLines.push(endzoneWidth + i * playingFieldWidth / 100);
          };
          var awayEndzone = new paper.Path.Rectangle(new paper.Rectangle(0, 0, endzoneWidth, fieldSize.height));
          awayEndzone.fillColor = "#ff0000";

          var homeEndzone = new paper.Path.Rectangle(new paper.Rectangle(yardLines[yardLines.length - 1], 0, endzoneWidth, fieldSize.height));
          homeEndzone.fillColor = "#0000ff";

          var textHeight = (yardLines[5] - yardLines[0]) * 0.8;
          var textSizes = {};
          var yardNumbers = [1, 2, 3, 4, 5, 0];
          for (var i = 0; i < yardNumbers.length; i++) {
            textSizes[yardNumbers[i]] = scope.getTextSize(yardNumbers[i], textHeight);
          }

          var yardLineTextVerticalPadding = textHeight * 0.1;
          var yardLineTextHorizontalPadding = 2;
          var yardLineSpacing = yardLines[1] - yardLines[0];
          var hashMarkHeight = 10;
          var hashMarkInset = fieldSize.height / 3;
          var topMiddleHashMarkY = hashMarkInset;
          var bottomMiddleHashMarkY = fieldSize.height - hashMarkInset - hashMarkHeight;
          
          for (var i = 0; i < yardLines.length; i++) {
            if (i % 5 === 0) {
              var line = new paper.Path.Line(new paper.Point(yardLines[i], 0), new paper.Point(yardLines[i], fieldSize.height));
              line.strokeColor = "#ffffff";
              if (i % 10 === 0) {
                var yardLineWidth = 3;
                line.strokeWidth = yardLineWidth;
                if (i !== 0 && i !== yardLines.length - 1) {
                  var yardLine = i;
                  if (yardLine > 50) {
                    yardLine = 100 - yardLine;
                  }
                  yardLine = yardLine / 10;
                  var text10DigitSize = textSizes[yardLine];
                  var topYardText10Digit = new paper.PointText(new paper.Point(yardLines[i] + yardLineTextHorizontalPadding + yardLineWidth, text10DigitSize.height + yardLineTextVerticalPadding));
                  topYardText10Digit.content = yardLine;
                  topYardText10Digit.strokeColor = "#ffffff";
                  topYardText10Digit.fillColor = "#ffffff";
                  topYardText10Digit.fontSize = text10DigitSize.height + "px";
                  topYardText10Digit.fontFamily = "sans-serif";
                  topYardText10Digit.rotate(180);

                  var yardText0DigitSize = textSizes[0];
                  var topYardText0Digit = new paper.PointText(new paper.Point(yardLines[i] - text10DigitSize.width - yardLineTextHorizontalPadding, yardText0DigitSize.height + yardLineTextVerticalPadding));
                  topYardText0Digit.content = 0;
                  topYardText0Digit.strokeColor = "#ffffff";
                  topYardText0Digit.fillColor = "#ffffff";
                  topYardText0Digit.fontSize = yardText0DigitSize.height + "px";
                  topYardText0Digit.fontFamily = "sans-serif";
                  topYardText0Digit.rotate(180);

                  var text10DigitSize = textSizes[yardLine];
                  var bottomYardText10Digit = new paper.PointText(new paper.Point(yardLines[i] - text10DigitSize.width - yardLineTextHorizontalPadding, fieldSize.height - text10DigitSize.height / 2 - yardLineTextVerticalPadding));
                  bottomYardText10Digit.content = yardLine;
                  bottomYardText10Digit.strokeColor = "#ffffff";
                  bottomYardText10Digit.fillColor = "#ffffff";
                  bottomYardText10Digit.fontSize = text10DigitSize.height + "px";
                  bottomYardText10Digit.fontFamily = "sans-serif";

                  var yardText0DigitSize = textSizes[0];
                  var bottomYardText0Digit = new paper.PointText(new paper.Point(yardLines[i] + yardLineTextHorizontalPadding + yardLineWidth, fieldSize.height - yardText0DigitSize.height / 2 - yardLineTextVerticalPadding));
                  bottomYardText0Digit.content = 0;
                  bottomYardText0Digit.strokeColor = "#ffffff";
                  bottomYardText0Digit.fillColor = "#ffffff";
                  bottomYardText0Digit.fontSize = yardText0DigitSize.height + "px";
                  bottomYardText0Digit.fontFamily = "sans-serif";
                }
              }
            } else {
              if (yardLineSpacing > 5) {
                //only draw hashmarks if there is enough space
                var topMark = new paper.Path.Line(new paper.Point(yardLines[i], 0), new paper.Point(yardLines[i], hashMarkHeight));
                topMark.strokeColor = "#ffffff";
                var bottomMark = new paper.Path.Line(new paper.Point(yardLines[i], fieldSize.height - hashMarkHeight), new paper.Point(yardLines[i], fieldSize.height));
                bottomMark.strokeColor = "#ffffff";
                var topMiddleMark = new paper.Path.Line(new paper.Point(yardLines[i], topMiddleHashMarkY), new paper.Point(yardLines[i], topMiddleHashMarkY + hashMarkHeight));
                topMiddleMark.strokeColor = "#ffffff";
                var bottomMiddleMark = new paper.Path.Line(new paper.Point(yardLines[i], bottomMiddleHashMarkY), new paper.Point(yardLines[i], bottomMiddleHashMarkY + hashMarkHeight));
                bottomMiddleMark.strokeColor = "#ffffff";
              }
            }
          }
        };

        scope.getTextSize = function(text, height) {
          var canvas = footballFieldCanvas[0];
          var context = canvas.getContext("2d");
          context.font = height + "px sans-serif";
          var metrics = context.measureText(text);
          var width =  metrics.width;

          return { width: width, height: height};
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