/**
**/
// var getWayPoint = function(req, res, next) {
//     var requestBody = req.body;
//     var output = {
//     	'fromWayPoint': {

//     	},
//     	'toWayPoint': {

//     	}
//     }
// }

// var getQuest = function(req, res, next) {
// 	var requestBody = req.body;
// 	var output = {
// 		name: '',
// 		description: '',
// 	}
// }

// var getAllQuests = function (req, res, next) {
// 	var returnQuest = {

// 	}
// }

var getQuest = function (req, res, next) {
	var questObject = [{
		name: 'The Magical Mystery Tour',
		desc: "The magical mystery tour is coming to take you away! Coming to take you away. Embark on this tittalating and tantalizing journey through the lands of the Walrus!",
		compMsg: "Congrats",
		waypoints: {
			0: {
				clue:"I Am the Walrus",
				hint:"Goo goo g' joob (CMC)",
				geofence: {
					lat: 44.462497,
					lng: -93.153604,
					rad: 100.0,
				}
			}
		}
	},
	{
		name: 'Let it Be',
		desc: "A quest for those with chiller inclinations. If you can decipher the words of wisdom, you might just be mother Mary. What? You heard me.",
		compMsg: "You let it be, man.",
		waypoints: {
			0: {
				clue:"I Am the Walrus",
				hint:"MC^2",
				geofence: {
					lat: 44.462497,
					lng: -93.153604,
					rad: 100.0,
				}
			}
		}
	}]
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ content: questObject }));
}

module.exports = {
	getQuest: getQuest
	// getWayPoint: getWayPoint
}
