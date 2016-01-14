var Q = require('q'),
    request = require('request'),
    ical = require('ical.js');

var getCalendar = function(url,startTime) {
    var def = Q.defer();
    request.get(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            if (body) {
                var ics_string = body.toString();
                def.resolve(parseCalendar(ics_string,startTime));
            } else {   
                def.resolve({});
            }
        } else {
            console.log(error.message);
        }
    });
    return def.promise;
};

var parseCalendar = function(ics,startDate) {
    var parsed_calendar = ical.parse(ics);
    var calendar = new ical.Component(parsed_calendar);
    var events = calendar.getAllSubcomponents('vevent');
    var calendarEvents = [];
    for (var i = 0; i < events.length; i++) {
        var title = (events[i].getAllProperties('summary')).length > 0
                    ? events[i].getAllProperties('summary')[0].toJSON()[3]
                    : 'No Title';

        var description = events[i].getAllProperties('description').length > 0
                    ? events[i].getAllProperties('description')[0].toJSON()[3]
                    : 'No Description';

        var startTime = events[i].getAllProperties('dtstart').length > 0
                    ? events[i].getAllProperties('dtstart')[0].toJSON()[3]
                    : 'No Time Available';

        var location = events[i].getAllProperties('location').length > 0
                    ? events[i].getAllProperties('location')[0].toJSON()[3]
                    : 'No Location Available';

        var duration = events[i].getAllProperties('duration').length > 0
                    ? events[i].getAllProperties('duration')[0].toJSON()[3]
                    : 'No Duration Available';

        var calendarEvent = {
            'title': title,
            'description': description,
            'location': location,
            'startTime': startTime,
            'duration': duration
        }

        var eventDate = new Date(calendarEvent.startTime.split('T')[0]);
        var startDate = new Date(startDate);

        if (eventDate >= startDate) {
            calendarEvents.push(calendarEvent);
        }
    }
    return calendarEvents;
};

module.exports = {
    getCalendar : getCalendar 
}