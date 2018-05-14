var mongo = require('mongoose');

var userSchema = mongo.Schema({
    _id: mongo.Schema.Types.ObjectId,
    name: String,
    email: String,
    password: String,
    projects: [{
        type: mongo.Schema.Types.ObjectId,
        ref: 'Projects'
    }]
});

module.exports = mongo.model('Users', userSchema);