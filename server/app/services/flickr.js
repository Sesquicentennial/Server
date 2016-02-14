/**
 *
 * Flickr Service is a wrapper around the flickr api and the node flickr module
 * has methods for writing to file systems, getting the flickr api handler etc
 *
 **/
var Q = require('Q'),
	fs = require('fs'),
	mime = require('mime'),
	Flickr = require('flickrapi'),
	config = require('../../config'),
	flickrHandler = undefined;

/**
 *
 * Checks to see if Flicker's api handler has already been initialized
 * if not, uses credentials in config file to initialize it
 *
 * Returns:
 * 	- promise that resolves to Flickr's api handler
 *
 **/
var getFlickrHandler = function() {

	var def = Q.defer(),
		flickrOptions = config.flickrOptions;

	if (!flickrHandler) {
		Flickr.authenticate(flickrOptions, function(err, flickr) {
			if (flickr) {
				flickrHandler = flickr;
				def.resolve({
					flickrHandler : flickrHandler,
					flickrConfig : flickrOptions
				});
			} else if (err) {
				throw err
			} else {
				console.log('Could not get Flickr Handler');
			}
 		})
	} else {
		def.resolve({
			flickrHandler : flickrHandler,
			flickrConfig : flickrOptions
		});
	}

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
var deleteImage = function(args) {
	var def = Q.defer();
	var baseImage = config.flickrDir;

	fs.unlink(basePath + args.fileName, function(err) {
	   if (err) {
	       throw err;
	   } else {
	   		def.resolve({});
	   }
	});

	return def.promise;

}


module.exports = {
	getFlickrHandler : getFlickrHandler
}