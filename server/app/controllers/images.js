/**
 * Utility that fetches image files from the filesystem
 **/
var	Q = require('q')
	imageHelper = require('../services/images');
    
var getImage = function(req, res, next) {

	var imageBase = config.imageStore;
	var requestBody = req.body;

	if (requestBody.imageName && requestBody.imageCategory) {
		imageHelper.getImage({
			imageName: request.imageName,
			imageCategory: request.imageCategory
		}).then(function(response){
			if (response.err) {
				res.writeHead(500);
				res.end(JSON.stringfy(response.err));
			} else {
				res.contentType = response.mimeType;
				res.writeHead(200);
				res.end(response.image,'binary');
			}
		}).catch(function(err){
			res.writeHead(500);
			res.end(JSON.stringfy(err));
		});
	}
	
}

module.exports = {
	getImage : getImage
}