var mongoose = require("mongoose");
var Schema   = mongoose.Schema;
 
var landmarkSchema = new Schema({
    name: String,
    desc: String,
    location: {
        xCor: Number,
        yCor: Number
    }
});
mongoose.model('landmark', landmarkSchema);