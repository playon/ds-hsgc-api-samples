angular.module('hsgc')
  .directive('volleyballHitChart', [ '$window', '$log', function($window, $log) {
    return {
      restrict: 'EA',
      templateUrl: 'templates/volleyballHitChart.html',
      link: function(scope, element) {
        scope.selectedHitChartPeriod = 0;
        scope.tooltip = { description: '', x: 0, y: 0 };
        var firstLoad = true,
            selectedDetailTabForHitChart = 4,
            previousPeriod = -1,
            // bind template elements that aren't simply bindable to values
            canvasContainer = null,
            bkgImg = null,
            vballCourtImgWidth = 1024,
            courtPerimeter = { x: 20, y: 10, padding: 5 },
            circleDrawingRadius = 2,
            visiblePeriods = [true, true, true, true, true],
            visibleHitType = 'Serve',
            visibleHitTypeEnum = -1,
            visibleGrade = -1,
            vballCourt = null,
            vballCourtAnchor = { x: 0, y: 0 }, // where the top-left of the court is anchored in the view
            vballCourtImg = null,
            vballCourtTooltip = null,
            vballPoints = [];

        scope.$watch('selectedDetailTab', function(newValue, oldValue) {
          /* 
            whenever the hit chart tab is shown (when it wasn't previously), 
            run the resize code because the first load couldn't size it 
            appropriately before the DOM was rendered and the CSS widths applied
            */
          // $log.debug('$watch(selectedDetailTab)', newValue, oldValue);
          if (newValue == selectedDetailTabForHitChart && newValue !== oldValue) {
            scope.resize();
          }
        });

        scope.$on('datacastLoaded', function() {
          if (firstLoad) {
            firstLoad = false;
            scope.selectedHitChartPeriod = null;  // default to All Games
            previousPeriod = scope.currentPeriod; // default to current period

            // find the wrapping table since it is always visible, that way the canvas can be sized from that
            canvasContainer = element.parents('.nfhs-scout-table');
            vballCourt = element.find('canvas');
            // $log.debug(canvas);
            // set background image on the canvas

            window.angular.element($window).on('resize', scope.resize);
            scope.$on('$destroy', function() { window.angular.element($window).off('resize', onResize); });  // remove the resize listener from the canvas to prevent memory leak

            paper.setup(vballCourt[0]);
            // call resize now to get the base size to use for the court loading
            scope.resize();
          }

          var i, player, periods = [];
          for (i = 1; i <= scope.currentPeriod; i++) {
            periods.push({ value: i, display: i });
          }
          scope.hitChartPeriods = periods;

          // build the combined team/player list that the select/optgroup will be built from
          scope.playerFilterList = [];
          angular.forEach(scope.players, function(value, key) {
            player = {
              DisplayName: (scope.homeTeamSeasonId == key ? scope.homeName : scope.awayName) + ' (all players)', 
              TeamDisplayName: (scope.homeTeamSeasonId == key ? scope.homeName : scope.awayName), 
              PlayerId: 0, 
              TeamSeasonId: key };

            if (scope.awayTeamSeasonId == key) {
              scope.playerFilter = player;
            }

            scope.playerFilterList.push(player);
            for (i = 0; i < value.length; i++) {
              player = value[i];

              // fake team player can't be gauranteed, so injected above, and skipped here
              if (player.PlayerId < 1) {
                continue;
              }

              scope.playerFilterList.push({
                DisplayName: player.DisplayName, 
                TeamDisplayName: (scope.homeTeamSeasonId == key ? scope.homeName : scope.awayName), 
                PlayerId: player.PlayerId, 
                TeamSeasonId: key });
            }
          });

          scope.buildHitPoints(scope.playByPlay);
        });

        scope.resize = function() {
          var width = element.parent().width() - (courtPerimeter.x * 2),
              // scale height to half of the width (court image is always a 2:1 ratio) then add a little padding for the perimeter
              height = (width / 2) + (courtPerimeter.y * 2);
          $log.debug(width, height);
          if (width < 1) {
            // probably first run, so use default CSS canvas size instead
            width = vballCourt.width();
            height = (width / 2) + (courtPerimeter.y * 2);
          } else if (bkgImg == null) {
            // copy the appropriately sized volleyball image as a raster to the canvas
            if (vballCourt.width() >= 1280) {
              vballCourtImg = new paper.Raster('http://cdn.hsgamecenter.com/img/volleyball-court-1280x640.png');
              vballCourtImgWidth = 1280;
            } else {
              vballCourtImg = new paper.Raster('http://cdn.hsgamecenter.com/img/volleyball-court-640x320.png');
              vballCourtImgWidth = 640;
            }
          }

          vballCourt.height(height);
          paper.view.viewSize = new paper.Size(width, height);

          scope.setSizeOfItemsOnCourt();
        }

        scope.addItem = function(data) {
          // Create a Paper.js Path to draw a line into it:
          var item = { data: data, line: null, bulletStart: null, bulletEnd: null, bulletKill1: null, bulletKill2: null },
              origin = new paper.Point(),
              destination = new paper.Point(),
              hitTypeDescription = data.hitType;

          // Move to start and draw a line from there
          item.line = new paper.Path.Line(origin, destination);
          item.line.strokeColor = 'black';

          if (data.eventType == 'Serve') {
              switch (data.hitType) {
              case 'Float':
              case 0:
                  hitTypeDescription = 'Float';
                  item.line.strokeColor = 'blue';
                  break;
              case 'Jump':
              case 1:
                  hitTypeDescription = 'Jump';
                  item.line.strokeColor = 'green';
                  break;
              case 'TopSpin':
              case 2:
                  hitTypeDescription = 'Top spin';
                  item.line.strokeColor = 'red';
                  break;
              case 'Underhand':
              case 3:
                  hitTypeDescription = 'Underhand';
                  item.line.strokeColor = 'yellow';
                  break;
              }
          } else if (data.eventType == 'Attack') {
              switch (data.hitType) {
              case 'Dump':
              case 0:
                  hitTypeDescription = 'Dump';
                  item.line.strokeColor = 'blue';
                  break;
              case 'SetOver':
              case 1:
                  hitTypeDescription = 'Set Over';
                  item.line.strokeColor = 'green';
                  break;
              case 'Spike':
              case 2:
                  hitTypeDescription = 'Spike';
                  item.line.strokeColor = 'red';
                  break;
              case 'Tip':
              case 3:
                  hitTypeDescription = 'Tip';
                  item.line.strokeColor = 'yellow';
                  break;
              }
          }

          switch (data.eventType) {
          case 'Attack':
              // nothing to do; a straight line is fine
              break;
          case 'Serve':
              item.line.dashArray = [10, 4];
              break;
          }

          // draw the start bullet
          item.bulletStart = new paper.Path.Circle(origin, circleDrawingRadius);
          item.bulletStart.fillColor = 'black';

          // draw the end marker
          item.bulletEnd = new paper.Path.Circle(destination, circleDrawingRadius * 2);
          // put the description of the event on the bullet, where the tooltip is focused
          item.bulletEnd.data = data;

          if (data.grade < 1) {
              item.bulletEnd.fillColor = 'black';
              item.bulletEnd.strokeColor = 'black';
          } else if (data.grade == 4) {
              item.bulletEnd.strokeColor = 'red';
          } else {
              item.bulletEnd.strokeColor = 'black';
          }

          // draw the end attack cross
          item.bulletKill1 = new paper.Path.Line(
              new paper.Point(destination.x - circleDrawingRadius, destination.y - circleDrawingRadius),
              new paper.Point(destination.x + circleDrawingRadius, destination.y + circleDrawingRadius));
          item.bulletKill1.strokeColor = 'red';
          item.bulletKill2 = new paper.Path.Line(
              new paper.Point(destination.x - circleDrawingRadius, destination.y + circleDrawingRadius),
              new paper.Point(destination.x + circleDrawingRadius, destination.y - circleDrawingRadius));
          item.bulletKill2.strokeColor = 'red';

          // put the items together in a group so they hover/glow together
          new paper.Group([item.line, item.bulletStart, item.bulletKill1, item.bulletKill2, item.bulletEnd]);

          // event handlers
          /*
          item.line.onMouseEnter = ShowDeetsEnter;
          item.line.onMouseLeave = ShowDeetsLeave;
          item.bulletKill1.onMouseEnter = ShowDeetsEnter;
          item.bulletKill1.onMouseLeave = ShowDeetsLeave;
          item.bulletKill2.onMouseEnter = ShowDeetsEnter;
          item.bulletKill2.onMouseLeave = ShowDeetsLeave;
          item.bulletStart.onMouseEnter = ShowDeetsEnter;
          item.bulletStart.onMouseLeave = ShowDeetsLeave;
          item.bulletEnd.onMouseEnter = ShowDeetsEnter;
          item.bulletEnd.onMouseLeave = ShowDeetsLeave;
*/
          // finally add the item to the array
          vballPoints.push(item);
        }

        scope.buildHitPoints = function(playByPlay, homeTeasonSeasonId) {
          var i, play;
          for (i = 0; i < playByPlay.length; i++) {
            play = playByPlay[i];
            if (!(play && (play.EventType == 'Serve' || play.EventType == 'Attack') 
                && play.OriginX && play.DestinationY /* lazily assume that if any Origin and Destination coordinate is non-zero, then they all are */ 
                )
              ) {
              // wasn't an Attack/Serve with a recorded hit location, so skip
              continue;
            }

            // create a set of vectors via the Paper.js library to represent this play
            scope.addItem({ 
              description: play.Description, 
              origin: play.TeamSeasonId == homeTeasonSeasonId ? [1 - play.OriginX, 1 - play.OriginY] :  [play.OriginX, play.OriginY], 
              destination: play.TeamSeasonId == homeTeasonSeasonId ? [1 - play.DestinationX, 1 - play.DestinationY] :  [play.DestinationX, play.DestinationY], 
              grade: play.Grade,
              playerId: play.PlayerId, 
              period: play.GameNumber, 
              teamSeasonId: play.TeamSeasonId, 
              eventType: play.EventType, 
              hitType: play.HitType });
          }
        }

        scope.setSizeOfItemsOnCourt = function() {
          // basically set the padding that exists in the top left corner between the edge of the canvas and the start of the court image; must match HTML
          vballCourtAnchor = courtPerimeter;

          var view = paper.view,
              viewWidth = view.viewSize.width,
              courtWidthInView = viewWidth - (vballCourtAnchor.x * 2),
              courtHeightInView = view.viewSize.height - (vballCourtAnchor.y * 2),
              item,
              startLine,
              endLine,
              attack1LineStart,
              attack1LineEnd,
              attack2LineStart,
              attack2LineEnd,
              startTarget,
              endTarget,
              i,
              vballPointsLength = vballPoints.length;

          // adjust the background 'court' image scale
          if (vballCourtImg != null) {
            vballCourtImg.position = view.center;
            vballCourtImg.scaling = (paper.view.viewSize.width - (courtPerimeter.x * 2)) / vballCourtImgWidth;
            vballCourtImg.sendToBack();
          }

          // set all the points of the items based on the scale
          for (i = 0; i < vballPointsLength; i++) {
              item = vballPoints[i];

              // turn on the kill marker visibility (which may get turned off again later after turning off the whole attack)
              item.bulletKill2.visible = item.data.grade == 4;
              // unassisted kills have another slash (making an X) but that stat isn't 
              // item.bulletKill1.visible = typeof(item.data.attackUnassisted) !== 'undefined' && item.data.attackUnassisted === true && item.bulletKill2.visible;

              // check if it should be visible or not

              // visibility based on period selections
              if (visiblePeriods[item.data.period - 1] === true) {
                  item.line.visible = true;
                  item.bulletStart.visible = true;
                  item.bulletEnd.visible = true;
              } else {
                  item.line.visible = false;
                  item.bulletStart.visible = false;
                  item.bulletEnd.visible = false;
                  item.bulletKill1.visible = false;
                  item.bulletKill2.visible = false;
                  continue;
              }

              // visibility based on player selection
              if (scope.playerFilter.TeamSeasonId == item.data.teamSeasonId && (scope.playerFilter.PlayerId == 0 || scope.playerFilter.PlayerId == item.data.playerId)) {
                  item.line.visible = true;
                  item.bulletStart.visible = true;
                  item.bulletEnd.visible = true;
              } else {
                  item.line.visible = false;
                  item.bulletStart.visible = false;
                  item.bulletEnd.visible = false;
                  item.bulletKill1.visible = false;
                  item.bulletKill2.visible = false;
                  continue;
              }
/*
              // visibility based on hit type selection
              if (visibleHitType == item.data.eventType && (visibleHitTypeEnum == 'All' || visibleHitTypeEnum == item.data.hitType)) {
                  item.line.visible = true;
                  item.bulletStart.visible = true;
                  item.bulletEnd.visible = true;
              } else {
                  item.line.visible = false;
                  item.bulletStart.visible = false;
                  item.bulletEnd.visible = false;
                  item.bulletKill1.visible = false;
                  item.bulletKill2.visible = false;
                  continue;
              }

              // visibility based on grade selection
              if (scope.playerFilter.TeamSeasonId == item.data.teamSeasonId && (visibleGrade < 0 || visibleGrade == item.data.grade)) {
                  item.line.visible = true;
                  item.bulletStart.visible = true;
                  item.bulletEnd.visible = true;
              } else {
                  item.line.visible = false;
                  item.bulletStart.visible = false;
                  item.bulletEnd.visible = false;
                  item.bulletKill1.visible = false;
                  item.bulletKill2.visible = false;
                  continue;
              }
*/
              // figure where on the canvas to put the point
              startTarget = new paper.Point(vballCourtAnchor.x + (courtWidthInView * item.data.origin[1]), vballCourtAnchor.y + (courtHeightInView * item.data.origin[0]));
              endTarget = new paper.Point(vballCourtAnchor.x + (courtWidthInView * item.data.destination[1]), vballCourtAnchor.y + (courtHeightInView * item.data.destination[0]));
              scope.forceMaxEdges(startTarget, { x: viewWidth, y: view.viewSize.height });
              scope.forceMaxEdges(endTarget, { x: viewWidth, y: view.viewSize.height });

              // load the current location of the points
              startLine = item.line.segments[0];
              endLine = item.line.segments[1];
              attack1LineStart = item.bulletKill1.segments[0];
              attack1LineEnd = item.bulletKill1.segments[1];
              attack2LineStart = item.bulletKill2.segments[0];
              attack2LineEnd = item.bulletKill2.segments[1];

              // translate/set the new target points (lines by their segments, bullets can use the easier 'position' property)
              startLine.point.x += startTarget.x - startLine.point.x;
              startLine.point.y += startTarget.y - startLine.point.y;
              endLine.point.x += endTarget.x - endLine.point.x;
              endLine.point.y += endTarget.y - endLine.point.y;
              attack1LineStart.point.x += (endTarget.x - circleDrawingRadius) - attack1LineStart.point.x;
              attack1LineStart.point.y += (endTarget.y - circleDrawingRadius) - attack1LineStart.point.y;
              attack1LineEnd.point.x += (endTarget.x + circleDrawingRadius) - attack1LineEnd.point.x;
              attack1LineEnd.point.y += (endTarget.y + circleDrawingRadius) - attack1LineEnd.point.y;
              attack2LineStart.point.x += (endTarget.x - circleDrawingRadius) - attack2LineStart.point.x;
              attack2LineStart.point.y += (endTarget.y + circleDrawingRadius) - attack2LineStart.point.y;
              attack2LineEnd.point.x += (endTarget.x + circleDrawingRadius) - attack2LineEnd.point.x;
              attack2LineEnd.point.y += (endTarget.y - circleDrawingRadius) - attack2LineEnd.point.y;
              item.bulletStart.position = startTarget;
              item.bulletEnd.position = endTarget;
          }

          // Draw the view now:
          paper.view.draw();
        };

        scope.getLogo = function(play) {
          return play.TeamSeasonId == scope.homeTeamSeasonId ? scope.homeLogo : scope.awayLogo;
        };

        scope.forceMaxEdges = function(point, maxPoint) {
          // add a little padding since the points are circles
          $log.debug('forceMaxEdges', point, courtPerimeter.padding);
          if (point.x < courtPerimeter.padding) {
              point.x = courtPerimeter.padding;
          }
          if (point.y < courtPerimeter.padding) {
              point.y = courtPerimeter.padding;
          }
          if (point.x > maxPoint.x - courtPerimeter.padding) {
              point.x = maxPoint.x - courtPerimeter.padding;
          }
          if (point.y > maxPoint.y - courtPerimeter.padding) {
              point.y = maxPoint.y - courtPerimeter.padding;
          }
        };
      }
    };
  }]);