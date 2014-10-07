1.0.7 / 2014-10-06
==================

  * Add down and distance to play-by-play
  * Group play-by-play by drive
  * Add support for overtime in play-by-play
  * Various styling and formatting changes

1.0.5 / 2014-08-18
==================

  * Adding additional functions to datacast directive model - getPrimaryColor, getTeamName, getTeamLogo, isFinal, isWinner

1.0.4 / 2014-07-28
==================

  * Added environment configuration.  Please call hsgcWidgets.init() to initialize.  By default this will point to the production environment.  If you would like to point to staging, use hsgcWidgets.init('stage').

1.0.3 / 2014-07-28
==================

  * Added new directive that allows inline templating for datacast properties
    - `<div datacast="unity game key" publisher="publisher key" sport="football"> ... </div>`
    - To render a score for a team, use the syntax `{{getScore('team key')}}`
  * Added some basic logic for hiding widgets that data is unavailable for.  Please include nfhs.css or custom styles.

1.0.2 / 2014-07-16
==================

  * Changed all directives to require unity keys as attributes
    - `<div directiveType game="{unity game key}" publisher="{unity publisher key}"`
  * Added new directive for a full box score (scoreboard, leaders, team stats, scoring summary, play-by-play, rosters, team stats)
    - Syntax: `<div full-box-score game="{unity game key}" publisher={unity publisher key}"`"
  * Added changelog!