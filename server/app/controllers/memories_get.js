var _ = require('underscore'),
	Q = require('Q'),
	request = require('request'),
	flickrHelper = require('../services/flickr');

/**
 *
 * Called by the HTTPS request. Formulates a request using the HTTP body
 * and uses Flicker's api handler to get Image Ids for all nearby images.
 * Uses helper methods to get the metadata and the image content sends
 * them back to the client
 *
 * Returns:
 * 	- list of objects each containing an image and associated metadata
 *
 **/
var getMemories = function(req, res, next) {

	flickrHelper.getFlickrHandler().then(function(response) {

		var handler = response.flickrHandler,
			flickrConfig = response.flickrConfig;

		var imageRequest = {
			api_key: flickrConfig.api_key,
			user_id: flickrConfig.user_id,
			authenticated: true,
			lat: req.body.lat ? req.body.lat : 44.461319, // defaults to Sayles
			lon: req.body.lng ? req.body.lng : -93.156094, // defaults to Sayles
			radius: req.body.rad ? req.body.rad : 0.1
		};

		// Search for images around the given location
		handler.photos.search(imageRequest, function(err, response) {
		
			if (err) {
				throw err;
			} else if (response) {

				var photos = response.photos.photo,
				 	imagePromises = [],
				 	MetadataPromises = [],
				 	ids = [],
				 	output = [];

				for (var i = 0; i < photos.length; i++) {
					MetadataPromises.push(getImageInfo(handler, {
						api_key: imageRequest.api_key,
						photo_id: photos[i].id
					}));
					imagePromises.push(downloadImage(handler, photos[i].id));
					ids.push(photos[i].id);
				}
			
				Q.all(imagePromises.concat(MetadataPromises)).then( function(response) {

					for (var i = 0; i < ids.length; i++) {
						imageProps = _.where(response, {id : ids[i] });
						var imageObj = {}
						for (var j = 0; j < imageProps.length; j++) {
							_.extend(imageObj, imageProps[j]);
						}
						output.push(imageObj);
					}

                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ content: output }));
				
				});
			
			} else {
				console.log('No data returned from Flickr');
                res.writeHead(500, {});
	            res.end({});
			}
		});

	});

}

/**
 *
 * Helper method that uses Flicker's api handler to get metadata
 * for the image
 *
 * Params:
 *	- flickerApiHandler: handler for flicker's api
 *	- imageParams : object that contains api_key for flickr and an image id
 *
 * Returns:
 * 	- promise that resolves to object containing metadata for the requested image
 *
 **/
var getImageInfo = function (flickrApiHandler, imageParams) {
	
	var def = Q.defer();

	flickrApiHandler.photos.getInfo(imageParams, function (err, response) {
		if (err) {
			throw err
		} else {
			def.resolve({
				id : response.photo.id,
				caption : response.photo.title._content,
				desc : response.photo.description._content,
				uploader : 'carl150', // @todo: figure out a better solution to this
				timestamps: {
					posted: response.photo.dates.posted,
					taken: response.photo.dates.taken
				}
			});
		}
	});

	return def.promise;

}

/**
 *
 * Helper method that uses Flicker's api handler to get the url for the image
 * and uses the request api to download the image. Encodes image into a 64bit
 * binary string and wraps it up in a promise
 *
 * Params:
 *	- flickerApiHandler: handler for flicker's api
 *	- imageId : id for the image being requested
 *
 * Returns:
 * 	- promise that resolves to an object containg the imageId and the 64bit
 *	  encoded string containing the image
 *
 **/
var downloadImage = function (flickrApiHandler, imageId) {

	var def = Q.defer();

	flickrApiHandler.photos.getSizes({ photo_id: imageId }, function (err, response) {
		if (err) {
			throw err
		} else {
			imageUrl = response.sizes.size[response.sizes.size.length - 1].source;
			request(imageUrl, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					image = new Buffer(body.toString(), "binary").toString("base64")
					def.resolve({
						id: imageId,
						image: image
					});
				} else {
					if (err) {
						throw err
					} else {
						// @todo: return 500 here 
						console.log('Image not found');
					}
				}
			});		
		}
	});

	return def.promise;

}

module.exports = {
	getMemories: getMemories
}