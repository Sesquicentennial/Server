var Q = require('Q'),
	Flickr = require("flickrapi"),
	config = require("../../config");
	flickrHandler = undefined

var getFlickrHandler = function() {

	var def = Q.defer();

	var flickrOptions = config.flickrOptions;

	if (!flickrHandler) {
		Flickr.authenticate(flickrOptions, function(err, flickr) {
			if (flickr) {
				flickrHandler = flickr;
				def.resolve(flickr);
			} else if (err) {
				throw err
			} else {
				console.log('Could not get Flickr Handler');
			}
 		})
	} else {
		def.resolve(flickrHandler);
	}

	return def.promise;
}

var getMemories = function(req, res, next) {
	
	getFlickrHandler().then(function(response) {

		handler = response;

		var request = {
			api_key: config.flickrOptions.api_key,
			user_id: config.flickrOptions.user_id,
			authenticated: true,
			lat: req.body.lat ? req.body.lat : 44.461319, // defaults to Sayles
			lon: req.body.lng ? req.body.lng : -93.156094, // defaults to Sayles
			radius: req.body.rad ? req.body.rad : 0.1
		};

		handler.photos.search(request, function(err, response) {
			if (err) {
				throw err;
			} else if (response) {
				console.log(response);
			} else {
				console.log('No data returned from Flickr');
			}
		});

	});

}

var addMemories = function(req, res, next) {



}

module.exports = {
	getMemories: getMemories,
	addMemories: addMemories
}