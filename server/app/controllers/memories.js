var Flickr = require("flickrapi"),
	config = require("../../config");

var getMemories = function(req, res, next) {

	if (req.body && req.body.geofence) {

	}



	Flickr.authenticate(config.flickrOptions, function(err, flickr) {
		if (flickr) {

			console.log('Connected to Flickr');

			console.log(request);

			flickr.photos.geo.photosForLocation({
				api_key: config.flickrOptions.api_key,
				user_id: config.flickrOptions.user_id,
				authenticated: true,
				lat: req.body.lat,
				lon: req.body.lng,
				accuracy: 16
			}, function(err, result) {
				console.log(result);
			});

		}
	});


}

var addMemories = function(req, res, next) {
}

module.exports = {
	getMemories: getMemories,
	addMemories: addMemories
}