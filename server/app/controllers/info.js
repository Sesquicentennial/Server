var utils = require('../services/utils'),
    database = require('../core/database');
    Q = require('q');

var getInfo = function(req, res, next) {
    var self = this;
    var requestBody = req.body;
    var geofences = req.body.geofences;
    var name = req.body.geofences[0];
    for (var i = 0; i < geofences.length; i++) {
        // query for each geofence and get the id
        var query = 'SELECT geofence_id from geofences where geofences.name like "' + geofences[i] + '"';
        var deferred = Q.defer();
        database.connection.query(query, function(err, rows, fields) {
            if (err) throw err;
            deferred.resolve(rows[0].geofence_id);
        });
        deferred.promise.then(function(id) {
            var query = 'select * from geofences join \
                         infoGeofence join info where \
                         geofences.geofence_id = ' + id + ' and \
                         geofences.geofence_id = infoGeofence.g_id \
                         and info.info_id = infoGeofence.i_id'
            database.connection.query(query, function(err, rows, fields) {
                if (err) {
                    res.writeHead(404, {});
                    res.end(JSON.stringify(err));
                } else {
                    output = [];
                    if (rows) {
                        for (var i = 0; i < rows.length; i++) {
                            output.push({
                                    "_id": rows[i].geofence_id,
                                    "name": name,
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
        })
    }
};

module.exports = {
    getInfo: getInfo
}
