var mongo = require('mongoose');

var taskSchema = mongo.Schema({
    _id: mongo.Schema.Types.ObjectId,
    task: String,
    status: String,
    idUser: {
        type: mongo.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    idProject: {
        type: mongo.Schema.Types.ObjectId,
        ref: 'Projects',
        required: true
    }
});

module.exports = mongo.model('Tasks', taskSchema);