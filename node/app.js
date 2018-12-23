/********************Config*****************/
var username = '';// your Digital Scout username
var password = '';// your Digital Scout password
/********************End Config*****************/

var con = require('console'),    
    hsgc = require('./apiClient'),
    async = require('async');

//this method will grab all box scores for teams associated with your account
getUserBoxScores2();

//this method will grab the football teams associated with your account, and get the box scores for those teams
//getUserBoxScores();

//if you use this function, it will look up all schools by state, all varsity football teams in those schools, and get the box scores for those teams
//getBoxScoresByState();

function getUserBoxScores() {
	if (!username || !password) {
		con.error("Please edit your username and password at the top of app.js.");
		quit();
	}
	hsgc.authenticate(username, password, function(authToken) {
		hsgc.getUserTeams(authToken, function(teams) {
			getBoxScoresForRegion(teams, function(boxScores) {
				boxScores.forEach(function(boxScore) {
					var text = boxScore.AwayTeamName + ' @ ' + boxScore.HomeTeamName + ' - ' + boxScore.StatusDisplay;
					if (boxScore.Status == 'Complete') {
						text = text + ' (' + boxScore.AwayTeamAcronym + ' ' + boxScore.AwayScore + ', ' + boxScore.HomeTeamAcronym + ' ' + boxScore.HomeScore + ')';
					}
					con.info(text);					
				});
			});
		});
	});
}

function getUserBoxScores2() {
	if (!username || !password) {
		con.error("Please edit your username and password at the top of app.js.");
		quit();
	}
	hsgc.authenticate(username, password, function(authToken) {
		console.debug('Authenticated');
		hsgc.getUserBoxScores(authToken, function(boxScores) {
			console.debug('Box scores found: ' + boxScores.length);
			boxScores.forEach(function(boxScore) {
				var text = boxScore.AwayTeamName + ' @ ' + boxScore.HomeTeamName + ' - ' + boxScore.StatusDisplay;
				if (boxScore.Status == 'Complete') {
					text = text + ' (' + boxScore.AwayTeamAcronym + ' ' + boxScore.AwayScore + ', ' + boxScore.HomeTeamAcronym + ' ' + boxScore.HomeScore + ')';
				}
				con.info(text);					
			});
		});
	});
}

function getBoxScoresByState() {
	getFootballTeamsInRegion(function(teams) {
		getBoxScoresForRegion(teams, function(boxScores) {
			boxScores.forEach(function(boxScore) {
				var text = boxScore.AwayTeamName + ' @ ' + boxScore.HomeTeamName + ' - ' + boxScore.StatusDisplay;
				if (boxScore.Status == 'Complete') {
					text = text + ' (' + boxScore.AwayTeamAcronym + ' ' + boxScore.AwayScore + ', ' + boxScore.HomeTeamAcronym + ' ' + boxScore.HomeScore + ')';
				}
				con.info(text);
			});
		});
	});
}	

/************Helper Utilities****************/

function getBoxScoresForRegion(teams, callback) {
	//getFootballTeamsInRegion(function(teams) {
		con.info('Loading box scores...');
		teams.forEach(function(team) {
			team.Seasons.forEach(function(season) {
				if (season.SeasonYear == 2013) {
					hsgc.getBoxScores([ season.TeamSeasonId ], function(games) {	
						callback(games);	
					});		
				}
			});
		});
	//});
}


function getGamesInRegion(callback) {
	getFootballTeamsInRegion(function(teams) {
		con.info('Loading games...');
		teams.forEach(function(team) {
			team.Seasons.forEach(function(season) {
				if (season.SeasonYear == 2013) {
					hsgc.getGamesBySeason(season.TeamSeasonId, function(games) {	
						con.debug('Loaded ' + games.length + ' games');
						callback(games);	
					});		
				}
			});
		});
	});
}

function getFootballTeamsInRegion(callback) {
	getSchoolsInRegion(function(schools) {
		con.info('Loading teams...');
		mergeApiCalls(schools, function(school, cb) {
			hsgc.getTeams('Football', 'Male', 'Varsity', school.SchoolId, function(teams) {	
					cb(teams);
				});
		}, function(teams) {
			con.debug('Loaded ' + teams.length + ' teams');
			callback(teams);
		});
	});
}

function getSchoolsInRegion(callback) {	
	findKansasAndMissouri(function(states) {
		con.info('Loading schools...');
		mergeApiCalls(states, function(state, cb) {
			hsgc.getSchools(state.Id, function(schools) {					
					cb(schools);
				});
		}, function(schools) {
			con.debug('Loaded ' + schools.length + ' schools');
			callback(schools);
		});
	});
}

function findKansasAndMissouri(callback) {
	hsgc.getStates(function(states) {
		con.info('Loading states...');
		var regionStates = [];
		states.forEach(function(state) {			
			if (state.Code == 'MO' || state.Code == 'KS') {						
				regionStates.push(state);				
			}			
		});		
		con.debug('Loaded ' + regionStates.length + ' states');
		callback(regionStates);
	});
}

function mergeApiCalls(collection, apiFunction, callback) {
	var functions = [];
	collection.forEach(function(item) {
		functions.push(function(cb) { 
			apiFunction(item, function(results) {
				cb(null, results);
			});
		});
	});				
	async.parallel(functions, function(err, results) {
		var combinedResults = [];			
		results.forEach(function(result) {
			combinedResults = combinedResults.concat(result);
		});
		callback(combinedResults);
	});
}

function quit() {
	process.exit();
};

