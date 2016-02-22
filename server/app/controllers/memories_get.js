var _ = require('underscore'),
	Q = require('q'),
	HTTP = require('http'),
	URL = require('url'),
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

	console.log('--------------------------');
	console.log('> Get Memory Endpoint Called');

	flickrHelper.getFlickrHandler().then(function(response) {

		var handler = response.flickrHandler,
			flickrConfig = response.flickrConfig;

		var imageRequest = {
			api_key: flickrConfig.api_key,
			user_id: flickrConfig.user_id,
			authenticated: true,
			lat: req.body.lat ? req.body.lat : 44.461319, // defaults to Sayles
			lon: req.body.lng ? req.body.lng : -93.156094, // defaults to Sayles
			radius: req.body.rad ? req.body.rad : 0.1,
			privacy_filter : 1
		};

		// Search for images around the given location
		handler.photos.search(imageRequest, function(err, response) {

			if (err) {
				throw err;
			} else if (response) {

				console.log('> Search Successfull From Flickr Api');

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
					imagePromises.push(getImageData(handler, photos[i].id));
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
					console.log('> Memories Fetched Successfully!');
					console.log('--------------------------');
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

			console.log('> Image Isnfo Recieved from Server');

			def.resolve({
				id : response.photo.id,
				caption : response.photo.title._content,
				desc : response.photo.description._content,
				uploader : 'carl150', // @todo: figure out a better solution to this
				timestamps: {
					posted: response.photo.dates.posted,
					taken: response.photo.dates.taken
				},

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
var getImageData = function (flickrApiHandler, imageId) {

	var def = Q.defer();
	var imageId = imageId;

	flickrApiHandler.photos.getSizes({ photo_id: imageId }, function (err, response) {
		
		if (err) {
			throw err
		} else {

			console.log('> Received Image Download Urls from Flickr');

			index = Math.round(response.sizes.size.length/2) // pick medium size roughly
			imageUrl = response.sizes.size[index].source;

			downloadImage(imageUrl).then( function (image) {
				def.resolve({
					id : imageId,
					image : image
				});
			});
		}
	});

	return def.promise;

}

/**
 * Downloads image from given url using http and converts it to a 64 bit string
 *
 * Params:
 *	- url : id for the image being requested
 * 
 * Returns:
 *	- promise that resolves to 64 bit encoded string representation of the image
 *
 **/
var downloadImage = function (imageUrl) {

	var def = Q.defer(),
	// create url
    oURL = URL.parse(imageUrl),
    // making the http request
    request = HTTP.get({
        host: oURL.hostname,
        path: oURL.pathname
    });
    // end request
	request.end();
	// request callback
	request.on('response', function (response)
	{
	    var type = response.headers["content-type"],
	        prefix = "data:" + type + ";base64,",
	        body = "";

	    response.setEncoding('binary');
	    
	    response.on('end', function () {
	        var base64 = new Buffer(body, 'binary').toString('base64'),
	            data = base64;
			console.log('> Downloaded Image from URL and Converted to 64 Bit String');
	        def.resolve(data);
	    });

	    response.on('data', function (chunk) {
	        if (response.statusCode == 200) body += chunk;
	    });

	});

	return def.promise;

}


module.exports = {
	getMemories: getMemories
}