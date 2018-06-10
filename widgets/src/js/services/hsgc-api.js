/* jshint -W014 */
angular.module('hsgc').factory('HSGCApi', [
    '$http',
    '$filter',
    '$timeout',
    '$q',
    '$log',
    'hsgcConfig',
    function($http, $filter, $timeout, $q, $log, hsgcConfig) {
        var populateBaseInfo = function(boxScore) {
            $log.debug('Populating base info');

            var scores = {},
                teamIdMapping = {},
                colors = {},
                inOverTime =
                    boxScore.Sport !== 'Volleyball' &&
                    boxScore.CurrentPeriod > boxScore.RegulationPeriodCount,
                homeOTScore = 0,
                awayOTScore = 0,
                startTime = new Date(boxScore.LocalStartTime);

            scores[boxScore.HomeTeamSeasonId] = boxScore.HomeScore;
            scores[boxScore.AwayTeamSeasonId] = boxScore.AwayScore;

            // map all the known keys so the final HSGC ids can be used; include originals to simplify lookup code later
            teamIdMapping[boxScore.HomeTeamSeasonId] =
                boxScore.HomeTeamSeasonId;
            teamIdMapping[boxScore.AwayTeamSeasonId] =
                boxScore.AwayTeamSeasonId;
            teamIdMapping[safeToLower(boxScore.HomeTeamUnityKey)] =
                boxScore.HomeTeamSeasonId;
            teamIdMapping[safeToLower(boxScore.AwayTeamUnityKey)] =
                boxScore.AwayTeamSeasonId;

            colors[safeToLower(boxScore.HomeTeamUnityKey)] = {
                primary: boxScore.HomeTeamPrimaryColor,
                secondary: boxScore.HomeTeamSecondaryColor
            };
            colors[safeToLower(boxScore.AwayTeamUnityKey)] = {
                primary: boxScore.AwayTeamPrimaryColor,
                secondary: boxScore.AwayTeamSecondaryColor
            };
            colors[boxScore.HomeTeamSeasonId] = {
                primary: '#' + boxScore.HomeTeamPrimaryColor,
                secondary: '#' + boxScore.HomeTeamSecondaryColor
            };
            colors[boxScore.AwayTeamSeasonId] = {
                primary: '#' + boxScore.AwayTeamPrimaryColor,
                secondary: '#' + boxScore.AwayTeamSecondaryColor
            };

            if (inOverTime) {
                for (
                    var i = boxScore.RegulationPeriodCount;
                    i < boxScore.CurrentPeriod;
                    i++
                ) {
                    homeOTScore += boxScore.HomePeriodScores[i].Score;
                    awayOTScore += boxScore.AwayPeriodScores[i].Score;
                }
            }

            var homeLogoNormalized =
                (boxScore.HomeTeamLogo.indexOf('http') === 0
                    ? ''
                    : hsgcConfig.imageRoot) + boxScore.HomeTeamLogo;
            var awayLogoNormalized =
                (boxScore.AwayTeamLogo.indexOf('http') === 0
                    ? ''
                    : hsgcConfig.imageRoot) + boxScore.AwayTeamLogo;

            var scoringPlaysByPeriod = {};

            if (boxScore.ScoringPlays) {
                boxScore.ScoringPlays.forEach(function(play) {
                    if (!scoringPlaysByPeriod[play.Quarter]) {
                        scoringPlaysByPeriod[play.Quarter] = [];
                    }
                    scoringPlaysByPeriod[play.Quarter].push(play);
                });
            }

            return {
                hsgcGameId: boxScore.GameId,
                hsgcHomeSchoolId: boxScore.HomeSchoolId,
                hsgcAwaySchoolId: boxScore.AwaySchoolId,
                teamIdMapping: teamIdMapping,
                homeTeamSeasonId: boxScore.HomeTeamSeasonId,
                awayTeamSeasonId: boxScore.AwayTeamSeasonId,
                homeTeamKey: boxScore.HomeTeamUnityKey,
                awayTeamKey: boxScore.AwayTeamUnityKey,
                homeScore: boxScore.FinalScoresInFirstPeriod
                    ? boxScore.HomePeriodScores[0].Score
                    : boxScore.HomeScore,
                awayScore: boxScore.FinalScoresInFirstPeriod
                    ? boxScore.AwayPeriodScores[0].Score
                    : boxScore.AwayScore,
                periodScores: boxScore.PeriodScores,
                regulationPeriodCount: boxScore.RegulationPeriodCount,
                totalScores: scores,
                awayPeriodScores: boxScore.AwayPeriodScores,
                homePeriodScores: boxScore.HomePeriodScores,
                homeLogo:
                    homeLogoNormalized +
                    '&width=' +
                    hsgcConfig.logoStdResWidth +
                    '&height=' +
                    hsgcConfig.logoStdResHeight,
                awayLogo:
                    awayLogoNormalized +
                    '&width=' +
                    hsgcConfig.logoStdResWidth +
                    '&height=' +
                    hsgcConfig.logoStdResHeight,
                homeLogoHigh:
                    homeLogoNormalized +
                    '&width=' +
                    hsgcConfig.logoHighResWidth +
                    '&height=' +
                    hsgcConfig.logoHighResHeight,
                awayLogoHigh:
                    awayLogoNormalized +
                    '&width=' +
                    hsgcConfig.logoHighResWidth +
                    '&height=' +
                    hsgcConfig.logoHighResHeight,
                homeName: boxScore.HomeTeamName,
                awayName: boxScore.AwayTeamName,
                homeShortName:
                    boxScore.HomeTeamShortName || boxScore.HomeTeamName,
                awayShortName:
                    boxScore.AwayTeamShortName || boxScore.AwayTeamName,
                homeAcronym: boxScore.HomeTeamAcronym.toUpperCase(),
                awayAcronym: boxScore.AwayTeamAcronym.toUpperCase(),
                homeMascot: boxScore.HomeTeamMascot,
                awayMascot: boxScore.AwayTeamMascot,
                homeStats:
                    boxScore.Sport === 'Basketball'
                        ? boxScore.HomeTeamTotalStats
                        : boxScore.HomeTeamStatistics,
                awayStats:
                    boxScore.Sport === 'Basketball'
                        ? boxScore.AwayTeamTotalStats
                        : boxScore.AwayTeamStatistics,
                homeSlug: boxScore.HomeTeamSlug,
                awaySlug: boxScore.AwayTeamSlug,
                homeAsReportedBy: boxScore.HomeTeamAsReportedBy,
                awayAsReportedBy: boxScore.AwayTeamAsReportedBy,
                playByPlay: boxScore.PlaysInGame,
                scoringPlays: boxScore.ScoringPlays,
                scoringPlaysByPeriod: scoringPlaysByPeriod,
                currentPeriod: boxScore.CurrentPeriod,
                scoresAvailable: boxScore.ScoresAvailable,
                statsAvailable: boxScore.StatsAvailable,
                playByPlayAvailable: boxScore.PlayByPlayAvailable,
                leadersAvailable: boxScore.LeadersAvailable,
                status: boxScore.Status,
                statusPretty:
                    boxScore.Status === 'Complete'
                        ? 'Final'
                        : boxScore.Status === 'InProgress'
                            ? 'In Progress'
                            : boxScore.Status === 'NoData'
                                ? 'Connection Lost'
                                : boxScore.Status,
                statusDisplay: boxScore.StatusDisplay,
                localStartTime: startTime,
                longDateTimeDisplay:
                    startTime.getFullYear() === new Date().getFullYear()
                        ? ''
                        : $filter('date')(
                              startTime,
                              'MMMM d, yyyy h:mm a'
                          ) /* time zone acronym is need instead of long version of boxScore.TimeZone*/,
                colors: colors,
                inOverTime: inOverTime,
                awayOvertimeScore: awayOTScore,
                homeOvertimeScore: homeOTScore,
                gameDetailLink: boxScore.GameDetailLink,
                gameType:
                    boxScore.GameType === 'RegularSeason'
                        ? 'Regular Season'
                        : boxScore.GameType,
                gender: boxScore.Gender,
                finalScoresInFirstPeriod: boxScore.FinalScoresInFirstPeriod,
                sport: boxScore.Sport,

                getScore: function(key) {
                    var tsId = this.teamIdMapping[safeToLower(key)];
                    return this.totalScores[tsId];
                },
                getPrimaryColor: function(key) {
                    return colors[key].primary;
                },
                getSecondaryColor: function(key) {
                    return colors[key].secondary;
                },
                getTeamName: function(key) {
                    if (
                        this.teamIdMapping[safeToLower(key)] ==
                        this.homeTeamSeasonId
                    ) {
                        return this.homeName;
                    } else {
                        return this.awayName;
                    }
                },
                getTeamNameFirstAlphaChar: function(key) {
                    var teamName = this.getTeamName(key);
                    return teamName.charAt(teamName.search(/[A-Za-z]/));
                },
                getTeamLogo: function(key) {
                    if (
                        this.teamIdMapping[safeToLower(key)] ==
                        this.homeTeamSeasonId
                    ) {
                        return this.homeLogo;
                    } else {
                        return this.awayLogo;
                    }
                },
                teamHasRealLogo: function(key) {
                    var logo = this.getTeamLogo(key);
                    var default_logo = '/Default_profile_icon.png';
                    return !this.endsWith(logo, default_logo);
                },
                endsWith: function(str, suffix) {
                    return (
                        str.indexOf(suffix, str.length - suffix.length) !== -1
                    );
                },
                isFinal: function() {
                    return this.status === 'Complete';
                },
                isWinner: function(teamKey) {
                    if (this.isFinal()) {
                        if (
                            this.homeScore > this.awayScore &&
                            this.teamIdMapping[safeToLower(teamKey)] ==
                                this.homeTeamSeasonId
                        ) {
                            return true;
                        }
                        if (
                            this.homeScore < this.awayScore &&
                            this.teamIdMapping[safeToLower(teamKey)] ==
                                this.awayTeamSeasonId
                        ) {
                            return true;
                        }
                    }
                    return false;
                },
                asReportedBy: function(teamKey) {
                    if (
                        this.teamIdMapping[safeToLower(teamKey)] ==
                        this.homeTeamSeasonId
                    ) {
                        return this.homeAsReportedBy;
                    }

                    return this.awayAsReportedBy;
                }
            };
        };

        var populateLeaderInfo = function(boxScore, bs, $filter) {
            $log.debug('Populating leader info');

            if (boxScore.Sport === 'Basketball') {
                if (bs.statsAvailable) {
                    bs.leadersAvailable = true;
                    bs.leaders = {};
                    bs.leaders[bs.homeTeamSeasonId] = {
                        points: {
                            value: 0
                        },
                        rebounds: {
                            value: 0
                        },
                        assists: {
                            value: 0
                        }
                    };
                    bs.leaders[bs.awayTeamSeasonId] = {
                        points: {
                            value: 0
                        },
                        rebounds: {
                            value: 0
                        },
                        assists: {
                            value: 0
                        }
                    };

                    boxScore.PlayerStatistics.forEach(function(ps) {
                        if (ps.PlayerId > 0) {
                            var player = $filter('getPlayerById')(
                                bs.players,
                                ps.PlayerId,
                                ps.TeamSeasonId
                            );

                            if (
                                bs.leaders[ps.TeamSeasonId].points.value <
                                ps.TotalPoints
                            ) {
                                bs.leaders[ps.TeamSeasonId].points.value =
                                    ps.TotalPoints;
                                bs.leaders[ps.TeamSeasonId].points.firstName =
                                    ps.FirstName;
                                bs.leaders[ps.TeamSeasonId].points.lastName =
                                    ps.LastName;
                                bs.leaders[
                                    ps.TeamSeasonId
                                ].points.jerseyNumber =
                                    ps.JerseyNumber;
                                bs.leaders[ps.TeamSeasonId].points.displayName =
                                    player.DisplayName;
                                bs.leaders[ps.TeamSeasonId].points.playerSlug =
                                    player.PlayerSlug;
                            }

                            if (
                                bs.leaders[ps.TeamSeasonId].rebounds.value <
                                ps.TotalRebounds
                            ) {
                                bs.leaders[ps.TeamSeasonId].rebounds.value =
                                    ps.TotalRebounds;
                                bs.leaders[ps.TeamSeasonId].rebounds.firstName =
                                    ps.FirstName;
                                bs.leaders[ps.TeamSeasonId].rebounds.lastName =
                                    ps.LastName;
                                bs.leaders[
                                    ps.TeamSeasonId
                                ].rebounds.jerseyNumber =
                                    ps.JerseyNumber;
                                bs.leaders[
                                    ps.TeamSeasonId
                                ].rebounds.displayName =
                                    player.DisplayName;
                                bs.leaders[
                                    ps.TeamSeasonId
                                ].rebounds.playerSlug =
                                    player.PlayerSlug;
                            }

                            if (
                                bs.leaders[ps.TeamSeasonId].assists.value <
                                ps.Assists
                            ) {
                                bs.leaders[ps.TeamSeasonId].assists.value =
                                    ps.Assists;
                                bs.leaders[ps.TeamSeasonId].assists.firstName =
                                    ps.FirstName;
                                bs.leaders[ps.TeamSeasonId].assists.lastName =
                                    ps.LastName;
                                bs.leaders[
                                    ps.TeamSeasonId
                                ].assists.jerseyNumber =
                                    ps.JerseyNumber;
                                bs.leaders[
                                    ps.TeamSeasonId
                                ].assists.displayName =
                                    player.DisplayName;
                                bs.leaders[ps.TeamSeasonId].assists.playerSlug =
                                    player.PlayerSlug;
                            }
                        }
                    });
                }

                return;
            }

            if (boxScore.Sport === 'Volleyball') {
                if (bs.statsAvailable) {
                    bs.leadersAvailable = true;
                    bs.leaders = {};
                    bs.leaders[bs.homeTeamSeasonId] = {
                        attackKills: {
                            value: 0
                        },
                        aces: {
                            value: 0
                        },
                        blocks: {
                            value: 0
                        }
                    };
                    bs.leaders[bs.awayTeamSeasonId] = {
                        attackKills: {
                            value: 0
                        },
                        aces: {
                            value: 0
                        },
                        blocks: {
                            value: 0
                        }
                    };

                    boxScore.PlayerStatistics.forEach(function(ps) {
                        if (ps.PlayerId > 0) {
                            var player = $filter('getPlayerById')(
                                bs.players,
                                ps.PlayerId,
                                ps.TeamSeasonId
                            );

                            if (
                                bs.leaders[ps.TeamSeasonId].attackKills.value <
                                ps.AttackKills
                            ) {
                                bs.leaders[ps.TeamSeasonId].attackKills.value =
                                    ps.AttackKills;
                                bs.leaders[
                                    ps.TeamSeasonId
                                ].attackKills.firstName =
                                    ps.FirstName;
                                bs.leaders[
                                    ps.TeamSeasonId
                                ].attackKills.lastName =
                                    ps.LastName;
                                bs.leaders[
                                    ps.TeamSeasonId
                                ].attackKills.jerseyNumber =
                                    ps.JerseyNumber;
                                bs.leaders[
                                    ps.TeamSeasonId
                                ].attackKills.displayName =
                                    player.DisplayName;
                                bs.leaders[
                                    ps.TeamSeasonId
                                ].attackKills.playerSlug =
                                    player.PlayerSlug;
                            }
                            if (
                                bs.leaders[ps.TeamSeasonId].aces.value <
                                ps.ServeAces
                            ) {
                                bs.leaders[ps.TeamSeasonId].aces.value =
                                    ps.ServeAces;
                                bs.leaders[ps.TeamSeasonId].aces.firstName =
                                    ps.FirstName;
                                bs.leaders[ps.TeamSeasonId].aces.lastName =
                                    ps.LastName;
                                bs.leaders[ps.TeamSeasonId].aces.jerseyNumber =
                                    ps.JerseyNumber;
                                bs.leaders[ps.TeamSeasonId].aces.displayName =
                                    player.DisplayName;
                                bs.leaders[ps.TeamSeasonId].aces.playerSlug =
                                    player.PlayerSlug;
                            }
                            if (
                                bs.leaders[ps.TeamSeasonId].blocks.value <
                                ps.Assists
                            ) {
                                bs.leaders[ps.TeamSeasonId].blocks.value =
                                    ps.BlockSolos +
                                    ps.BlockAssists /* Math.floor(ps.BlockAssists / 2) */;
                                bs.leaders[ps.TeamSeasonId].blocks.firstName =
                                    ps.FirstName;
                                bs.leaders[ps.TeamSeasonId].blocks.lastName =
                                    ps.LastName;
                                bs.leaders[
                                    ps.TeamSeasonId
                                ].blocks.jerseyNumber =
                                    ps.JerseyNumber;
                                bs.leaders[ps.TeamSeasonId].blocks.displayName =
                                    player.DisplayName;
                                bs.leaders[ps.TeamSeasonId].blocks.playerSlug =
                                    player.PlayerSlug;
                            }
                        }
                    });
                }

                return;
            }

            if (bs.leadersAvailable) {
                bs.leaders = {};
                var playerId, currentStat, currentTeamSeasonId;

                if (boxScore.GameLeaders.AwayTeamPassingLeader) {
                    playerId = boxScore.GameLeaders.AwayTeamPassingLeader.Item1;
                    currentStat =
                        boxScore.GameLeaders.AwayTeamPassingLeader.Item2;
                    currentTeamSeasonId = boxScore.AwayTeamSeasonId;
                    bs.leaders.awayPassingLeaderSlug =
                        playerId > 0
                            ? $filter('getPlayerById')(
                                  bs.players,
                                  playerId,
                                  currentTeamSeasonId
                              ).PlayerSlug
                            : null;
                    bs.leaders.awayPassingLeader = $filter('stringFormat')(
                        '{0}: {1}-{2}, {3} yds, {4} tds',
                        [
                            $filter('getPlayerShortNameById')(
                                bs.players,
                                playerId,
                                currentTeamSeasonId
                            ),
                            currentStat.PassingCompletions,
                            currentStat.PassingAttempts,
                            currentStat.PassingYards,
                            currentStat.PassingTouchdowns
                        ]
                    );
                }

                if (boxScore.GameLeaders.AwayTeamRushingLeader) {
                    playerId = boxScore.GameLeaders.AwayTeamRushingLeader.Item1;
                    currentStat =
                        boxScore.GameLeaders.AwayTeamRushingLeader.Item2;
                    currentTeamSeasonId = boxScore.AwayTeamSeasonId;
                    bs.leaders.awayRushingLeaderSlug =
                        playerId > 0
                            ? $filter('getPlayerById')(
                                  bs.players,
                                  playerId,
                                  currentTeamSeasonId
                              ).PlayerSlug
                            : null;
                    bs.leaders.awayRushingLeader = $filter('stringFormat')(
                        '{0}: {1} car, {2} yds, {3} tds',
                        [
                            $filter('getPlayerShortNameById')(
                                bs.players,
                                playerId,
                                currentTeamSeasonId
                            ),
                            currentStat.RushingAttempts,
                            currentStat.RushingYards,
                            currentStat.RushingTouchdowns
                        ]
                    );
                }

                if (boxScore.GameLeaders.AwayTeamReceivingLeader) {
                    playerId =
                        boxScore.GameLeaders.AwayTeamReceivingLeader.Item1;
                    currentStat =
                        boxScore.GameLeaders.AwayTeamReceivingLeader.Item2;
                    currentTeamSeasonId = boxScore.AwayTeamSeasonId;
                    bs.leaders.awayReceivingLeaderSlug =
                        playerId > 0
                            ? $filter('getPlayerById')(
                                  bs.players,
                                  playerId,
                                  currentTeamSeasonId
                              ).PlayerSlug
                            : null;
                    bs.leaders.awayReceivingLeader = $filter('stringFormat')(
                        '{0}: {1} rec, {2} yds, {3} tds',
                        [
                            $filter('getPlayerShortNameById')(
                                bs.players,
                                playerId,
                                currentTeamSeasonId
                            ),
                            currentStat.ReceivingCatches,
                            currentStat.ReceivingYards,
                            currentStat.ReceivingTouchdowns
                        ]
                    );
                }

                if (boxScore.GameLeaders.HomeTeamPassingLeader) {
                    playerId = boxScore.GameLeaders.HomeTeamPassingLeader.Item1;
                    currentStat =
                        boxScore.GameLeaders.HomeTeamPassingLeader.Item2;
                    currentTeamSeasonId = boxScore.HomeTeamSeasonId;
                    bs.leaders.homePassingLeaderSlug =
                        playerId > 0
                            ? $filter('getPlayerById')(
                                  bs.players,
                                  playerId,
                                  currentTeamSeasonId
                              ).PlayerSlug
                            : null;
                    bs.leaders.homePassingLeader = $filter('stringFormat')(
                        '{0}: {1}-{2}, {3} yds, {4} tds',
                        [
                            $filter('getPlayerShortNameById')(
                                bs.players,
                                playerId,
                                currentTeamSeasonId
                            ),
                            currentStat.PassingCompletions,
                            currentStat.PassingAttempts,
                            currentStat.PassingYards,
                            currentStat.PassingTouchdowns
                        ]
                    );
                }

                if (boxScore.GameLeaders.HomeTeamRushingLeader) {
                    playerId = boxScore.GameLeaders.HomeTeamRushingLeader.Item1;
                    currentStat =
                        boxScore.GameLeaders.HomeTeamRushingLeader.Item2;
                    currentTeamSeasonId = boxScore.HomeTeamSeasonId;
                    bs.leaders.homeRushingLeaderSlug =
                        playerId > 0
                            ? $filter('getPlayerById')(
                                  bs.players,
                                  playerId,
                                  currentTeamSeasonId
                              ).PlayerSlug
                            : null;
                    bs.leaders.homeRushingLeader = $filter('stringFormat')(
                        '{0}: {1} car, {2} yds, {3} tds',
                        [
                            $filter('getPlayerShortNameById')(
                                bs.players,
                                playerId,
                                currentTeamSeasonId
                            ),
                            currentStat.RushingAttempts,
                            currentStat.RushingYards,
                            currentStat.RushingTouchdowns
                        ]
                    );
                }

                if (boxScore.GameLeaders.HomeTeamReceivingLeader) {
                    playerId =
                        boxScore.GameLeaders.HomeTeamReceivingLeader.Item1;
                    currentStat =
                        boxScore.GameLeaders.HomeTeamReceivingLeader.Item2;
                    currentTeamSeasonId = boxScore.HomeTeamSeasonId;
                    bs.leaders.homeReceivingLeaderSlug =
                        playerId > 0
                            ? $filter('getPlayerById')(
                                  bs.players,
                                  playerId,
                                  currentTeamSeasonId
                              ).PlayerSlug
                            : null;
                    bs.leaders.homeReceivingLeader = $filter('stringFormat')(
                        '{0}: {1} rec, {2} yds, {3} tds',
                        [
                            $filter('getPlayerShortNameById')(
                                bs.players,
                                playerId,
                                currentTeamSeasonId
                            ),
                            currentStat.ReceivingCatches,
                            currentStat.ReceivingYards,
                            currentStat.ReceivingTouchdowns
                        ]
                    );
                }
            }
        };

        var safeToLower = function(toLower) {
            if (typeof toLower === 'undefined') {
                return '';
            } else {
                return toLower.toLowerCase();
            }
        };

        var populatePlayerStats = function(boxScore, bs) {
            bs.playerStats = {};
            if (
                boxScore.Sport === 'Basketball' ||
                boxScore.Sport === 'Volleyball'
            ) {
                bs.playerStats[boxScore.HomeTeamSeasonId] =
                    boxScore.HomeTeamPlayerStats;
                bs.playerStats[boxScore.AwayTeamSeasonId] =
                    boxScore.AwayTeamPlayerStats;
            } else if (boxScore.Sport === 'Football') {
                bs.playerStats[boxScore.HomeTeamSeasonId] = {
                    passingStats: boxScore.HomeTeamPassingStatistics,
                    rushingStats: boxScore.HomeTeamRushingStatistics,
                    receivingStats: boxScore.HomeTeamReceivingStatistics,
                    defensiveStats: boxScore.HomeTeamDefensiveStatistics,
                    kickingStats: boxScore.HomeTeamKickingStatistics,
                    puntingStats: boxScore.HomeTeamPuntingStatistics,
                    puntReturnStats: boxScore.HomeTeamPuntReturnStatistics,
                    kickReturnStats: boxScore.HomeTeamKickReturnStatistics
                };

                bs.playerStats[boxScore.AwayTeamSeasonId] = {
                    passingStats: boxScore.AwayTeamPassingStatistics,
                    rushingStats: boxScore.AwayTeamRushingStatistics,
                    receivingStats: boxScore.AwayTeamReceivingStatistics,
                    defensiveStats: boxScore.AwayTeamDefensiveStatistics,
                    kickingStats: boxScore.AwayTeamKickingStatistics,
                    puntingStats: boxScore.AwayTeamPuntingStatistics,
                    puntReturnStats: boxScore.AwayTeamPuntReturnStatistics,
                    kickReturnStats: boxScore.AwayTeamKickReturnStatistics
                };
            } else {
                $log.debug(
                    boxScore.Sport +
                        ' not implemented so player stats could not be populated'
                );
            }
        };

        var populatePlayers = function(boxScore, bs, $filter) {
            var players = boxScore.Players;

            // generate a URL to the player page
            angular.forEach(players, function(value) {
                value.PlayerSlug =
                    hsgcConfig.statsRoot +
                    'player/' +
                    value.PlayerId +
                    '/' +
                    boxScore.Sport.toLowerCase() +
                    '/' +
                    value.TeamSeasonId;
            });

            bs.players = {};
            bs.players[boxScore.HomeTeamSeasonId] = $filter('filter')(players, {
                TeamSeasonId: boxScore.HomeTeamSeasonId
            });
            bs.players[boxScore.AwayTeamSeasonId] = $filter('filter')(players, {
                TeamSeasonId: boxScore.AwayTeamSeasonId
            });
        };

        var getFullBox = function(gameKey, publisherKey, apiKey, sport, options) {
            if (
                sport === 'Football' ||
                sport === 'Basketball' ||
                sport === 'Volleyball'
            ) {
                $log.debug('Getting full box for sport: ' + sport);

                var url = '',
                    config = {
                        params: {},
                        cache: false, // eager-caching handled by the server
                        timeout: hsgcConfig.apiNetworkTimeoutMs
                    };
                angular.extend(config.params, options);

                if (hsgcConfig.keyStrategy === "ds-key") {
                    config.headers = { 'X-API-Key': apiKey };
                }

                if (hsgcConfig.keyStrategy === 'unity') {
                    url =
                        hsgcConfig.apiRoot +
                        'games/thirdparty/' +
                        hsgcConfig.keyStrategy +
                        '/' +
                        gameKey;
                    return $http.get(url, config).then(
                        function(boxScore) {
                            // success
                            var bs = populateBaseInfo(boxScore.data);
                            populatePlayers(boxScore.data, bs, $filter);
                            populateLeaderInfo(boxScore.data, bs, $filter);
                            populatePlayerStats(boxScore.data, bs);
                            return bs;
                        },
                        function(response) {
                            // error
                            hsgcConfig.datacastLoadError(
                                response.data,
                                response.status,
                                response.statusText
                            );
                            var result = {
                                status: response.status,
                                statusText: response.statusText
                            };

                            if (response.status == 402) {
                                result.boxScore = populateBaseInfo(
                                    response.data
                                );
                                hsgcConfig.datacastPaymentRequired(
                                    response.data
                                );
                            }

                            return $q.reject(result);
                        }
                    );
                } else {
                    // hsgc code
                    url = hsgcConfig.apiRoot + 'games/' + gameKey;
                    return $http.get(url, config).then(
                        function(boxScore) {
                            // success
                            var bs = populateBaseInfo(boxScore.data);
                            populatePlayers(boxScore.data, bs, $filter);
                            populateLeaderInfo(boxScore.data, bs, $filter);
                            populatePlayerStats(boxScore.data, bs);
                            return bs;
                        },
                        function(response) {
                            // error
                            hsgcConfig.datacastLoadError(
                                response.data,
                                response.status,
                                response.statusText
                            );
                            var result = {
                                status: response.status,
                                statusText: response.statusText
                            };

                            if (response.status == 402) {
                                result.boxScore = populateBaseInfo(
                                    response.data
                                );
                                hsgcConfig.datacastPaymentRequired(
                                    response.data
                                );
                            }

                            return $q.reject(result);
                        }
                    );
                }
            } else {
                $log.error(sport + ' not implemented');
                //I don't know how to return an empty promise
                var deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
            }
        };

        return {
            getFullBox: getFullBox
        };
    }
]);
