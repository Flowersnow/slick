const express = require('express');
const router = express.Router();
const userService = require('./user.service');

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
//router.get('/', getAll);
//router.get('/current', getCurrent);
//router.get('/:id', getById);
router.put('/:username', update);
router.delete('/:username', _delete);

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body).then(function (response) {
        console.log(response);
        res.status(200).json(response);
    }).catch(err => {
        next(err);
    });
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.status(200).json({
            message: "Successfully added new user"
        }))
        .catch(err => next(err));
}

function getAll(req, res, next) {
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
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.username, req.body)
        .then(() => res.status(200).json({
            message: "Successfully updated user " + req.params.username
        }))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.username)
        .then(() => res.status(200).json({
            message: "User " + req.params.username + " successfully deleted."
        }))
        .catch(err => next(err));
}