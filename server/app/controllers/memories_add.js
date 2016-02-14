var _ = require('underscore'),
	Q = require('q'),
	request = require('request'),
	path = require('path'),
	Flickr = require('flickrapi'),
	flickrHelper = require('../services/flickr');

/**
 *
 * Called by the HTTPS request. Formulates a request using the HTTP body
 * and uses Flicker's api handler to write the image to the file system
 * upload the image to Flickr, delete image from the file system, add
 * geotagging to the image and timestamp data
 *
 * Returns:
 * 	- status of the request (success or failure)
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
 * Helper method that uses Flicker's api handler to upload date and time
 * meta data
 *
 * Params:
 *	- flickerApiHandler: handler for flicker's api
 *	- requestOptions : object that contains api_key, image id and date at which
 *					   it was taken
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
 * Helper method that uses Flicker's api handler to add geo data to image
 *
 * Params:
 *	- flickerApiHandler: handler for flicker's api
 *	- requestOptions : object that contains api_key, image id and location info
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
 * Helper method that uses Flicker's api to (not the same as the handler) 
 * upload an image from the file system to the flickr account 
 *
 * Params:
 *	- flickrOptions : options to authenticate the flickr api
 *	- uploadOptions : path of image on the file system, title, desc and other
 * 					  params
 *
 * Returns:
 * 	- promise that resolves to an object containg the imageId
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
 * Writes image to file system using the FS module
 *
 * Params:
 *	- args : contains file name of image and the 64 bit string representation
 *
 * Returns:
 * 	- promise that resolves when image is successfully written to the file system
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
 * Deletes image from file system if it exists
 *
 * Params:
 *	- filePath: absolute file path of the image
 *
 * Returns:
 * 	- promise that resolves when image is deleted
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