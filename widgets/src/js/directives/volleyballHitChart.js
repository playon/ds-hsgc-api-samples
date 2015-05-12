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
            courtPerimeter = { x: 20, y: 10, padding: 5 },
            circleDrawingRadius = 2,
            visiblePeriods = [true, true, true, true, true],
            visibleHitType = 'Serve',
            visibleHitTypeEnum = -1,
            visibleGrade = -1,
            vballCourt = null,
            vballCourtAnchor = courtPerimeter, // where the top-left of the court is anchored in the view; basically set the padding that exists in the top left corner between the edge of the canvas and the start of the court image
            vballCourtImgLarge = null,
            vballCourtImgSmall = null,
            vballCourtImg = null,
            vballCourtImgWidth = 1280,
            vballCourtTooltip = null,
            vballCourtTooltipInner = null,
            vballPoints = [];

        scope.$watch('selectedHitChartPeriod', function(newValue, oldValue) {
          if (newValue !== oldValue) {
            scope.setSizeOfItemsOnCourt();
          }
        })

        scope.$watch('selectedDetailTab', function(newValue, oldValue) {
          /* 
            whenever the hit chart tab is shown (when it wasn't previously), 
            run the resize code because the first load couldn't size it 
            appropriately before the DOM was rendered and the CSS widths applied
            */
          // $log.debug('$watch(selectedDetailTab)', newValue, oldValue);
          if (newValue == selectedDetailTabForHitChart && newValue !== oldValue) {
            scope.resize();
            // resize calls setSizeOfItemsOnCourt() so it doesn't need to be explicitly called here
          }
        });

        scope.$on('datacastLoaded', function() {
          if (firstLoad) {
            $log.debug('Datacast loaded. Initializing canvas...');
            firstLoad = false;
            scope.selectedHitChartPeriod = null;  // default to All Games
            previousPeriod = scope.currentPeriod; // default to current period

            // find the wrapping table since it is always visible, that way the canvas can be sized from that
            canvasContainer = element.parents('.nfhs-scout-table');
            vballCourt = element.find('canvas');
            // $log.debug(canvas);
            paper.setup(vballCourt[0]);

            vballCourtTooltip = element.parent().find('.nfhs-scout-hit-chart-tooltip-js');
            if (vballCourtTooltip && vballCourtTooltip.length > 0) {
              vballCourtTooltipInner = $('.tooltip-inner', vballCourtTooltip);
            }

            window.angular.element($window).on('resize', scope.resize);
            scope.$on('$destroy', function() { window.angular.element($window).off('resize', onResize); });  // remove the resize listener from the canvas to prevent memory leak

            // initialize the Serve/Attack hit type filter
            scope.hitTypeFilterList = [
                { DisplayName: 'All serves', Value: '', EventType: 'Serve' },
                { DisplayName: 'Float', Value: 'Float', EventType: 'Serve' },
                { DisplayName: 'Jump', Value: 'Jump', EventType: 'Serve' },
                { DisplayName: 'Underhand', Value: 'Underhand', EventType: 'Serve' },
                { DisplayName: 'Top Spin', Value: 'TopSpin', EventType: 'Serve' },
                { DisplayName: 'All attacks', Value: '', EventType: 'Attack' },
                { DisplayName: 'Dump', Value: 'Dump', EventType: 'Attack' },
                { DisplayName: 'Set Over', Value: 'SetOver', EventType: 'Attack' },
                { DisplayName: 'Spike', Value: 'Spike', EventType: 'Attack' },
                { DisplayName: 'Tip', Value: 'Tip', EventType: 'Attack' }
              ];
            // default to 'All Serves'
            scope.hitTypeFilter = scope.hitTypeFilterList[0];
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
          scope.resize();
        });

        scope.resize = function() {
          /* 
            Getting width is tricky; until it is visible, it often doesn't render full size.
            Therefore, the onClick of the tab also kicks off this resize function. Plus, the 
            element itself doesn't have a width in CSS until we set it. So here it gets the
            width from the parent (the tab container)--but it has a CSS padding set which isn't
            reflected in the result of width(), so it is manually adjusted for that here.
            Then, to calculate height, we have to take the canvas width, remove our own
            padding (for hits that are outside the main court, for example serves) to find the 
            court image width, halve that, then add back on the height padding to get the final 
            canvas height.
          */

          var desiredWidth = element.parent().width() - 20 /* hard-coded padding width from the base.less rule ".nfhs-scout-tab-container > div" */,
              desiredHeight = 0;
          
          // $log.debug(width, height);
          if (desiredWidth < 1) {
            // probably first run, so use default CSS canvas size instead
            desiredWidth = vballCourt.width();
          }
          
          // scale height to half of the width (court image is always a 2:1 ratio) then add a little padding for the perimeter
          desiredHeight = ((desiredWidth  - (courtPerimeter.x * 2)) / 2) +  (courtPerimeter.y * 2);

          // switch between the low and high res versions of the court
          if (desiredWidth > 640) {
            vballCourtImg = vballCourtImgLarge;
            vballCourtImgWidth = 1280;
            vballCourtImgLarge.visible = true;
            vballCourtImgSmall.visible = false;
          } else {
            vballCourtImg = vballCourtImgSmall;
            vballCourtImgWidth = 640;
            vballCourtImgLarge.visible = false;
            vballCourtImgSmall.visible = true;
          }

          // $log.debug('element.width', element.parent().width(), 'canvas width', vballCourt.width(), 'desiredWidth', desiredWidth, 'desiredHeight', desiredHeight, 'vballCourtImgWidth', vballCourtImgWidth);

          vballCourt.height(desiredHeight);
          paper.view.viewSize = new paper.Size(desiredWidth, desiredHeight);
          // $log.debug('adjusted canvas width', vballCourt.width());

          scope.setSizeOfItemsOnCourt();
        }

        scope.clearItems = function() {
          paper.project.clear();
          vballPoints = [];
          vballCourtImgLarge = new paper.Raster('http://cdn.hsgamecenter.com/img/volleyball-court-1280x640.png');
          vballCourtImgSmall = new paper.Raster('http://cdn.hsgamecenter.com/img/volleyball-court-640x320.png');
          vballCourtImg = vballCourtImgLarge;
          vballCourtImgWidth = 1280;
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
          /* item.bulletKill1 = new paper.Path.Line(
              new paper.Point(destination.x - circleDrawingRadius, destination.y - circleDrawingRadius),
              new paper.Point(destination.x + circleDrawingRadius, destination.y + circleDrawingRadius));
          item.bulletKill1.strokeColor = 'red';
          */
          item.bulletKill2 = new paper.Path.Line(
              new paper.Point(destination.x - circleDrawingRadius, destination.y + circleDrawingRadius),
              new paper.Point(destination.x + circleDrawingRadius, destination.y - circleDrawingRadius));
          item.bulletKill2.strokeColor = 'red';

          // put the items together in a group so they hover/glow together
          new paper.Group([item.line, item.bulletStart/*, item.bulletKill1*/, item.bulletKill2, item.bulletEnd]);

          // event handlers
          item.line.onMouseEnter = scope.hitOnEnter;
          item.line.onMouseLeave = scope.hitOnLeave;
          // item.bulletKill1.onMouseEnter = scope.hitOnEnter;
          // item.bulletKill1.onMouseLeave = scope.hitOnLeave;
          item.bulletKill2.onMouseEnter = scope.hitOnEnter;
          item.bulletKill2.onMouseLeave = scope.hitOnLeave;
          item.bulletStart.onMouseEnter = scope.hitOnEnter;
          item.bulletStart.onMouseLeave = scope.hitOnLeave;
          item.bulletEnd.onMouseEnter = scope.hitOnEnter;
          item.bulletEnd.onMouseLeave = scope.hitOnLeave;

          // finally add the item to the array
          vballPoints.push(item);
        }

        scope.buildHitPoints = function(playByPlay, homeTeasonSeasonId) {
          var i, play;

          scope.clearItems();

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
          var view = paper.view,
              viewWidth = view.viewSize.width,
              courtWidthInView = viewWidth - (vballCourtAnchor.x * 2),
              courtHeightInView = view.viewSize.height - (vballCourtAnchor.y * 2),
              scale,
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
          scale = (paper.view.viewSize.width - (courtPerimeter.x * 2)) / vballCourtImgWidth;
          vballCourtImg.position = view.center;
          vballCourtImg.scaling = scale;
          vballCourtImg.sendToBack();
          if (scale >= 1) {
            $log.debug('Not expecting a positive scale of ' + scale + ' based on an image width of ' + vballCourtImgWidth);
          }

          // $log.debug('viewWidth', viewWidth, 'courtWidthInView', courtWidthInView, 'scale', scale, 'vballCourtImgWidth', vballCourtImgWidth);

          // set all the points of the items based on the scale
          for (i = 0; i < vballPointsLength; i++) {
              item = vballPoints[i];

              // turn on the kill marker visibility (which may get turned off again later after turning off the whole attack)
              item.bulletKill2.visible = item.data.grade == 4;
              // unassisted kills have another slash (making an X) but that stat isn't 
              // item.bulletKill1.visible = typeof(item.data.attackUnassisted) !== 'undefined' && item.data.attackUnassisted === true && item.bulletKill2.visible;

              // check if it should be visible or not

              // visibility based on period selections
              if (!scope.selectedHitChartPeriod || scope.selectedHitChartPeriod == item.data.period) {
                  item.line.visible = true;
                  item.bulletStart.visible = true;
                  item.bulletEnd.visible = true;
              } else {
                  item.line.visible = false;
                  item.bulletStart.visible = false;
                  item.bulletEnd.visible = false;
                  // item.bulletKill1.visible = false;
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
                  // item.bulletKill1.visible = false;
                  item.bulletKill2.visible = false;
                  continue;
              }

              // visibility based on hit type selection
              if (scope.hitTypeFilter.EventType == item.data.eventType && (scope.hitTypeFilter.Value == '' || scope.hitTypeFilter.Value == item.data.hitType)) {
                  item.line.visible = true;
                  item.bulletStart.visible = true;
                  item.bulletEnd.visible = true;
              } else {
                  item.line.visible = false;
                  item.bulletStart.visible = false;
                  item.bulletEnd.visible = false;
                  // item.bulletKill1.visible = false;
                  item.bulletKill2.visible = false;
                  continue;
              }

              // figure where on the canvas to put the point
              startTarget = new paper.Point(vballCourtAnchor.x + (courtWidthInView * item.data.origin[1]), vballCourtAnchor.y + (courtHeightInView * item.data.origin[0]));
              endTarget = new paper.Point(vballCourtAnchor.x + (courtWidthInView * item.data.destination[1]), vballCourtAnchor.y + (courtHeightInView * item.data.destination[0]));
              scope.forceMaxEdges(startTarget, { x: viewWidth, y: view.viewSize.height });
              scope.forceMaxEdges(endTarget, { x: viewWidth, y: view.viewSize.height });

              // load the current location of the points
              startLine = item.line.segments[0];
              endLine = item.line.segments[1];
              // attack1LineStart = item.bulletKill1.segments[0];
              // attack1LineEnd = item.bulletKill1.segments[1];
              attack2LineStart = item.bulletKill2.segments[0];
              attack2LineEnd = item.bulletKill2.segments[1];

              // translate/set the new target points (lines by their segments, bullets can use the easier 'position' property)
              startLine.point.x += startTarget.x - startLine.point.x;
              startLine.point.y += startTarget.y - startLine.point.y;
              endLine.point.x += endTarget.x - endLine.point.x;
              endLine.point.y += endTarget.y - endLine.point.y;
              /*
              attack1LineStart.point.x += (endTarget.x - circleDrawingRadius) - attack1LineStart.point.x;
              attack1LineStart.point.y += (endTarget.y - circleDrawingRadius) - attack1LineStart.point.y;
              attack1LineEnd.point.x += (endTarget.x + circleDrawingRadius) - attack1LineEnd.point.x;
              attack1LineEnd.point.y += (endTarget.y + circleDrawingRadius) - attack1LineEnd.point.y;
              */
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

        scope.hitOnEnter = function(evt) {
          evt.target.parent.strokeWidth = 3;
          
          var tgt = evt.target.parent.lastChild,
              desc = tgt.data.description,
              halfOfTooltipWidth = 0,
              topPositionX = 0;

          vballCourtTooltipInner.html(desc);
          vballCourtTooltip.show();
          // dependant on the inner tooltip desc being set and shown before calculating the new width
          halfOfTooltipWidth = (vballCourtTooltip.width() / 2);
          topPositionX = tgt.position.x - halfOfTooltipWidth;

          // $log.debug('target', evt.target, 'parent', evt.target.parent, 'lastChild', evt.target.parent.lastChild)
          // set the data first, to get width dimension set
          // $log.debug('halfOfTooltipWidth', halfOfTooltipWidth, 'topPositionX', topPositionX, 'topPositionX2', tgt.position.x + halfOfTooltipWidth, 'viewSize.width', paper.view.viewSize.width);
          if (topPositionX - halfOfTooltipWidth < 5) {
            vballCourtTooltip
              .removeClass('top left right').addClass('right')
              .css('top', Math.round(tgt.position.y - (vballCourtTooltip.height() / 2)) + 'px')
              .css('left', Math.round(tgt.position.x + 5) + 'px');
          } else if (tgt.position.x + halfOfTooltipWidth > paper.view.viewSize.width - 5) {
            vballCourtTooltip
              .removeClass('top left right').addClass('left')
              .css('top', Math.round(tgt.position.y - (vballCourtTooltip.height() / 2)) + 'px')
              .css('left', Math.round(tgt.position.x - vballCourtTooltip.width() - 15) + 'px');
          } else {
            vballCourtTooltip
              .removeClass('top left right').addClass('top')
              .css('top', Math.round(tgt.position.y - vballCourtTooltip.height() - 15) + 'px')
              .css('left', Math.round(topPositionX) + 'px');
          }
        };

        scope.hitOnLeave = function(evt) {
          vballCourtTooltip.hide();
          evt.target.parent.strokeWidth = 1;
        };

        scope.forceMaxEdges = function(point, maxPoint) {
          // add a little padding since the points are circles
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