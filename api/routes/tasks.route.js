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
tasks.get('/:projectId', checkAuth,(req, res, next) => {
    Tasks.find({idProject: req.params.projectId})
        .select('_id task status')
        .exec()
        .then(data => {
            var response = {
                count: data.length,
                task: data.map(task => {
                    return {
                        task: task.task,
                        status: task.status,
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
        status: req.body.status,
        idUser: req.body.idUser,
        idProject: req.body.idProject
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
tasks.delete('/delete/:taskId', (req, res, next) => {
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
tasks.patch('/update/:taskId', (req, res, next) => {
    var task = new Tasks({
        task: req.body.task,
        status: req.body.status
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