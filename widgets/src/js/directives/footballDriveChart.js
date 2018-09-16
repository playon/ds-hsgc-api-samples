angular.module('hsgc').directive('footballDriveChart', [
  '$window',
  '$log',
  function($window, $log) {
    return {
      restrict: 'EA',
      templateUrl: 'templates/footballDriveChart.html',
      link: function(scope, element) {
        // configuration
        var fontTeams = 'Graduate, Open Sans, sans-serif';
        var fontYards = 'Open Sans, sans-serif';
        var yardLineWidth = 3;
        var maxEndzoneTextCharacters = 22;
        var hashMarkHeight = 10;
        var yardNumberColor = new window.paper.Color(255, 255, 255); // #fff
        var yardLineColor = yardNumberColor;
        var scrimmageLineColor = new window.paper.Color(255, 255, 0);
        var firstDownLineColor = new window.paper.Color(0, 255, 255);
        var endZoneAwayColor = new window.paper.Color(255, 0, 0);
        var endZoneHomeColor = new window.paper.Color(0, 0, 255);

        // internal tracking variables
        scope.selectedPeriod = 0;
        scope.lastPlay = {};
        scope.previousPlay = {};
        scope.hasPreviousPlay = false;

        var footballFieldCanvas = null;
        var footballFieldCanvasSize = { width: -1 };
        // save reference to the paper instance, so multiple contexts may be used on one page
        var paper = null;
        var paperDriveGroup = null;
        // yard lines and textHeight adjust per size, but need to be used by multiple functions separately
        var yardLines = [];
        var textHeight = 0;

        var firstLoad = true;

        scope.updateDpr = function() {
            // device pixel ratio for high density devices (falling back to 1 if no browser support for this window property)
            var dpr = window.devicePixelRatio || 1;

            // update the draw settings if dpr has changed (in the case of moving windows across screens with different densities, rare but possible in mixed multi-monitor desktop setups for example)
            if (scope.dpr != dpr) {
                $log.debug('devicePixelRatio has changed from ' + scope.dpr + ' to ' + dpr);
                scope.dpr = dpr;
            }

            return dpr;
        };

        scope.updateDpr();
        
        if ($window.matchMedia) {
            $window.matchMedia('screen').addListener(scope.updateDpr);
        } else {
            $log.warn('Could not watch for devicePixelResolution changes since browser does not support the matchMedia element');
        }

        scope.$watch('selectedDetailTab', function(newValue, oldValue) {
          if (newValue === 5 && newValue !== oldValue) {
            scope.resize(true, false);
          }
        });

        scope.$on('datacastLoaded', function() {
          if (
            angular.isUndefined(scope.playByPlay) ||
            scope.playByPlay.length === 0
          ) {
            // can only show drive chart if play-by-play is available; otherwise, abandon
            return;
          }

          if (firstLoad) {
            firstLoad = false;

            footballFieldCanvas = $(element.find('canvas')[0]);
            if (footballFieldCanvas) {
              // if play-by-play not available, canvas won't be loaded; but when it is, set it all up:
              paper = window.paper.setup(footballFieldCanvas[0]);
              scope.drawField();

              window.angular
                .element($window)
                .on('resize', scope.resize);
              scope.$on('$destroy', function() {
                window.angular
                  .element($window)
                  .off('resize', scope.resize);
              }); // remove the resize listener from the canvas to prevent memory leak
            }
          }

          scope.lastPlay = scope.playByPlay[scope.playByPlay.length - 1];
          scope.previousPlay = scope.playByPlay[scope.playByPlay.length - 2];
          scope.hasPreviousPlay = scope.playByPlay.length > 2;

          scope.resize(false, true);
        });

        scope.resize = function(becomingVisible, newData) {
          // canvas won't be found if play-by-play not available
          if (!footballFieldCanvas || !paper) {
            $log.debug(
              'canvas element for the drive chart not available; play-by-play probably not available, which is fine',
              element
            );
            return;
          }

          var dpr = scope.updateDpr();

          // calculate the drive chart size
          var desiredWidth =
            element.width() -
            parseInt(element.css('border-left-width'), 10) -
            parseInt(element.css('border-right-width'), 10);
          if (desiredWidth < 1) {
            // borders load regardless; but width only works if already visible, so parent.width() may have returned 0, try with the parent size (the container that is already visible but probably doesn't have the borders on it) minus borders of the canvas' parent (which may not be visible so can't use width, but can load borders for it)
            var borders =
              parseInt(footballFieldCanvas.parent().css('border-left-width'), 10) -
              parseInt(footballFieldCanvas.parent().css('border-right-width'), 10);
            desiredWidth = element.parent().width() - borders;
          }

          if (dpr > 1) {
            // adjust canvas size per the hi-dpi settings
            desiredWidth = desiredWidth / dpr;
          }

          // football fields including endzones are 4:9 = height:width ratio
          var desiredHeight = Math.floor(desiredWidth * 4 / 9);

          // only redraw field if the size actually changed
          if (
            (becomingVisible || element.is(':visible')) &&
            footballFieldCanvas &&
            footballFieldCanvasSize.width != desiredWidth
          ) {
            $log.debug(
              'Drive Chart size changed, redrawing',
              footballFieldCanvas.width(),
              footballFieldCanvas.height(),
              desiredWidth,
              desiredHeight
            );
            footballFieldCanvas.prop({
              width: desiredWidth,
              height: desiredHeight
            });

            footballFieldCanvasSize = new paper.Size(
              desiredWidth,
              desiredHeight
            );
            paper.view.viewSize = footballFieldCanvasSize;
            scope.drawField();
            scope.drawDrive();
          } else if (newData === true) {
            if (footballFieldCanvas) {
              $log.debug(
                'Drive Chart size not changed, but datacastLoaded so redrawing drive',
                footballFieldCanvas.width(),
                footballFieldCanvas.height(),
                desiredWidth,
                desiredHeight,
                element.is(':visible'),
                footballFieldCanvas.width() != desiredWidth
              );
            }

            scope.drawDrive();
          } else {
            $log.debug(
              'window resized but field size constant; skipping redraw'
            );
          }
        };

        scope.drawField = function() {
          paper.project.clear();
          var fieldSize = paper.view.viewSize;
          var field = new paper.Path.Rectangle(
            new paper.Rectangle(new paper.Point(0, 0), fieldSize)
          );
          field.fillColor = '#008A2E';

          var endzoneWidth = fieldSize.width / 12;
          var playingFieldWidth = fieldSize.width - 2 * endzoneWidth;
          yardLines = [];
          for (var i = 0; i <= 100; i++) {
            yardLines.push(
              endzoneWidth + i * playingFieldWidth / 100
            );
          }
          var awayEndzone = new paper.Path.Rectangle(
            new paper.Rectangle(
              0,
              0,
              endzoneWidth,
              fieldSize.height
            )
          );
          awayEndzone.fillColor = endZoneAwayColor;

          var endZoneTextHeight = endzoneWidth / 3;
          var awayTeamNameToUse =
            scope.awayAcronym &&
            scope.awayAcronym.length > 1 &&
            scope.awayShortName.length >= maxEndzoneTextCharacters ?
            scope.awayAcronym :
            scope.awayShortName;
          var awayTeamNameSize = scope.getTextSize(
            awayTeamNameToUse,
            endZoneTextHeight,
            fontTeams
          );
          var awayTeamName = new paper.PointText(
            new paper.Point(
              endzoneWidth / 2 - awayTeamNameSize.width / 2,
              fieldSize.height / 2 + awayTeamNameSize.height / 2
            )
          );
          awayTeamName.content = awayTeamNameToUse;
          awayTeamName.strokeColor = yardNumberColor;
          awayTeamName.strokeWidth = 1 / scope.dpr;
          awayTeamName.fillColor = yardNumberColor;
          awayTeamName.fontSize = awayTeamNameSize.height + 'px';
          awayTeamName.fontFamily = fontTeams;
          awayTeamName.rotate(270);

          var homeEndzone = new paper.Path.Rectangle(
            new paper.Rectangle(
              yardLines[yardLines.length - 1],
              0,
              endzoneWidth,
              fieldSize.height
            )
          );
          homeEndzone.fillColor = endZoneHomeColor;

          var homeTeamNameToUse =
            scope.homeAcronym &&
            scope.homeAcronym.length > 1 &&
            scope.homeShortName.length >= maxEndzoneTextCharacters ?
            scope.homeAcronym :
            scope.homeShortName;
          var homeTeamNameSize = scope.getTextSize(
            homeTeamNameToUse,
            endZoneTextHeight,
            fontTeams
          );
          var homeTeamName = new paper.PointText(
            new paper.Point(
              yardLines[yardLines.length - 1] + endzoneWidth / 2 - homeTeamNameSize.width / 2,
              fieldSize.height / 2 + homeTeamNameSize.height / 2
            )
          );
          homeTeamName.content = homeTeamNameToUse;
          homeTeamName.strokeColor = yardNumberColor;
          homeTeamName.strokeWidth = 1 / scope.dpr;
          homeTeamName.fillColor = yardNumberColor;
          homeTeamName.fontSize = awayTeamNameSize.height + 'px';
          homeTeamName.fontFamily = fontTeams;
          homeTeamName.rotate(90);

          textHeight = (yardLines[5] - yardLines[0]) * 0.7;
          var textSizes = {};
          var yardNumbers = [1, 2, 3, 4, 5, 0];
          for (i = 0; i < yardNumbers.length; i++) {
            textSizes[yardNumbers[i]] = scope.getTextSize(
              yardNumbers[i],
              textHeight,
              fontYards
            );
          }

          var yardLineTextVerticalPadding = textHeight * 0.1;
          var yardLineTextHorizontalPadding = 2 / scope.dpr;
          var yardLineSpacing = (yardLines[1] - yardLines[0]) * scope.dpr;
          var hashMarkInset = fieldSize.height / 3;
          var topMiddleHashMarkY = hashMarkInset;
          var bottomMiddleHashMarkY = fieldSize.height - hashMarkInset;

          // build reusable symbols
          var hashMarkSymbol = new paper.Path.Line(
            new paper.Point(0, 0),
            new paper.Point(0, hashMarkHeight / scope.dpr)
          );
          hashMarkSymbol.strokeColor = yardLineColor;
          hashMarkSymbol.strokeWidth = 1 / scope.dpr;
          hashMarkSymbol.pivot = hashMarkSymbol.bounds.topLeft;
          hashMarkSymbol = new paper.Symbol(hashMarkSymbol);
          var verticalLineSymbol = new paper.Path.Line(
            new paper.Point(0, 0),
            new paper.Point(0, fieldSize.height)
          );
          verticalLineSymbol.strokeColor = yardNumberColor;
          verticalLineSymbol.strokeWidth = 1 / scope.dpr;
          verticalLineSymbol.pivot = verticalLineSymbol.bounds.topLeft;
          verticalLineSymbol = new paper.Symbol(verticalLineSymbol);
          var thickVerticalLineSymbol = new paper.Path.Line(
            new paper.Point(0, 0),
            new paper.Point(0, fieldSize.height)
          );
          thickVerticalLineSymbol.strokeColor = yardNumberColor;
          thickVerticalLineSymbol.strokeWidth = yardLineWidth / scope.dpr;
          thickVerticalLineSymbol.pivot = thickVerticalLineSymbol.bounds.topLeft;
          thickVerticalLineSymbol = new paper.Symbol(thickVerticalLineSymbol);

          for (i = 0; i < yardLines.length; yardLineSpacing > 7 ? i++ : (i += 5)) {
            // every 5 yards
            if (i % 5 === 0) {
              if (i % 10 !== 0) {
                verticalLineSymbol.place(new paper.Point(yardLines[i], 0));
              } else if (i % 10 === 0) {
                // every 10 yards
                thickVerticalLineSymbol.place(new paper.Point(yardLines[i], 0));
                if (i !== 0 && i !== yardLines.length - 1) {
                  var yardLine = i;
                  if (yardLine > 50) {
                    yardLine = 100 - yardLine;
                  }
                  yardLine = yardLine / 10;
                  var text10DigitSize = textSizes[yardLine];
                  var topYardText10Digit = new paper.PointText(
                    new paper.Point(
                      yardLines[i] + yardLineTextHorizontalPadding + (yardLineWidth - 2) / scope.dpr,
                      text10DigitSize.height + yardLineTextVerticalPadding
                    )
                  );
                  topYardText10Digit.content = yardLine;
                  topYardText10Digit.strokeColor = yardNumberColor;
                  topYardText10Digit.fillColor = yardNumberColor;
                  topYardText10Digit.fontSize = text10DigitSize.height + 'px';
                  topYardText10Digit.fontFamily = fontYards;
                  topYardText10Digit.rotate(180);

                  var yardText0DigitSize = textSizes[0];
                  var topYardText0Digit = new paper.PointText(
                    new paper.Point(
                      yardLines[i] - text10DigitSize.width - yardLineTextHorizontalPadding - 2,
                      yardText0DigitSize.height + yardLineTextVerticalPadding
                    )
                  );
                  topYardText0Digit.content = 0;
                  topYardText0Digit.strokeColor = yardNumberColor;
                  topYardText0Digit.fillColor = yardNumberColor;
                  topYardText0Digit.fontSize = yardText0DigitSize.height + 'px';
                  topYardText0Digit.fontFamily = fontYards;
                  topYardText0Digit.rotate(180);

                  text10DigitSize = textSizes[yardLine];
                  var bottomYardText10Digit = new paper.PointText(
                    new paper.Point(
                      yardLines[i] - text10DigitSize.width - yardLineTextHorizontalPadding - 1,
                      fieldSize.height - text10DigitSize.height / 2 - yardLineTextVerticalPadding
                    )
                  );
                  bottomYardText10Digit.content = yardLine;
                  bottomYardText10Digit.strokeColor = yardNumberColor;
                  bottomYardText10Digit.fillColor = yardNumberColor;
                  bottomYardText10Digit.fontSize = text10DigitSize.height + 'px';
                  bottomYardText10Digit.fontFamily = fontYards;

                  yardText0DigitSize = textSizes[0];
                  var bottomYardText0Digit = new paper.PointText(
                    new paper.Point(
                      yardLines[i] + yardLineTextHorizontalPadding + ((yardLineWidth - 1) / scope.dpr),
                      fieldSize.height - yardText0DigitSize.height / 2 - yardLineTextVerticalPadding
                    )
                  );
                  bottomYardText0Digit.content = 0;
                  bottomYardText0Digit.strokeColor = yardNumberColor;
                  bottomYardText0Digit.fillColor = yardNumberColor;
                  bottomYardText0Digit.fontSize = yardText0DigitSize.height + 'px';
                  bottomYardText0Digit.fontFamily = fontYards;
                }
              }
            } else if (yardLineSpacing > 5) {
              // loops every yard, but only if there is enough space for individual yard hashes
              scope.drawHashMark(
                hashMarkSymbol,
                yardLines[i],
                0,
                true
              );
              scope.drawHashMark(
                hashMarkSymbol,
                yardLines[i],
                fieldSize.height,
                false
              );
              scope.drawHashMark(
                hashMarkSymbol,
                yardLines[i],
                topMiddleHashMarkY,
                true
              );
              scope.drawHashMark(
                hashMarkSymbol,
                yardLines[i],
                bottomMiddleHashMarkY,
                false
              );
            }
          }
        };

        scope.drawDrive = function() {
          if (paperDriveGroup) {
            paperDriveGroup.remove();
            paperDriveGroup = null;
          }

          var fieldSize = paper.view.viewSize;
          var homeTeamIsOnOffense = scope.lastPlay.TeamSeasonId == scope.homeTeamSeasonId;
          var scrimmageYardLine = homeTeamIsOnOffense ?
            100 - scope.lastPlay.Spot :
            scope.lastPlay.Spot;
          var scrimmageLineX = yardLines[scrimmageYardLine];
          var scrimmageLine = new paper.Path(
            new paper.Point(scrimmageLineX, 0),
            new paper.Point(scrimmageLineX, fieldSize.height)
          );
          scrimmageLine.strokeColor = scrimmageLineColor;
          scrimmageLine.strokeWidth = 5 / scope.dpr;

          var arrowOffset, arrowRotation, arrowColor;
          var triangleRadius = textHeight / 2;
          if (homeTeamIsOnOffense) {
            arrowOffset = triangleRadius;
            arrowRotation = 270;
            arrowColor = '#0000ff';
          } else {
            arrowOffset = -triangleRadius;
            arrowRotation = 90;
            arrowColor = '#ff0000';
          }
          var arrow = new paper.Path.RegularPolygon(
            new paper.Point(
              scrimmageLineX + arrowOffset,
              fieldSize.height / 2
            ),
            3,
            triangleRadius
          );
          arrow.fillColor = arrowColor;
          arrow.rotate(arrowRotation);

          var firstDownYardLine;
          if (homeTeamIsOnOffense) {
            firstDownYardLine = scrimmageYardLine - scope.lastPlay.Distance;
          } else {
            firstDownYardLine = scrimmageYardLine + scope.lastPlay.Distance;
          }

          var firstDownLineX = yardLines[firstDownYardLine];
          var firstDownLine = new paper.Path.Line(
            new paper.Point(firstDownLineX, 0),
            new paper.Point(firstDownLineX, fieldSize.height)
          );
          firstDownLine.strokeColor = firstDownLineColor;
          firstDownLine.strokeWidth = 5 / scope.dpr;

          paperDriveGroup = new paper.Group([
            scrimmageLine,
            arrow,
            firstDownLine
          ]);

          paper.view.draw();
        };

        scope.drawHashMark = function(symbol, x, y, drawTopToBottom) {
          symbol.place(
            new paper.Point(
              x,
              drawTopToBottom ? y : y - (hashMarkHeight / scope.dpr)
            )
          );
        };

        scope.getTextSize = function(text, height, font) {
          var context = footballFieldCanvas[0].getContext('2d');

          context.font = height + 'px ' + font;

          return {
            width: context.measureText(text).width,
            height: height
          };
        };

        scope.getSpot = function(play) {
          var team =
            (play.TeamSeasonId == scope.homeTeamSeasonId && play.Spot <= 50) ||
            (play.TeamSeasonId == scope.awayTeamSeasonId && play.Spot > 50) ?
            scope.homeAcronym :
            scope.awayAcronym;
          var spot = play.Spot <= 50 ? play.Spot : 100 - play.Spot;

          return team + ' ' + spot;
        };

        scope.getScrimmageLeft = function(play) {
          if (play.TeamSeasonId == scope.homeTeamSeasonId) {
            return 100 - play.Spot;
          } else if (play.TeamSeasonId == scope.awayTeamSeasonId) {
            return play.Spot;
          }
        };

        scope.getGoalLeft = function(play) {
          var distance_offset = play.Distance;
          if (play.TeamSeasonId == scope.homeTeamSeasonId) {
            distance_offset = distance_offset * -1;
          }

          return scope.getScrimmageLeft(play) + distance_offset;
        };

        scope.downEmbellish = function(number) {
          if (number == 1) {
            return '1st';
          } else if (number == 2) {
            return '2nd';
          } else if (number == 3) {
            return '3rd';
          } else if (number == 4) {
            return '4th';
          } else {
            return '-';
          }
        };
      }
    };
  }
]);
