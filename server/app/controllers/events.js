var database = require('../core/database');

var getEvents = function(req, res, next) {
    var requestBody = req.body;
    var startTime = req.body.timespan.startTime;
    var endTime = req.body.timespan.endTime;

    // just some dummy code for now to test if the endpoint is working. 
    // need to create a database table for the data before querying. 
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    var output = [];
    output.push({
            "startTime": startTime,
            "endTime": endTime, 
            "venue": "CMC"
    });
    
    res.end(JSON.stringify({ content: output }));

};

module.exports = {
    getEvents : getEvents 
}
