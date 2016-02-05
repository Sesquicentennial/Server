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
    var output = [];

    // var defs = {};
    // var promises = [];

    var allQuestsQuery = "SELECT quests.quest_id, quests.name, quests.desc, quests.comp_msg, \
    				  quests.creator, images.filename, images.format, images.category \
    				  FROM quests join questImage join images \
    				  WHERE quests.quest_id like quim_id \
    				  and images.image_id like imqu_id";

   	database.connection.query(allQuestsQuery, function (err, rows, fields) {
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

   	outerDef.promise.then(function(rows){
   	
   		var imageDataList = []
   		var questIds = [];
		var questData = rows;
		
		// make lists to request images and waypoints
   		for (var i = 0; i < rows.length; i++) {
   			// for requesting images
   			imageDataList[i] = {
   				questName : rows[i].name,
   				imageName: rows[i].filename,
   				imageFormat: rows[i].format,
   				imageCategory: rows[i].category 
   			};
   			// for requesting quests
   			questIds.push(rows[i].quest_id);
   		}

   		// request images from file system
   		var imagesPromise = getImages(imageDataList);
   		// request waypoints from the database
   		var waypointsPromise = getWaypoints(questIds);

		Q.all([imagesPromise, waypointsPromise])
		.then (function (data) {	


			var images = data[0];
			var waypoints = data[1];
			
			for (var i = 0; i < questData.length; i++) {
				console.log(waypoints[questData[i].quest_id]);
				output.push({
					name: questData[i].name,
					desc: questData[i].desc,
					compMsg: questData[i].comp_msg,
					creator: questData[i].creator,
					image: images[i].image,
					waypoints: waypoints[questData[i].quest_id]
				});	
			}

			res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
			res.end(JSON.stringify({ content: output }));   

		}); 		

   	});

}

		



// takes in a list of image information, queries DB and returns a promise that resolves to 64bit
// string representation of images
var getImages = function (imageList) {
	
	var def = Q.defer();

	imageHelper.getImages(imageList).then( function (images) {
		def.resolve(images);
	});

	return def.promise;

}

/**
 * returns a list of promises that resolve to a list of waypoint objects
 **/ 
var getWaypoints = function (questList) {

	var def = Q.defer();
	var promiseList = [];

	for (var i = 0; i < questList.length; i++ ) {
		promiseList.push(getWaypoint(questList[i]));
	}

	Q.all(promiseList).then(function (waypoints) {
		
		var output = {};

		for (var i = 0; i < waypoints.length; i++) {
			output[waypoints[i].questId] = waypoints[i].waypoints;
		}

		def.resolve(output);

	});

	return def.promise;
}

/**
 * Helper method that returns a promise that resolves to a waypoint
 **/ 
var getWaypoint = function (questId) {

	var questId = questId;
	var def = Q.defer();

	var query = "SELECT quests.quest_id, waypoints.clue, waypoints.hint,\
				 waypoints.lat, waypoints.lng, waypoints.rad \
				 FROM quests join questWaypoint join waypoints \
				 WHERE quwp_id like '" + questId + "' and waypoints.waypoint_id like wpqu_id";


	database.connection.query(query, function (err, rows, fields) {
		if (err) {
			throw err;
		} else if (rows.length > 0) {
			var quest = {
				questId: questId,
				waypoints: []
			};

			for (var i = 0; i < rows.length; i++) {
				quest.waypoints.push({
					clue: rows[0].clue,
					hint: rows[0].hint,
					lat: rows[0].lat,
					lng: rows[0].lng,
					rad: rows[0].rad
				});
			}
			def.resolve(quest);
		}
	});

	return def.promise;

}

module.exports = {
	getQuest: getQuest
}
