var restify = require('restify'),
    fs = require('fs'),
    database = require('./database'),
    utils = require('../services/utils'),

controllers = {};
controllers_path = process.cwd() + '/app/controllers';

fs.readdirSync(controllers_path).forEach(function (file) {
    if (file.indexOf('.js') != -1) {
        controllers[file.split('.')[0]] = require(controllers_path + '/' + file)
    }
});

var server = restify.createServer();
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

// Endpoints
server.post("/geofences", controllers.geofences.getNearbyGeofences);

server.post("/landmarks", function (req, res, next) {
	var requestBody = req.body;
	var radius = req.body.geofence.radius;
	var center = req.body.geofence.location;
    database.db.content.find(function (err, content) {
    	var output = [];
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

server.get("/landmarks", function(req,res,next){
	res.writeHead(200,{
	    'Content-Type': 'text; charset=utf-8'
	});
	res.end('MEOWMEOWMEOW')
});

server.listen(3000, function () {
    console.log("Server started @ 3000");
});
