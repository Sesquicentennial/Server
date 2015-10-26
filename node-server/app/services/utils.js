module.exports = {
	distanceTo : function(radius,center,point) {
		dist = Math.sqrt(Math.pow((center.x-point.x),2) + Math.pow((center.y-point.y),2));
		if (dist <= radius) {
			return true;
		} else {
			return false;
		}
	}
}