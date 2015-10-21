var restify = require('restify')

var server = restify.createServer();
    landmark = require('./app/controllers/landmarks.js')
server
    .use(restify.fullResponse())
    .use(restify.bodyParser())

// Endpoints for Landmarks 
// server.get("/landmarks/:location", landmark.getLandmark);
// server.post("landmarks/add", landmark.addLandmark);
// server.get({path: "/landmarks/:location", version: "1.0.0"}, controllers.landmarks.getLandmark)
 
// Endpoints for Events 
// server.get("/events", controllers.events.getAllEvents)
// server.get("/events/:time", controllers.events.getEventByTime)
 
var port = process.env.PORT || 3000;
server.listen(port, function (err) {
    if (err)
        console.error(err)
    else
        console.log('Sesq App Listening at: ' + port)
});