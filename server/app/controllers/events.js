var calendar = require('../services/calendar'),
    utils = require('../services/utils');

/**
    request from client looks like this
    {
       "startTime": "2012-06-22 05:40:06", 
       "limit": 5
    }
**/

var getEvents = function(req, res, next) {

    var requestBody = req.body;
    var startTime = req.body.startTime ? req.body.startTime : utils.getCurrentDate() ;
    var limit = req.body.limit ? req.body.limit : 5;
    
    var requestUrl = 'https://apps.carleton.edu/calendar/?start_date=' + startTime + '&format=ical';

    calendar.getCalendar(requestUrl,startTime)
    .then( function(response) {
        var response = response.splice(0,limit);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ content: response }));
    })
    .catch( function(err) {
        res.writeHead(404, JSON.stringify(err));
        res.end(JSON.stringify(err));
    });

};

module.exports = {
    getEvents : getEvents 
}
