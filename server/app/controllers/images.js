/**
 * Utility that fetches image files from the filesystem
 **/
var	restify = require('restify')
	Q = require('q')
	fs = require('fs')
	mime = require('mime')
	database = require('../core/database')
	config = require('../../config');
    
var getImage = function(req, res, next) {

	var imageBase = config.imageStore;
	var requestBody = req.body;
	var def = Q.defer();

	if (requestBody.imageName && requestBody.imageCategory) {
	
		var dbQuery = "SELECT * FROM imageStore where image_name like \
		'" + requestBody.imageName + "' AND image_category like \
		'" + requestBody.imageCategory + "'";

	    database.connection.query(dbQuery, function(err, rows, fields) {
	        if (err) {
	        	throw err 
	        } else {
	        	if (rows) {
					fs.readFile(rows[0].image_path, function(err, data) {
						console.log(err)
						if (err) {
							res.writeHead(500);
							res.end(JSON.stringfy(err));
							next(err);
							return;
						} else {
							def.resolve({
								'mimeType': mime.lookup(rows[0].image_type),
								image: data
							});
							// res.contentType = mime.lookup(rows[0].image_type);
							// res.writeHead(200);
							// res.end(data,'binary');
							// return next();
						}
					});
	        	}
	        }
	   	});
	}
	def.promise
	.then(function(response){
		res.contentType = response.mimeType;
		res.writeHead(200);
		res.end(response.image,'binary');
	})
	.catch(function(err){
		res.writeHead(500);
		res.end(JSON.stringfy(err));
		next(err);
	});
}

module.exports = {
	getImage : getImage
}