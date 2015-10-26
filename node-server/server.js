var restify = require('restify');
var mongojs = require('mongojs');
var utils = require('./app/services/utils');
var server = restify.createServer();

var db = mongojs('mongodb://admin:admin123@ds045694.mongolab.com:45694/carleton-sesq', ['content'], {authMechanism: 'ScramSHA1'});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

// Endpoint for Landmarks
server.post("/landmarks", function (req, res, next) {
	// extract useful information from the request
	var requestBody = req.body;
	var radius = req.body.geofence.radius;
	var center = req.body.geofence.location;
    db.content.find(function (err, content) {
    	var output = []
    	if (content) {
    		for (var i = 0; i < content.length; i++) {
    			if (utils.distanceTo(radius,center,content[i].location)) {
					output.push(content[i]);
    			}
    		}
	        res.writeHead(200, {
	            'Content-Type': 'application/json; charset=utf-8'
	        });    		
	        res.end(JSON.stringify({content: output}));
    	} else {
	        res.writeHead(404, {
	        });    		
	        res.end(JSON.stringify(err));
    	}
    });
    return next();
});

server.listen(3000, function () {
    console.log("Server started @ 3000");
});