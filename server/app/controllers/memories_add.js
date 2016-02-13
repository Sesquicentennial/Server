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

			var imageFilePath = flickrConfig.flickrDir + '/tempUploadFile.jpg' ,
				imageData = {
					photos : [{
						title : request.title,
						description : request.desc,
						is_public : 0, // this makes it private so we can moderate the stream
						tags : [],  
						photo : imageFilePath
					}]
				};

			// write file to system
			writeImage({
				fileName: imageFilePath,
				fileData: request.image
			}).then(function (response) {
				uploadImage(flickrConfig,imageData).then( function (image) {
					Q.all(
						[
							deleteImage(imageFilePath),
							addGeoData(handler, {
								api_key : flickrConfig.api_key,
								photo_id : image.id,
								lat : request.location.lat,
								lon : request.location.lng 
							}),
							addTimestamps(handler, {
								api_key : flickrConfig.api_key,
								photo_id : image.id,
								date_taken : request.timestamp								
							})
						]
					).then(function (response) {
						console.log('Memory Added Successfully!');
						console.log('--------------------------');
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
addTimestamps = function (flickrApiHandler, requestOptions) {
	
	var def = Q.defer();

	flickrApiHandler.photos.setDates(requestOptions, function (err, res) {
		if (err) {
			throw err
 		} else {
			console.log('> Timestamps Added Successfully');
 			def.resolve(res);
 		}
	})

	return def.promise;

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
var addGeoData = function(flickrApiHandler, requestOptions) {

	var def = Q.defer();

	flickrApiHandler.photos.geo.setLocation(requestOptions, function (err, res) {
		if (err) {
			throw err
 		} else {
			console.log('> Geotagging Completed Successfully');
 			def.resolve(res);
 		}
	})

	return def.promise;

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
				console.log('> Image Uploaded Successfully to Flickr');
				def.resolve({
					id : result[0]
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
			console.log('> Image Written Successfully to FileSystem');
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

	var def = Q.defer();

	fs.unlink(filePath, function(err) {
	   if (err) {
	       throw err;
	   } else {
			console.log('> Image Deleted Successfully From FileSystem');
	   		def.resolve({});
	   }
	});

	return def.promise;

}

module.exports = {
	addMemory : addMemory
}