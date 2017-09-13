angular.module('hsgc')
  .directive('footballDriveChart', ['$window', '$log', function($window, $log) {
    return {
      restrict: 'EA',
      templateUrl: 'templates/footballDriveChart.html',
      link: function(scope, element) {
        scope.selectedPeriod = 0;
        scope.lastPlay = {};
        scope.previousPlay = {};
        scope.hasPreviousPlay = false;
        var paper = typeof(window.paper) === 'undefined' ? null : window.paper;
        var firstload = true;
        var footballFieldCanvas = null;
        var fontTeams = "Graduate, sans-serif";
        var fontYards = "Open Sans, sans-serif";
        var yardLineWidth = 3;

        scope.$watch('selectedDetailTab', function(newValue, oldValue) {
          if (newValue === 5 && newValue !== oldValue) {
            scope.resize(true);
          }
        });

        scope.$on('datacastLoaded', function() {
          if (angular.isUndefined(scope.playByPlay) || scope.playByPlay.length === 0)
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
          scope.hasPreviousPlay = scope.playByPlay.length > 2;

          scope.resize(true);
        });

        scope.resize = function(forceRedraw) {
          var desiredWidth = element.parent().width() - 20;
          var desiredHeight = 0;
          if (desiredWidth < 1) {
            desiredWidth = footballFieldCanvas.width();
          }

          // football fields including endzones are 4:9 = height:width ratio
          desiredHeight = Math.floor(desiredWidth * 4 / 9);

          // only redraw if the size actually changed
          if (forceRedraw === true ||
            (element.is(':visible') && (footballFieldCanvas.width() != desiredWidth || footballFieldCanvas.height() != desiredHeight))) {
            $log.debug('Drive Chart size changed, redrawing', footballFieldCanvas.width(), footballFieldCanvas.height(), desiredWidth, desiredHeight);
            footballFieldCanvas.prop({
              width: desiredWidth,
              height: desiredHeight
            });

            paper.view.viewSize = new paper.Size(desiredWidth, desiredHeight);
            scope.drawDrive();
          /*
          } else {
            $log.debug('window resized but field size constant; skipping redraw');
          */
          }
        };       

        scope.drawDrive = function() {
          var fieldSize = paper.view.viewSize;
          var field = new paper.Path.Rectangle(new paper.Rectangle(new paper.Point(0,0), fieldSize));
          field.fillColor = "#008A2E";

          var endzoneWidth = fieldSize.width / 12;
          var playingFieldWidth = fieldSize.width - 2 * endzoneWidth;
          var yardLines = [];
          for (var i = 0; i <= 100; i++) {
            yardLines.push(endzoneWidth + i * playingFieldWidth / 100);
          }
          var awayEndzone = new paper.Path.Rectangle(new paper.Rectangle(0, 0, endzoneWidth, fieldSize.height));
          awayEndzone.fillColor = "#ff0000";

          var endZoneTextHeight = endzoneWidth / 3;
          var awayTeamNameSize = scope.getTextSize(scope.awayShortName, endZoneTextHeight, fontTeams);
          var awayTeamName = new paper.PointText(new paper.Point( (endzoneWidth / 2) - (awayTeamNameSize.width / 2), (fieldSize.height / 2) + (awayTeamNameSize.height / 2)));
          awayTeamName.content = scope.awayShortName;
          awayTeamName.strokeColor = "#ffffff";
          awayTeamName.fillColor = "#ffffff";
          awayTeamName.fontSize = awayTeamNameSize.height + "px";
          awayTeamName.fontFamily = fontTeams;
          awayTeamName.rotate(270);

          var homeEndzone = new paper.Path.Rectangle(new paper.Rectangle(yardLines[yardLines.length - 1], 0, endzoneWidth, fieldSize.height));
          homeEndzone.fillColor = "#0000ff";

          var homeTeamNameSize = scope.getTextSize(scope.homeShortName, endZoneTextHeight, fontTeams);
          var homeTeamName = new paper.PointText(new paper.Point(yardLines[yardLines.length - 1] + (endzoneWidth / 2) - (homeTeamNameSize.width / 2), (fieldSize.height / 2) + (homeTeamNameSize.height / 2)));
          homeTeamName.content = scope.homeShortName;
          homeTeamName.strokeColor = "#ffffff";
          homeTeamName.fillColor = "#ffffff";
          homeTeamName.fontSize = awayTeamNameSize.height + "px";
          homeTeamName.fontFamily = fontTeams;
          homeTeamName.rotate(90);

          var textHeight = (yardLines[5] - yardLines[0]) * 0.7;
          var textSizes = {};
          var yardNumbers = [1, 2, 3, 4, 5, 0];
          for (i = 0; i < yardNumbers.length; i++) {
            textSizes[yardNumbers[i]] = scope.getTextSize(yardNumbers[i], textHeight, fontYards);
          }

          var yardLineTextVerticalPadding = textHeight * 0.1;
          var yardLineTextHorizontalPadding = 1;
          var yardLineSpacing = yardLines[1] - yardLines[0];
          var hashMarkInset = fieldSize.height / 3;
          var topMiddleHashMarkY = hashMarkInset;
          var bottomMiddleHashMarkY = fieldSize.height - hashMarkInset;
          
          for (i = 0; i < yardLines.length; yardLineSpacing > 5 ? i++ : i += 5) {
            // every 5 yards
            if (i % 5 === 0) {
              var line = new paper.Path.Line(new paper.Point(yardLines[i], 0), new paper.Point(yardLines[i], fieldSize.height));
              line.strokeColor = "#ffffff";
              if (i % 10 === 0) {
                // every 10 yards
                line.strokeWidth = yardLineWidth;
                if (i !== 0 && i !== yardLines.length - 1) {
                  var yardLine = i;
                  if (yardLine > 50) {
                    yardLine = 100 - yardLine;
                  }
                  yardLine = yardLine / 10;
                  var text10DigitSize = textSizes[yardLine];
                  var topYardText10Digit = new paper.PointText(new paper.Point(yardLines[i] + yardLineTextHorizontalPadding + yardLineWidth - 1, text10DigitSize.height + yardLineTextVerticalPadding));
                  topYardText10Digit.content = yardLine;
                  topYardText10Digit.strokeColor = "#ffffff";
                  topYardText10Digit.fillColor = "#ffffff";
                  topYardText10Digit.fontSize = text10DigitSize.height + "px";
                  topYardText10Digit.fontFamily = fontYards;
                  topYardText10Digit.rotate(180);

                  var yardText0DigitSize = textSizes[0];
                  var topYardText0Digit = new paper.PointText(new paper.Point(yardLines[i] - text10DigitSize.width - yardLineTextHorizontalPadding, yardText0DigitSize.height + yardLineTextVerticalPadding));
                  topYardText0Digit.content = 0;
                  topYardText0Digit.strokeColor = "#ffffff";
                  topYardText0Digit.fillColor = "#ffffff";
                  topYardText0Digit.fontSize = yardText0DigitSize.height + "px";
                  topYardText0Digit.fontFamily = fontYards;
                  topYardText0Digit.rotate(180);

                  text10DigitSize = textSizes[yardLine];
                  var bottomYardText10Digit = new paper.PointText(new paper.Point(yardLines[i] - text10DigitSize.width - yardLineTextHorizontalPadding, fieldSize.height - text10DigitSize.height / 2 - yardLineTextVerticalPadding));
                  bottomYardText10Digit.content = yardLine;
                  bottomYardText10Digit.strokeColor = "#ffffff";
                  bottomYardText10Digit.fillColor = "#ffffff";
                  bottomYardText10Digit.fontSize = text10DigitSize.height + "px";
                  bottomYardText10Digit.fontFamily = fontYards;

                  yardText0DigitSize = textSizes[0];
                  var bottomYardText0Digit = new paper.PointText(new paper.Point(yardLines[i] + yardLineTextHorizontalPadding + yardLineWidth, fieldSize.height - yardText0DigitSize.height / 2 - yardLineTextVerticalPadding));
                  bottomYardText0Digit.content = 0;
                  bottomYardText0Digit.strokeColor = "#ffffff";
                  bottomYardText0Digit.fillColor = "#ffffff";
                  bottomYardText0Digit.fontSize = yardText0DigitSize.height + "px";
                  bottomYardText0Digit.fontFamily = fontYards;
                }
              }
            } else if (yardLineSpacing > 5) {
              // loops every yard, but only if there is enough space for individual yard hashes
              scope.drawHashMark(yardLines[i], 0, true);
              scope.drawHashMark(yardLines[i], fieldSize.height, false);
              scope.drawHashMark(yardLines[i], topMiddleHashMarkY, true);
              scope.drawHashMark(yardLines[i], bottomMiddleHashMarkY, false);
            }
          }

          var homeTeamIsOnOffense = scope.lastPlay.TeamSeasonId == scope.homeTeamSeasonId;
          var scrimmageYardLine = homeTeamIsOnOffense ? 100 - scope.lastPlay.Spot : scope.lastPlay.Spot;
          var scrimmageLineX = yardLines[scrimmageYardLine];
          var scrimmageLine = new paper.Path.Line(new paper.Point(scrimmageLineX, 0), new paper.Point(scrimmageLineX, fieldSize.height));
          scrimmageLine.strokeColor = "#ffff00";
          scrimmageLine.strokeWidth = 5;

          var arrowOffset, arrowRotation, arrowColor;
          var triangleRadius = textHeight / 2;
          if (homeTeamIsOnOffense) {
            arrowOffset = triangleRadius;
            arrowRotation = 270;
            arrowColor = "#0000ff";
          } else {
            arrowOffset = -triangleRadius;
            arrowRotation = 90;
            arrowColor = "#ff0000";
          }
          var arrow = new paper.Path.RegularPolygon(new paper.Point(scrimmageLineX + arrowOffset, fieldSize.height / 2), 3, triangleRadius);
          arrow.fillColor = arrowColor;
          arrow.rotate(arrowRotation);

          var firstDownYardLine;
          if (homeTeamIsOnOffense) {
            firstDownYardLine = scrimmageYardLine - scope.lastPlay.Distance;
          } else {
            firstDownYardLine = scrimmageYardLine + scope.lastPlay.Distance;
          }

          var firstDownLineX = yardLines[firstDownYardLine];
          var firstDownLine = new paper.Path.Line(new paper.Point(firstDownLineX, 0), new paper.Point(firstDownLineX, fieldSize.height));
          firstDownLine.strokeColor = "#00ffff";
          firstDownLine.strokeWidth = 5;

          paper.view.draw();
        };

        scope.drawHashMark = function(x, y, drawTopToBottom) {
          var hashMarkHeight = 10;
          var yCoord = drawTopToBottom ? y : y - hashMarkHeight;
          var mark = new paper.Path.Line(new paper.Point(x, yCoord), new paper.Point(x, yCoord + hashMarkHeight));
          mark.strokeColor = "#ffffff";
        };

        scope.getTextSize = function(text, height, font) {
          var canvas = footballFieldCanvas[0];
          var context = canvas.getContext("2d");
          context.font = height + "px " + font;
          var metrics = context.measureText(text);
          var width =  metrics.width;

          return { width: width, height: height};
        };

        scope.getSpot = function(play) {
          var team = (play.TeamSeasonId == scope.homeTeamSeasonId && play.Spot <= 50) || (play.TeamSeasonId == scope.awayTeamSeasonId && play.Spot > 50) ? scope.homeAcronym : scope.awayAcronym;
          var spot = play.Spot <= 50 ? play.Spot : 100 - play.Spot;

          return team + ' ' + spot;
        };

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