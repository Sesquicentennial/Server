var getHistoryContent = function(req, res, next){
	var history = {
	    "title": {
	    	"display_date": "2016",
	        "media": {
	          "url": "https://upload.wikimedia.org/wikipedia/commons/9/98/Carleton_College_Aerial.jpg",
	          "caption": "Carleton College",
	          "credit": "www.wikimedia.com"
	        },
	        "geo": {
	        	"lat": 44.4602387,
	        	"lon" : -93.1530393
	        },
	        "text": {
	          "headline": "Carleton College",
	          "text": "Carleton's history for the Sesquicentennial celebration" }
	    },
	    "events": [
	      {
	        "media": {
	          "url": "http://www.go.carleton.edu/reason_package/reason_4.0/www/sized_images_local/set417/1369417/b32c8f1097e8f4a71678f32c96ef70b5.jpg",
	          "caption": "Ice Skating on the Bald Spot",
	          "credit": "www.go.carleton.edu"
	        },
	        "start_date": {
	          "month": "1",
	          "year": "2016"
	        },
	        "geo": {
	        	"lat": 44.4602387,
	        	"lon" : -93.1530393
	        }
	      },
	      {
	        "media": {
	          "url": "https://apps.carleton.edu/reason_package/reason_4.0/www/images/8628.jpg",
	          "caption": "Chapel",
	          "credit": "apps.carleton.edu"
	        },
	        "start_date": {
	          "year": "2015"
	        },
	        "text": {
	          "headline": "Image of the Chapel",
	          "text": "In winter"
	        },
	        "geo": {
	        	"lat": 44.4602387,
	        	"lon" : -93.1530393
	        }
	      },
	      {
	        "start_date": {
	          "year": "2015"
	        },
	        "text": {
	          "headline": "The Bald Spot serves many purposes throughout the year",
	          "text": "During the warmer months, frisbees fly near napping students,..."
	        },
	        "geo": {
	        	"lat": 44.4597363,
	        	"lon" : -93.1507112
	        }
	      },
	      {
	        "media": {
	          "url": "https://www.youtube.com/watch?v=v89JfN15R8c",
	          "caption": "Spring at Carleon College",
	          "credit": "Carleton College"
	        },
	        "start_date": {
	          "year": "2015"
	        },
	        "text": {
	          "headline": "Spring at Carleton",
	          "text": "Spring at Carleton College"
	        }
	      },
	      {
	        "media": {
	          "url": "https://www.youtube.com/watch?v=BByk3WOpfX4",
	          "caption": "Chris Kratt Convocation",
	          "credit": "Carleton College"
	        },
	        "start_date": {
	          "year": "2004"
	        },
	        "text": {
	          "headline": "Chris Kratt Convocation",
	          "text": "Audio of Chris Kratt speaking at Carleton College"
	        },
	        "geo": {
	        	"lat": 44.4597363,
	        	"lon" : -93.1507112
	        }
	      }
	    ]
	};
	res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
	res.end(JSON.stringify({ content: history }));
}

module.exports = {
    getHistoryContent: getHistoryContent
}
