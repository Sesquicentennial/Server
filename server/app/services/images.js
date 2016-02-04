/**
 * Utility that fetches image files from the filesystem
 **/

var Q = require('q')
	fs = require('fs')
	mime = require('mime')
	database = require('../core/database')
	config = require('../../config');

/**
 * returns a promise that resolves to 
 	{
		image: binary data
		mimeType: mimeType of the loaded image
	}
 **/ 

var getImage = function(args) {

	var imageBase = config.images_base_path;
	var def = Q.defer();
	var imageFormat = args.imageFormat
	var imagePath = imageBase + '/' + args.imageCategory + '/' + args.imageName + '.' + args.imageFormat;

	fs.readFile(imagePath, function(err,data) {
		if (err) {
			throw err;
		} else {
			def.resolve({
				mimeType: mime.lookup(imageFormat),
				image: new Buffer(data).toString('base64')
			});
		}
	});

	return def.promise;
}

var getImages = function(imageList) {
	var def = Q.defer();
	var imagePromises = [];

	for (var i = 0; i < imageList.length; i++) {
		imagePromises.push(getImage(imageList[i]));
	}

	Q.all(imagePromises)
	.then(function (images) {
		def.resolve(images);
	});

	return def.promise;
}

module.exports = {
	getImage : getImage,
	getImages: getImages
}