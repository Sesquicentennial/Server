var distanceTo = function(radius,center,point) {
	// dist = Math.sqrt(Math.pow((center.lng-point.lat),2) + Math.pow((center.lng-point.lat),2));
	dist = getDistance(center,point);
	console.log(dist);
	if (dist <= radius) {
		return true;
	} else {
		return false;
	}
};

var rad = function(x) {
	return x * Math.PI / 180;
};

// source http://stackoverflow.com/questions/1502590/calculate-distance-between-two-points-in-google-maps-v3
var getDistance = function(p1, p2) {
	var R = 6378137; // Earth’s mean radius in meter
	var dLat = rad(p2.lat - p1.lat);
	var dLong = rad(p2.lng - p1.lng);
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
	Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
	Math.sin(dLong / 2) * Math.sin(dLong / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c;
	return d; // returns the distance in meter
};

module.exports = {
	distanceTo: distanceTo
};