var Flickr = require("flickrapi"),
	config = require("../../config");

Flickr.authenticate(config.flickrOptions, function(err, flickr) {
	if (flickr) {
		console.log('Connected to Flickr');
	}
});

var getMemories = function(req, res, next) {
}

var addMemories = function(req, res, next) {
}

module.exports = {
	getMemories: getMemories,
	addMemories: addMemories
}