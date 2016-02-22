var restify = require('restify'),
    fs = require('fs'),
    database = require('./database'),
    utils = require('../services/utils');

controllers = {};
controllers_path = process.cwd() + '/app/controllers';

// link the controllers to the application
fs.readdirSync(controllers_path).forEach(function(file) {
    if (file.indexOf('.js') != -1) {
        controllers[file.split('.')[0]] = require(controllers_path + '/' + file)
    }
});

var server = restify.createServer();

exports.server = server;

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

// Endpoints
server.post("/geofences", controllers.geofences.getNearbyGeofences);
server.post("/info", controllers.info.getInfo);
server.post("/events", controllers.events.getEvents);
server.post("/quest",controllers.quest.getQuest);
server.post("/memories_fetch",controllers.memories_get.getMemories);
server.post("/memories_add",controllers.memories_add.addMemory);

server.listen(3000, function() {
    console.log("Server started at port 3000");
});
