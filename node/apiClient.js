var sys = require('util');
var request = require('request');
request = request.defaults({ headers: { Accept: 'application/json'  }});

var apiRoot = 'http://api.hsgamecenter.com/v1.2';
//this is the identifier that relates seasons together, i.e. the high school 2013 football season
//it can be obtained from http://api.hsgamecenter.com/json/metadata?op=GetUniversalSeasons
var currentUniversalSeasonId = 6;

function authenticate(username, password, callback) {
	apiPost('/authenticate', { username: username, password: password }, function(response) {
		callback(response.AuthToken);
	});
}

function getStates(callback) {
	apiRequest('/states', {}, function(response) {
		callback(response.States);
	});
}

function getSchools(stateId, callback) {
	apiRequest('/schools', { stateId : stateId }, function(response) {
		callback(response.Schools);
	});
}

function getTeams(sport, gender, level, schoolId, callback) {
	apiRequest('/teams', { sport: sport, gender: gender, level: level, schoolId: schoolId }, function(response) {
		callback(response.Teams);
	});
}

function getUserTeams(authToken, callback) {
	apiRequest('/user/teams', { authToken: authToken, sport: 'Football' }, function(response) {
		callback(response.Teams);
	});
}

function getGamesBySeason(seasonId, callback) {
	apiRequest('/teams/' + seasonId + '/games', { }, function(response) {
		callback(response.Games);
	});
}

function getBoxScores(teamSeasonIds, callback) {
	apiRequest('/teams/seasons/' + teamSeasonIds.join(',') + '/football/boxScores', { }, function(response) {
		callback(response.BoxScores);
	});
}

function getUserBoxScores(authToken, callback) {
	apiRequest('/user/teams/football/boxScores', { authToken: authToken, count: 2048, universalSeasonId: currentUniversalSeasonId }, function(response) {
		callback(response.BoxScores);
	});
}

function apiRequest (endpoint, queryString, success) {
	request( { url : apiRoot + endpoint, qs: queryString }, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    success(JSON.parse(body));
	  } else {
	  	console.log('Error: ' + response.statusCode);
	  	//console.log(response);
	  	process.exit();
	  }
	});
}

function apiPost (endpoint, data, success) {
	request( { url : apiRoot + endpoint, json: data, method: 'POST' }, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    success(body);
	  } else {
	  	console.log('Error: ' + response.statusCode);
	  	//console.log(response);
	  	process.exit();
	  }
	});
}

exports.getStates = getStates;
exports.getSchools = getSchools;
exports.getTeams = getTeams;
exports.getGamesBySeason = getGamesBySeason;
exports.getBoxScores = getBoxScores;
exports.getUserTeams = getUserTeams;
exports.authenticate = authenticate;
exports.getUserBoxScores = getUserBoxScores;