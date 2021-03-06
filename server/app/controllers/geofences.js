var utils = require('../services/utils'),
    database = require('../core/database');
/**
 * The /geofences endpoint, which given a client request,
 * returns a set of geofences for the app to monitor with
 * their names and radii.
 */
var getNearbyGeofences = function(req, res, next) {
    var requestBody = req.body;
    var radius = req.body.geofence.radius;
    var center = req.body.geofence.location;
    
    database.pool.getConnection(function(err, connection) {
        connection.query('SELECT * FROM geofences', function(err, rows, fields) {
            if (err) {
                res.writeHead(404, {});
                res.end(JSON.stringify(err));
            } else {
                var output = [];
                if (rows) {
                    for (var i = 0; i < rows.length; i++) {
                        if (utils.distanceTo(radius, center,{ "lat":rows[i].lat, "lng":rows[i].lng })) {
                            output.push({
                                    "id":rows[i].id,
                                    "name": rows[i].name,
                                    "geofence": {
                                        "location": {
                                            "lat": rows[i].lat,
                                            "lng": rows[i].lng
                                        },
                                    "radius": rows[i].radius
                                }
                            })
                        } 
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ content: output }));
                    next();
                }
            }
            connection.release();
        });
    });
    return next();
};

module.exports = {
    getNearbyGeofences: getNearbyGeofences
}
