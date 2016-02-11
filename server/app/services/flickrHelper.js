/**
 * Utilities that writes Flickr Files Temporarily to the FS
 **/

var Q = require('q')
	fs = require('fs')
	mime = require('mime')
	database = require('../core/database')
	config = require('../../config');


var writeImage = function(args) {

	var def = Q.defer;	
	var basePath = config.flickrDir;

	fs.writeFile(basePath + args.fileName , args.fileData, function(err) {
		if (err) {
			throw err
		} else {
			def.resolve();
		}
	});

	return def.promise;
}

var deleteImage = function(args) {

	var def = Q.defer;
	var baseImage = config.flickrDir;

	fs.unlink(basePath + args.fileName, function(err) {
	   if (err) {
	       throw err;
	   } else {
	   		defer.resolve();
	   }
	});

	return def.promise;
}


module.exports = {
	writeImage: writeImage,
	deleteImage: deleteImage
}