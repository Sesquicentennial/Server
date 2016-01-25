var calendar = require('../services/calendar'),
    utils = require('../services/utils');

/**
 *  Given a request from a client that looks like the following:  
 *  {
 *     "startTime": "2012-06-22 05:40:06", 
 *     "limit": 5
 *  }
 *
 *  The /events endpoint then examines the start time, and then parses
 *  iCal data from the Carleton calendar. From there, the parsed
 *  data is filtered by the start time, and the limit is imposed, 
 *  taking the most recent events from the calendar, which is then returned
 *  to the client. 
 */
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
