var express = require('express'),
    mongo = require('mongoose'),
    proj = express.Router();

var Projects = require('../models/projects.model.js');
var Users = require('../models/users.model.js');
var checkAuth = require('../middleware/auth.middleware.js');

// + get list of projects for user
// + add project
// remove project
// update project

//get list of projects for concrete user
proj.post('/', checkAuth, (req, res, next) => {
    Users.find({_id: req.body.idUser})
        .select('projects')
        .exec()
        .then(usersProjects => {
            Promise.all(usersProjects[0].projects.map((project) => {
                return projectById(project);
            })).then((getProjects) => {
                var response = [];
                getProjects.forEach(thisProject => {
                    response.push(thisProject.project[0]);
                });
                res.status(200).json({
                    count: response.length,
                    projects: response
                });
            });
        })
        .catch(projectsError => {
            res.status(500).json({
                message: projectsError
            });
        });
});

function projectById(project) {
    return new Promise((resolve, reject) => {
        Projects.find({_id: project}, (projectError, nProject) => {
            if(projectError) {
                reject(projectError);
                return;
            }
            resolve({
                project: nProject
            });
        });
    });
}

//adding project
proj.post('/addProject', (req, res, next) => {
    Projects.find({name: req.body.name})
        .exec()
        .then(addingProject => {
            if(!addingProject.length) {
                var project = new Projects({
                    _id: new mongo.Types.ObjectId(),
                    name: req.body.name,
                    userOwner: req.body.idUser
                });
                project.save()
                    .then(proj => {
                        Users.findByIdAndUpdate(req.body.idUser,
                            {$push: {projects: proj.id}},
                            {new: true},
                            (err, addedToUser) => {
                                res.status(201).json({
                                    added: true,
                                    addedProject: proj,
                                    addedProjectToUser: addedToUser.projects
                                });
                            });                      
                    })
                    .catch(err => {
                        res.status(500).json({
                            message: err
                        });
                    });
            } else {
                res.status(202).json({
                    message: 'Project with the same name is already exists'
                });
            }
        })
        .catch(addingProjectError => {
            res.status(500).json({
                message: addingProjectError
            });
        });
});

module.exports = proj;