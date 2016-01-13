var CronJob = require('cron').CronJob,
    fs = require('fs');

var timeZone = 'America/Chicago';

cron_jobs = {};
cron_path = process.cwd() + '/app/services/cron';

fs.readdirSync(cron_path).forEach(function(file) {
    if (file.indexOf('.js') != -1) {
        cron_jobs[file.split('.')[0]] = require(cron_path + '/' + file)
    }
});

// Cron jobs to be run are below:
var calendarUpdate = new CronJob({
    // Note: triggers every hour.
    cronTime: '0 * * * *',
    onTick: function() {
        cron_jobs.calendar.updateCalendar(
            'http://apps.carleton.edu/calendar/?start_date=2016-01-12&format=ical'
        );
    },
    start: false,
    timeZone: timeZone
});

calendarUpdate.start();
