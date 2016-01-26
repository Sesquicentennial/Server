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

	var imageBase = config.imageStore;
	var def = Q.defer();
	var output = {};

	if (args.imageName && args.imageCategory) {

		var dbQuery = "SELECT * FROM imageStore where image_name like \
		'" + args.imageName + "' AND image_category like \
		'" + args.imageCategory + "'";

		database.connection.query(dbQuery, function(err, rows, fields) {
			if (err) { 
				output = err;
			} else {
				if (rows) {
					fs.readFile(rows[0].image_path, function(err, data) {
						if (err) {
							output = err;
						} else {
							def.resolve({
								mimeType: mime.lookup(rows[0].image_type),
								image: data
							});
						}
					});
				}
			}
		});

	}
	return def.promise;
}

module.exports = {
	getImage : getImage
}