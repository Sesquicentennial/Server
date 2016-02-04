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

    var questQuery = "SELECT quests.name, quests.desc, quests.comp_msg, \
    				  quests.creator, images.filename, images.format, images.category \
    				  FROM quests join questImage join images \
    				  WHERE quests.quest_id like quim_id \
    				  and images.image_id like imqu_id";

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

   	outerDef.promise.then(function(rows){
   		var imageDataList = []
		var questData = rows;

   		for (var i = 0; i < rows.length; i++) {

   			imageDataList[i] = {
   				questName : rows[i].name,
   				imageName: rows[i].filename,
   				imageFormat: rows[i].format,
   				imageCategory: rows[i].category 
   			};
   		}

   		getImages(imageDataList).then(function(images) {
   			for (var i = 0; i < images.length; i++) {
   				output.push({
   					name: questData[i].name,
   					desc: questData[i].desc,
   					compMsg: questData[i].comp_msg,
   					creator: questData[i].creator,
   					image: images[i].image
   				});
   			}
   			console.log(output);
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

module.exports = {
	getQuest: getQuest
}
