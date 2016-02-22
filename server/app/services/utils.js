/**
 * A boolean function to determine if a point is 
 * within the radius of a lat/long coordinate.
 */
var distanceTo = function(radius, center, point) {
    dist = getHaversineDistance(center, point);
    return dist <= radius;
};

// convert from degrees to radians
var rad = function(degrees) {
    return degrees * Math.PI / 180;
};

// adapted from: https://en.wikipedia.org/wiki/Haversine_formula
// and from: http://www.movable-type.co.uk/scripts/latlong.html
var getHaversineDistance = function(p1, p2) {
    var R = 6378137; // Earth’s mean radius in meters
    var phi_1 = rad(p1.lat)
    var phi_2 = rad(p2.lat)
    var deltaPhi = rad(p2.lat - p1.lat);
    var deltaLambda = rad(p2.lng - p1.lng);
    var a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
        Math.cos(phi_1) * Math.cos(phi_2) *
        Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
};

// adapted from http://stackoverflow.com/questions/3066586/get-string-in-yyyymmdd-format-from-js-date-object
// returns date in YYYY-MM-DD as a string
var getCurrentDate = function() {
    var date = new Date();
    var yyyy = date.getFullYear().toString();
    var mm = (date.getMonth()+1).toString(); // getMonth() is zero-based
    var dd  = date.getDate().toString();
    return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]); // padding
}

module.exports = {
    distanceTo: distanceTo,
    getCurrentDate: getCurrentDate
};
