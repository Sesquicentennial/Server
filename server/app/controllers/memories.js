var Q = require('Q'),
	request = require('request'),
	Flickr = require("flickrapi"),
	config = require("../../config");
	flickrHelper = require('../services/flickrHelper'),
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

		var handler = response;

		var imageRequest = {
			api_key: config.flickrOptions.api_key,
			user_id: config.flickrOptions.user_id,
			authenticated: true,
			lat: req.body.lat ? req.body.lat : 44.461319, // defaults to Sayles
			lon: req.body.lng ? req.body.lng : -93.156094, // defaults to Sayles
			radius: req.body.rad ? req.body.rad : 0.1
		};

		handler.photos.search(imageRequest, function(err, response) {
			if (err) {
				throw err;
			} else if (response) {
				var photos = response.photos.photo;
				for (var i = 0; i < photos.length; i++) {
					handler.photos.getSizes({
						api_key: imageRequest.api_key,
						photo_id: photos[i].id
					}, function (err, response) {
						if (err) {
							throw err
						} else {
							imageUrl = response.sizes.size[response.sizes.size.length - 1].source;
							// console.log(sizes[sizes.length - 1]);
							request(imageUrl, function (error, response, body) {
								if (!error && response.statusCode == 200) {
									image = new Buffer(body.toString(), "binary").toString("base64")
									console.log(image) // Show the HTML for the Google homepage.
								}
							});
						}
					});
				}
			} else {
				console.log('No data returned from Flickr');
			}
		});

	});

}

var addMemories = function(req, res, next) {

	var request = req.body;


	getFlickrHandler().then(function(response) {

		var handler = response;

		if (request) {

			var imageData = [{
				fileName: request.fileName,
				title: request.imageTitle,
				tags: [],
				photo: config.flickrDir + request.fileName
			}]

			console.log(imageData);

			// write file to system
			flickrHelper.writeImage({
				fileName: req.body.fileName,
				fileData: req.body.imageData
			}).then(function () {
				console.log('here');
				handler.upload( imageData, FlickrOptions, function(err, result) {
					if (err) {
						throw err;
					} else {
						console.log("phoqtos uploaded", result);
						// add geotagging
						// then delete
						flickrHelper.deleteImage(imageData.fileName)
						.then(function(res) {
							res.writeHead(200, {});
							res.end({});
						});
					}
				});
			});
		}
	});
}

module.exports = {
	getMemories: getMemories,
	addMemories: addMemories
}