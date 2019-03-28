const express = require('express');
const router = express.Router();
const userService = require('./user.service');

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
//router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/:username', update);
router.delete('/delete/:id', _delete);

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body).then(function (response) {
        res.status(200).json(response);
    }).catch(err => {
        next(err);
    });
}

function register(req, res, next) {
    console.log("register endpoint")
    userService.create(req.body)
        .then(() => res.status(200).json({
            message: "Successfully added new user"
        }))
        .catch(err => next(err));
}


function getAll(req, res, next) {
    console.log("getting ALL endpoint")
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    console.log("getting by ID endpoint")
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

// DO NOT USE: Not correct
function update(req, res, next) {
    userService.update(req.params.username, req.body)
        .then(() => res.status(200).json({
            message: "Successfully updated user " + req.params.username
        }))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    console.log("deleting a user")
    console.log(req.user);
    const reqUserId = req.user.sub; // the userid of the user sending the delete request (based on JWT)
    userService.delete(reqUserId, req.params.id)
        .then(() => res.status(200).json({
            message: "User " + req.params.id + " successfully deleted."
        }))
        .catch(err => next(err));
}