var Flickr = require("flickrapi"),
	config = require("../../config");

var getMemories = function(req, res, next) {

	Flickr.authenticate(config.flickrOptions, function(err, flickr) {
		
		if (flickr) {

			flickr.photos.search({
				
				api_key: config.flickrOptions.api_key,
				user_id: config.flickrOptions.user_id,
				authenticated: true,
				lat: req.body.lat,
				lon: req.body.lng,
				accuracy: 16

			}, function(err, result) {

				if (err) {
					throw err;
				} else if (result) {
					console.log(result);
				}

			});

		} else if (err) {

			throw err

		}

	});


}

var addMemories = function(req, res, next) {



}

module.exports = {
	getMemories: getMemories,
	addMemories: addMemories
}