var mongoose = require('mongoose'),
    Landmark = require("../resources/landmarkModel"),
    ObjectId = mongoose.Types.ObjectId

exports.getLandmark = function(req, res, next) {
    Landmark.findById(new ObjectId(req.params[0]), function(err, landmark) {
        if (err) {
            res.status(500);
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (landmark) {
                res.json({
                    type: true,
                    data: landmark
                });
            } else {
                res.json({
                    type: false,
                    data: "Landmark: " + req.params.id + " not found"
                });
            }
        }
    })
};
