var utils = require('../services/utils'),
    database = require('../core/database');

var getInfo = function(req, res, next) {
    var requestBody = req.body;

    database.infoDB.info.find( { geofences: { $in: req.body.geofences } },
        function(error, info) {
            output = [];
            if (info) {
                for (var i = 0; i < info.length; i++) {
                    output.push(info[i]);
                }
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ content: output }));   
            } else if (error) {
                res.writeHead(404, {});
                res.end(JSON.stringify(error));
            }
        });
    return next();
};

module.exports = {
    getInfo: getInfo
}
