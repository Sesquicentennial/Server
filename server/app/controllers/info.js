var utils = require('../services/utils'),
    database = require('../core/database');

var getInfo = function(req, res, next) {
    var requestBody = req.body;
    var query = 'select * from geofences \
                 join infoGeofence join info \
                 where geofences.geofence_id = 1 \
                 and geofences.geofence_id = infoGeofence.g_id \
                 and info.info_id = infoGeofence.i_id'
    database.connection.query(query, function(err, rows, fields) {
        if (err) {
            res.writeHead(404, {});
            res.end(JSON.stringify(err));
        } else {
            var output = [];
            if (rows) {
                for (var i = 0; i < rows.length; i++) {
                    output.push({
                            "_id": rows[i].geofence_id,
                            "type": rows[i].type,
                            "summary": rows[i].summary,
                            "data": rows[i].data,
                    });
                }
            }
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ content: output }));
        }
    });
};

module.exports = {
    getInfo: getInfo
}
