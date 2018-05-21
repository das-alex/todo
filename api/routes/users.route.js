var express = require('express'),
    mongo = require('mongoose'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt'),
    users = express.Router();

var Users = require('../models/users.model.js');
var checkAuth = require('../middleware/auth.middleware.js');

// + get list of users
// + get info about concrete user
// + add new user
// + check user
// + delete user
// + update user

//check user
users.post('/checkUser', (req, res, next) => {
    Users.findOne({email: req.body.email})
        .exec()
        .then(userOne => {
            if(!userOne) {
                res.status(401).json({
                    message: 'Auth is failed 1'
                });
            } else {
                bcrypt.compare(req.body.password, userOne.password, (passwordError, passwordResult) => {
                    if(passwordError) {
                        res.status(401).json({
                            message: 'Auth is failed 2'
                        });
                    }
                    if(passwordResult) {
                        var token = jwt.sign({
                            email: userOne.email,
                            userId: userOne._id
                        }, 'secretkey', { expiresIn: "5h" });
                        res.status(200).json({
                            message: 'Auth successful',
                            userId: userOne._id,
                            token: token
                        });
                    }
                });
            }
        })
        .catch(userError => {
            res.status(500).json({
                message: userError
            });
        });
});

//get user by id
users.get('/:userId', (req, res, next) => {
    Users.find({_id: req.params.userId})
        .select('_id name email')
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

//get list of users
users.get('/', (req, res, next) => {
    Users.find({})
        .exec()
        .then(data => {
            var response = {
                count: data.length,
                users: data.map(user => {
                    return {
                        name: user.name,
                        email: user.email,
                        _id: user._id
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: err
            });
        });
});

//adding new user
users.post('/addUser', (req, res, next) => {
    Users.find({email: req.body.email})
        .exec()
        .then(userFind => {
            if(userFind.length >= 1) {
                res.status(409).json({
                    message: 'This user is already exists'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (passwordError, passwordHash) => {
                    if(passwordError) {
                        res.status(500).json({
                            message: passwordError
                        });
                    } else {
                        var user = new Users({
                            _id: new mongo.Types.ObjectId(),
                            name: req.body.name,
                            email: req.body.email,
                            password: passwordHash
                        });
                        user.save()
                            .then(result => {
                                res.status(201).json({
                                    added: true,
                                    message: 'The user was added successfully'
                                });
                            }).catch(err => {
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

users.delete('/delete/:userId', checkAuth, (req, res, next) => {
    Users.find({_id: req.params.userId})
        .remove()
        .exec()
        .then(data => {
            if(data.n) {
                res.status(200).json({
                    message: 'The user was deleted successfully',
                    deletedUser: req.params.userId,
                    deleted: true
                });
            } else {
                res.status(200).json({
                    message: 'The user was not found',
                    deleted: false
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: err
            });
        });
});

users.patch('/update/:userId', checkAuth, (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (passwordError, passwordHash) => {
        if(passwordError) {
            res.status(500).json({
                message: passwordError
            });
        } else {
            var user = new Users({
                name: req.body.name,
                email: req.body.email,
                password: passwordHash
            });
        }
    });
    Users.findOneAndUpdate({_id: req.params.userId}, {$set: user}, {new: true})
        .exec()
        .then(data => {
            res.status(200).json({
                message: 'The user was updated',
                userId: req.params.userId,
                updated: true
            });
        })
        .catch(err => {
            res.status(500).json({
                message: err
            });
        });
});

module.exports = users;