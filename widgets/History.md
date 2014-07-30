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