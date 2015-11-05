var utils = require('../services/utils'),
    database = require('../core/database');

var getNearbyGeofences = function(req, res, next) {
    var requestBody = req.body;
    var radius = req.body.geofence.radius;
    var center = req.body.geofence.location;
    database.geoDB.geofences.find(function(err, geofences) {
        var output = [];
        if (geofences) {
            for (var i = 0; i < geofences.length; i++) {
                if (utils.distanceTo(radius, center, geofences[i].geofence.location)) {
                    output.push(geofences[i]);
                }
            }
            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify({
                content: output
            }));
        } else {
            res.writeHead(404, {});
            res.end(JSON.stringify(err));
        }
    });
    return next();
};

module.exports = {
    getNearbyGeofences: getNearbyGeofences
}
