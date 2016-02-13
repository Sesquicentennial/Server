var _ = require('underscore'),
	Q = require('q'),
	request = require('request'),
	path = require('path'),
	Flickr = require('flickrapi'),
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
var addMemory = function(req, res, next) {
	
	console.log('--------------------------');
	console.log('Add Memory Endpoint Called');

	var res = res,
		request = req.body;
	
	flickrHelper.getFlickrHandler().then(function(response) {

		var handler = response.flickrHandler,
			flickrConfig = response.flickrConfig;

		if (request) {

			var imageFilePath = flickrConfig.flickrDir + '/' + request.fileName,
				imageData = {
					photos : [{
						title : request.imageTitle,
						description : request.desc,
						is_public : 0, // this makes it private so we can moderate the stream
						tags : [],  
						photo : imageFilePath
					}]
				}

			// write file to system
			writeImage({

				fileName: imageFilePath,
				fileData: req.body.imageData

			}).then(function (response) {

				uploadImage(flickrConfig,imageData).then( function (response) {

					console.log('Uploaded Successfully to Flickr');
					
					var imageId = response.result[0];
					
					// delete image from fileSystem
					deleteImage(imageFilePath)
					.then( function() {
						console.log('Deleted Image');
					});
					
					handler.photos.geo.setLocation({
						api_key : flickrConfig.api_key,
						photo_id : imageId,
						lat : request.lat,
						lon : request.lng  
					}, function (err, res) {
						
						console.log('Added Geolocation');

	                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
	                    res.end(JSON.stringify({ status : 'Success!' }));

   					});

				});

			});

		}

	});

}

/**
 *
 * Helper method that uses Flicker's api handler to get the url for the image
 * and uses the request api to download the image. Encodes image into a 64bit
 * binary string and wraps it up in a promise
 *
 * Params:
 *	- flickrOptions: handler for flicker's api
 *	- uploadOptions : id for the image being requested
 *
 * Returns:
 * 	- promise that resolves to an object containg the imageId and the 64bit
 *	  encoded string containing the image
 *
 **/
var uploadImage = function(flickrOptions, uploadOptions) {
	
	var def = Q.defer();

	Flickr.authenticate(flickrOptions, function(error, flickr) {
		Flickr.upload(uploadOptions, flickrOptions, function(err, result) {
			if(err) {
				throw err;
			} else {
				def.resolve({
					result: result
				});
			}
		});
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
var writeImage = function(args) {

	var def = Q.defer(),
		filePath = args.fileName;

	fs.writeFile(args.fileName , args.fileData, 'base64', function(err, res) {
		if (err) {
			throw err
		} else {
			def.resolve({});
		}
	});

	return def.promise;

}


/**
 *
 * Checks to see if Flicker's api handler has already been initialized
 * if not, uses credentials in config file to initialize it
 *
 * Returns:
 * 	- promise that resolves to Flickr's api handler
 *
 **/
var deleteImage = function(filePath) {
	console.log(filePath);
	var def = Q.defer();

	fs.unlink(filePath, function(err) {
	   if (err) {
	       throw err;
	   } else {
	   		def.resolve({});
	   }
	});

	return def.promise;

}


module.exports = {
	addMemory : addMemory
}