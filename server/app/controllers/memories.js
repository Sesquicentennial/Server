var Q = require('Q'),
	request = require('request'),
	_ = require('underscore'),
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

		/**
		 * Search for images around the given location
		 **/
		handler.photos.search(imageRequest, function(err, response) {
			if (err) {
				throw err;
			} else if (response) {
				// console.log(response.photos.photo[0]);
				var photos = response.photos.photo;
				// this array will store each image promise
				var imagePromises = [];
				var MetadataPromises = [];
				var ids = [];
				for (var i = 0; i < photos.length; i++) {
					MetadataPromises.push(getImageInfo(handler, {
						api_key: imageRequest.api_key,
						photo_id: photos[i].id
					}));
					imagePromises.push(downloadImage(handler, photos[i].id));
					ids.push(photos[i].id);
				}
				Q.all(imagePromises.concat(MetadataPromises)).then( function(response) {
					var output = [];
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
				})
			} else {
				console.log('No data returned from Flickr');
                res.writeHead(500, {});
	            res.end({});
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
				uploader : 'carl150',
				timestamps: {
					posted: response.photo.dates.posted,
					taken: response.photo.dates.taken
				}
			});
		}
	});

	return def.promise;

}

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
	getMemories: getMemories,
	addMemories: addMemories
}