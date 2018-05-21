var express = require('express'),
    mongo = require('mongoose'),
    tasks = express.Router();

var Tasks = require('../models/tasks.model.js');
var checkAuth = require('../middleware/auth.middleware.js');

// + get list of tasks
// + create new task
// + delete task
// + update task
// + get concrete task

//get list of tasks
tasks.get('/:projectId&:iterationId', checkAuth,(req, res, next) => {
    Tasks.find({idProject: req.params.projectId, idIteration: req.params.iterationId})
        .select('_id task status describe points')
        .exec()
        .then(data => {
            var response = {
                count: data.length,
                task: data.map(task => {
                    return {
                        task: task.task,
                        status: task.status,
                        describe: task.describe,
                        points: task.points,
                        _id: task._id
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                message: err
            });
        });
});

//Get concrete task
tasks.get('/:taskId', (req, res, next) => {
    Tasks.find({_id: req.params.taskId})
        .exec()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({
                message: err
            });
        });
});

//adding task
tasks.post('/addTask', checkAuth,(req, res, next) => {
    var task = new Tasks({
        _id: new mongo.Types.ObjectId(),
        task: req.body.task,
        describe: req.body.describe,
        status: req.body.status,
        points: req.body.points,
        idUser: req.body.idUser,
        idProject: req.body.idProject,
        idIteration: req.body.idIteration
    });
    task.save()
        .then(data => {
            res.status(201).json({
                message: 'Task was added successfully',
            });
        })
        .catch(err => {
            res.status(500).json({
                message: err
            });
        });
});

//delete task
tasks.delete('/delete/:taskId', checkAuth, (req, res, next) => {
    Tasks.find({_id: req.params.taskId})
        .remove()
        .exec()
        .then(data => {
            if(data.n) {
                res.status(200).json({
                    message: 'Task was deleted successfully',
                    deletedTask: req.params.taskId,
                    deleted: true
                });
            } else {
                res.status(200).json({
                    message: 'Task was not found',
                    deleted: false
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: err
            });
        });
});

//update task
tasks.patch('/update/:taskId', checkAuth, (req, res, next) => {
    var task = new Tasks({
        task: req.body.task,
        status: req.body.status,
        describe: req.body.describe,
        points: req.body.points
    });
    Tasks.findOneAndUpdate({_id: req.params.taskId}, {$set: task}, {new: true})
        .exec()
        .then(data => {
            res.status(200).json({
                message: 'Task was updated',
                taskId: req.params.taskId,
                updated: true
            });
        })
        .catch(err => {
            res.status(500).json({
                message: err
            });
        });
});

module.exports = tasks;