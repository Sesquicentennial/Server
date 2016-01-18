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
server.post("/events", controllers.events.getEvents);
server.post("/quest",controllers.quest.getQuest);
// server.post("/quest/next",controllers.quest.getWayPoint);

server.listen(3000, function() {
    console.log("Server started @ 3000");
});
