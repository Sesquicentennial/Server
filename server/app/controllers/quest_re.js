var utils = require('../services/utils'),
    imageHelper = require('../services/images'),
    database = require('../core/database'),
    Q = require('q');

var getQuest = function (req, res, next) {

	// checks to see if optional parameter limit included in request
    var limit = req.body.limit ? req.body.limit : 20;

    // this will resolve when the first callback fires (quests are returned from the DB)
    var outerDef = Q.defer();

    // JSON object that will contain all the data returned from the server
    var output = {};

    // var defs = {};
    // var promises = [];

    var questQuery = 'SELECT * FROM quests';

   	database.connection.query(questQuery, function (err, rows, fields) {
   		if (err) {
   			throw err
   		} else {
   			if (rows.length > 0) {
   				outerDef.resolve(rows);
   			} else {
   				outerDef.resolve([]);
   			}
   		}
   	});

   	outerDef.promise.then(function(response){
	    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
	    res.end(JSON.stringify({ content: response }));   		
   	});

}

module.exports = {
	getQuest: getQuest
}
