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
	var questObject = {
		name: 'The Magical Mystery Tour',
		desc: "Magical Mystery Tour is a record by the English rock group the Beatles that was released as a double EP in the United Kingdom and an LP in the United States.",
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
	}
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ content: questObject }));
}

module.exports = {
	getQuest: getQuest
	// getWayPoint: getWayPoint
}