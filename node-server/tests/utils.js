var expect = require('expect.js');
var utils = require('../app/services/utils');

var expected, current;

before(function(){
	// expected = false;
});

describe('utils#toDistance', function(){
	beforeEach(function(){
		radius = 10;
		center = {
			x: 10,
			y: 10
		};
		pointOutsideCircle = {
			x: 1000,
			y: 1000,
		};
		pointInsideCircle = {
			x: 15,
			y: 15
		};
		falseCurrent = utils.distanceTo(radius,center,pointOutsideCircle);
		trueCurrent = utils.distanceTo(radius,center,pointInsideCircle);
	});

	it('Point is outside of circle so distanceTo should return false', function(){
		expect(falseCurrent).to.be.false;
	});
	it('Point is inside of circle so distanceTo should return true', function(){
		expect(trueCurrent).to.be.true;
	});

});