var utils = require('../services/utils'),
    imageHelper = require('../services/images'),
    database = require('../core/database'),
    Q = require('q');
/**
 * the /info endpoint, which returns historical information
 * given a client request with a geofence name from the /geofences endpoint. 
 */
var getInfo = function(req, res, next) {

    var requestBody = req.body;
    var geofences = req.body.geofences ? req.body.geofences : [];
    var outerDef = Q.defer();
    var defs = {};
    var promises = [];

    if (geofences.length > 0) {
        // create query to get geofence ids
        var query = 'SELECT geofence_id from geofences where name like '
       
        for (var i = 0; i < geofences.length; i++) {
            query = query + '"' + geofences[i] + '"';
            if (i !== geofences.length - 1) query = query + ' OR name like ';
        }
        database.pool.getConnection(function(err,connection) {
            // request the ids from the database
            connection.query(query, function(err, rows, fields) {
                if (err) {
                    throw err;
                } else {
                    outerDef.resolve(rows);
                    for (var i = 0; i < rows.length; i++) {
                        var geofenceId = rows[i].geofence_id;
                        defs[geofenceId] = Q.defer();
                        promises.push(defs[geofenceId].promise);
                        // create request for each geofence
                        var query = 'select geofences.name, geofences.geofence_id, info.info_id,\
                                     info.type, info.year, info.month, info.day,\
                                     info.summary, info.data from geofences join \
                                     infoGeofence join info where geofences.geofence_id \
                                     = "' + geofenceId + '" and geofences.geofence_id \
                                    = infoGeofence.gfin_id and info.info_id = infoGeofence.ingf_id';
                        // get the data for each geofence
                        connection.query(query, function(err, rows, fields) {
                            if (err) {
                                throw err;
                            } else {
                                if (rows.length > 0) {
                                    var rows = rows;
                                    var output = [];
                                    var imagePromises = [];
                                    for (var i = 0; i < rows.length; i++) {
                                        // build the JSON for each result
                                        if (rows[i].type === 'text') {
                                            output.push({
                                                "geofence_id": rows[i].geofence_id,
                                                "info_id": rows[i].info_id,
                                                "name": rows[i].name,
                                                "type": rows[i].type,
                                                "summary": rows[i].summary,
                                                "desc": rows[i].data, 
                                                "data" : rows[i].data,
                                                "year": rows[i].year ? rows[i].year : undefined,
                                                "month": rows[i].month ? rows[i].month : undefined,
                                                "day": rows[i].day ? rows[i].day : undefined
                                            });
                                        } else if (rows[i].type === 'image') {
                                            imagePromises.push(getImage(rows[i]));
                                        }
                                    }
                                    if (imagePromises.length > 0 ) {
                                        Q.all(imagePromises).then( function (images) {
                                            output = output.concat(images);
                                            defs[rows[0].geofence_id].resolve({
                                                geofenceName: rows[0].name,
                                                data : output
                                            });        
                                        });                                
                                    } else {
                                        defs[rows[0].geofence_id].resolve({
                                            geofenceName: rows[0].name,
                                            data : output
                                        });
                                    }
                                } else {
                                    defs[geofenceId].resolve({});
                                }
                            }
                            connection.release();
                        });
                    }
                }
            });
        });


        outerDef.promise
        .then(function() {
            if (promises.length > 0) {
                Q.all(promises).then( function(response) {
                    var output = {};
                    for (var i = 0; i < response.length; i++) {
                        output[response[i].geofenceName] = response[i].data;
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ content: output }));
                    next();
                });
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({content: {}}));
                next();
            }           
        })
        .catch(function (err){
            res.writeHead(404, {});
            res.end(JSON.stringify(err));
            next();
        });
    } else {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({content : {}}));
        next();
    }
}       

/** 
 * Given the information from a row for a piece of historical information, 
 * get the image for it.
 */
var getImage = function (args) {
    var infoRowData = args;
    var def = Q.defer();
    var imgQuery = 'select images.filename, images.format, images.category, \
                images.image_id from info join imagesInfo join images \
                where info.info_id like "' + infoRowData.info_id + '" and info.info_id \
                like imagesInfo.inim_id and images.image_id like imagesInfo.imin_id';
    database.pool.getConnection(function(err,connection) {
        connection.query(imgQuery, function(err, rows, fields) {
            if (err) {
                throw err;
            } else {
                if (rows) {
                    for (var i = 0; i < rows.length; i++) {
                        imageHelper.getImage({
                            imageName: rows[i].filename,
                            imageCategory: rows[i].category,
                            imageFormat: rows[i].format
                        }).then(function(response) {               
                            def.resolve({
                                "geofence_id": infoRowData.geofence_id,
                                "info_id": infoRowData.info_id,
                                "type": infoRowData.type,
                                "caption": infoRowData.summary,
                                "desc": infoRowData.data,
                                "year": infoRowData.year ? infoRowData.year : undefined,
                                "month": infoRowData.month ? infoRowData.month : undefined,
                                "day": infoRowData.day ? infoRowData.day : undefined,
                                "data": response.image,
                                "contentType": response.mimeType
                            });   
                        });
                    }
                }
            }
            connection.release();
        });
    });

    return def.promise;
}


module.exports = {
    getInfo: getInfo
}
