var express = require('express'),
    mongo = require('mongoose'),
    iter = express.Router();

var Iterations = require('../models/iterations.model.js');
var checkAuth = require('../middleware/auth.middleware.js');

// get list of iterations
// create iteration
// edit iteration

iter.get('/:projectId', checkAuth, (req, res, next) => {
    Iterations.find({idProject: req.params.projectId})
        .exec()
        .then(iteratioonsList => {
            var response = {
                count: iteratioonsList.length,
                iterations: iteratioonsList.map(item => {
                    return {
                        _id: item._id,
                        name: item.name
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(catchError(getListOfIterError));
});

iter.post('/', checkAuth, (req, res, next) => {
    Iterations.find({name: req.body.name})
        .exec()
        .then(addingIteration => {
            if(!addingIteration.length) {
                var iteration = new Iterations({
                    _id: new mongo.Types.ObjectId(),
                    name: req.body.name,
                    idProject: req.body.idProject
                });
                iteration.save()
                    .then(iterationSave => {
                        res.status(201).json({
                            added: true,
                            addedIteration: iterationSave
                        });
                    })
                    .catch(catchError(iterationSaveError));
            } else {
                res.status(202).json({
                    message: 'Iteration with the same name is already exists'
                });
            }
        })
        .catch(catchError(addingIterationError));
});

iter.patch('/:iterationId', checkAuth, (req, res, next) => {
    var iteration = new Iterations({
        name: req.body.name
    });
    Tasks.findOneAndUpdate({_id: req.params.iterationId}, {$set: iteration}, {new: true})
        .exec()
        .then(data => {
            res.status(200).json({
                iterationId: req.params.iterationId,
                updated: true
            });
        })
        .catch(catchError(updatedIterationError));
});

function catchError(error) {
    res.status(500).json({
        message: error
    });
}

module.exports = iter;