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
		promiseList.push(getWaypointsHelper(questList[i]));
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
var getWaypointsHelper = function (questId) {

	var questId = questId;
	var def = Q.defer();

	var query = "SELECT quests.quest_id, waypoints.waypoint_id, waypoints.lat, waypoints.lng, waypoints.rad \
				 FROM quests join questWaypoint join waypoints \
				 WHERE quwp_id like '" + questId + "' and waypoints.waypoint_id like wpqu_id";


	database.connection.query(query, function (err, rows, fields) {
		if (err) {
			throw err;
		} else if (rows.length > 0) {
			
			var promises = [];

			var quest = {
				questId: questId,
				waypoints: []
			};

			for (var i = 0; i < rows.length; i++) {
				
				var waypoint = {
					lat: rows[i].lat,
					lng: rows[i].lng,
					rad: rows[i].rad					
				}

				promises.push(getClues({"id":rows[i].waypoint_id}));

				quest.waypoints.push(waypoint);
			
			}

			Q.all(promises).then(function (response) {
				
				for (var i = 0; i < quest.waypoints.length; i++) {
					quest.waypoints[i].clue = response[i].clue;
					quest.waypoints[i].hint = response[i].hint;
				}

				def.resolve(quest);				
			});

		}
	});

	return def.promise;

}

/**
 * Method for Getting all the clues and hints associated with each waypoint
 **/
var getClues = function (waypoint) {

	var def = Q.defer();

	var query = "SELECT clues.clue_id, clues.text, clues.type, clues.has_img\
				  FROM waypointClue join clues\
				  WHERE  waypointClue.wpcl_id like '" + waypoint.id + "' and clues.clue_id like waypointClue.clwp_id";

	database.connection.query(query, function (err, rows, fields) {
		if (err) {
			throw err;
		} else if (rows.length > 0) {			

			var output = {};
			var promises = [];

			for (var i = 0; i < rows.length; i++) {
				
				output[rows[i].type] = {text:rows[i].text};
				if (rows[i].has_img) {
					promises.push(getClueImage(rows[i].clue_id));
				}
				
			}

			if (promises.length > 0) {
				Q.all(promises).then(function (response) {
					for (var i = 0; i < response.length; i++) {
						output[response[i].type].image = response[i].image;
					}
					def.resolve(output);
				});
			} else {
				def.resolve(output);				
			}
		} else {
			def.resolve({});
		}
	});

	return def.promise;

}

var getClueImage = function (id) {

	var def = Q.defer();

	var query = "SELECT clues.clue_id, clues.type, images.filename, images.format, images.category\
				 FROM clues join clueImage join images\
				 where clues.clue_id like clim_id and images.image_id like imcl_id";

	database.connection.query(query, function (err, rows, fields) {
		if (err) {
			throw err
		} else if (rows.length > 0) {
			imageHelper.getImage({
				imageCategory: rows[0].category,
				imageName: rows[0].filename,
				imageFormat: rows[0].format
			}).then( function (resImage) {
				def.resolve({
					image: resImage,
					type: rows[0].type
				});
			});
		} else {
			def.resolve({});
		}
	});

	return def.promise;

}



module.exports = {
	getQuest: getQuest
}
