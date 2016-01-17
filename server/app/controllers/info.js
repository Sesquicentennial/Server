var utils = require('../services/utils'),
    database = require('../core/database');
    Q = require('q');

var getInfo = function(req, res, next) {

    var self = this;
    var requestBody = req.body;
    var geofences = req.body.geofences ? req.body.geofences : [];
    var outerDef = Q.defer();
    var defs = {};
    var promises = [];

    // create query to get geofence ids
    var query = 'SELECT geofence_id,name from geofences where name like '
   
    for (var i = 0; i < geofences.length; i++) {
        query = query + '"' + geofences[i] + '"';
        if (i !== geofences.length - 1) query = query + ' OR name like ';
    }
    // request the ids from the database
    database.connection.query(query, function(err, rows, fields) {
        if (err) {
            throw err;
        } else {
            outerDef.resolve(rows);
            for (var i = 0; i < rows.length; i++) {
                var geofenceName = rows[i].name;
                var geofenceId = rows[i].geofence_id;
                defs[geofenceId] = Q.defer();
                promises.push(defs[geofenceId].promise);
                // create request for each geofence
                var query = 'select * from geofences join \
                             infoGeofence join info where \
                             geofences.geofence_id = ' + geofenceId + ' and \
                             geofences.geofence_id = infoGeofence.g_id \
                             and info.info_id = infoGeofence.i_id'
                // get the data for each geofence
                database.connection.query(query, function(err, rows, fields) {
                    if (err) {
                        throw err;
                    } else {
                        if (rows) {
                            defs[rows[0].geofence_id].resolve({
                                    "_id": rows[0].geofence_id,
                                    "name": rows[0].name,
                                    "type": rows[0].type,
                                    "summary": rows[0].summary,
                                    "data": rows[0].data,
                            });
                        }
                    }
                });
            }
        }
    });

    outerDef.promise
    .then(function(){
        if (promises.length > 0) {
            Q.all(promises).then( function(output) {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ content: output }));
            });
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({content: {}}));
        }           
    })
    .catch(function (err){
        res.writeHead(404, {});
        res.end(JSON.stringify(err));
    });
}       
    
module.exports = {
    getInfo: getInfo
}
