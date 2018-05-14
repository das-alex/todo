var express = require('express');
var api = express();

var users = require('./routes/users.route.js'),
    tasks = require('./routes/tasks.route.js'),
    proj = require('./routes/projects.route.js');

api.use('/tasks', tasks);
api.use('/users', users);
api.use('/projects', proj);

module.exports = api;