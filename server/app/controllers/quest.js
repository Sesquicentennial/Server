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
					lat: 44.461319,
					lng: -93.156094,
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
	},
	{
		name: 'Search for Schiller',
		desc: "Set forth on a journey to find the elusive poet, philosopher, physician, historian, and playwright that we all love for no obvious reason",
		compMsg: "Welcome to the Carleton Hall of Fame!",
		waypoints: {
			0: {
				clue: "Across the water our spiritual forefathers dined",
				hint: "Your search will lead you to the East side",
				geofence: {
					lat: 44.460555,
					lng: -93.156539,
					rad: 100.0,
				}
			}, 
            1: {
                   clue: "Within these cavernous walls you will find Excalibur",
                   hint: "It was a gymnasium in years past",
                   geofence: {
					lat: 44.461319,
					lng: -93.156094,
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
}
