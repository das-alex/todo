var mongo = require('mongoose');

var taskSchema = mongo.Schema({
    _id: mongo.Schema.Types.ObjectId,
    task: String,
    describe: String,
    status: String,
    points: Number,
    inBacklog: Boolean,
    idUser: {
        type: mongo.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    idProject: {
        type: mongo.Schema.Types.ObjectId,
        ref: 'Projects',
        required: true
    },
    idIteration: {
        type: mongo.Schema.Types.ObjectId,
        ref: 'Iterations',
        required: true
    }
});

module.exports = mongo.model('Tasks', taskSchema);