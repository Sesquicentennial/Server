var distanceTo = function(radius,center,point) {
	// dist = Math.sqrt(Math.pow((center.lng-point.lat),2) + Math.pow((center.lng-point.lat),2));
	dist = getHaversineDistance(center,point);
	console.log(dist);
	if (dist <= radius) {
		return true;
	} else {
		return false;
	}
};

// convert degrees to radians
var rad = function(x) {
	return x * Math.PI / 180;
};

// adapted from: https://en.wikipedia.org/wiki/Haversine_formula
// and from: http://www.movable-type.co.uk/scripts/latlong.html
var getHaversineDistance = function(p1, p2) {
	var R = 6378137; // Earth’s mean radius in meter
	var phi_1 = rad(p1.lat)
	var phi_2 = rad(p2.lat)
	var deltaPhi = rad(p2.lat - p1.lat);
	var deltaLambda = rad(p2.lng - p1.lng);
	var a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
			Math.cos(phi_1) * Math.cos(phi_2) *
			Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c;
	return d;
};

module.exports = {
	distanceTo: distanceTo
};