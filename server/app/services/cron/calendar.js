var request = require('request'),
    ical = require('ical.js'),
    database = require('../../core/database');


var updateCalendar = function(url) {
    request.get(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var ics_string = body.toString();
            parseCalendar(ics_string);
        } else {
            console.log(error.message);
        }
    });
};

var parseCalendar = function(ics) {
    var parsed_calendar = ical.parse(ics);
    var calendar = new ical.Component(parsed_calendar);
    var events = vcalendar.getAllSubcomponents('vevent');
};

module.exports = {
    updateCalendar : updateCalendar
}
