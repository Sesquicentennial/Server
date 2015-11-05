var restify = require('restify'),
    fs = require('fs'),
    database = require('./database'),
    utils = require('../services/utils');

controllers = {};
controllers_path = process.cwd() + '/app/controllers';

fs.readdirSync(controllers_path).forEach(function(file) {
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
server.post("/info", controllers.info.getInfo);

server.get("/landmarks", function(req, res, next) {
    res.writeHead(200, {
        'Content-Type': 'text; charset=utf-8'
    });
    res.end('MEOWMEOWMEOW')
});

server.listen(3000, function() {
    console.log("Server started @ 3000");
});
