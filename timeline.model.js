var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TimelineSchema = new Schema({
    day: Number,
    description: [
        {
            time: Number,
            activaties: String
        }
    ]
});

mongoose.model('Tineline', TimelineSchema)