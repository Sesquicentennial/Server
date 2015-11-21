var utils = require('../services/utils'),
    database = require('../core/database');

var getNearbyGeofences = function(req, res, next) {
    var requestBody = req.body;
    var radius = req.body.geofence.radius;
    var center = req.body.geofence.location;
    
    database.connection.query('SELECT * FROM geofences', function(err, rows, fields) {
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
            }
        }
    });
    // database.geoDB.geofences.find(function(err, geofences) {
    //     var output = [];
    //     if (geofences) {
    //         for (var i = 0; i < geofences.length; i++) {
    //             if (utils.distanceTo(radius, center, geofences[i].geofence.location)) {
    //                 output.push(geofences[i]);
    //             }
    //         }
    //         res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    //         res.end(JSON.stringify({ content: output }));
    //     } else {
    //         res.writeHead(404, {});
    //         res.end(JSON.stringify(err));
    //     }
    // });
    return next();
};

module.exports = {
    getNearbyGeofences: getNearbyGeofences
}
