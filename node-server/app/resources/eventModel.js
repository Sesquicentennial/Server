var mongoose = require("mongoose");
var Schema   = mongoose.Schema;
 
var eventSchema = new Schema({
    name: String,
    desc: String,
    host: String,
    location: {
        xCor: Number,
        yCor: Number
    }
});
mongoose.model('Event', CommentSchema);