var utils = require('../services/utils'),
    database = require('../core/database');

var getInfo = function(req, res, next) {
    var requestBody = req.body;
    var radius = req.body.geofence.radius;
    var center = req.body.geofence.location;
    database.db.content.find(function(err, content) {
        var output = [];
        if (content) {
            for (var i = 0; i < content.length; i++) {
                if (utils.distanceTo(radius, center, content[i].location)) {
                    output.push(content[i]);
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
    getInfo: getInfo
}
