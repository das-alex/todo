var mongo = require('mongoose');

var projectSchema = mongo.Schema({
    _id: mongo.Schema.Types.ObjectId,
    name: String,
    userOwner: {
        type: mongo.Schema.Types.ObjectId,
        ref: 'Users',
        require: true
    }
});

module.exports = mongo.model('Projects', projectSchema);