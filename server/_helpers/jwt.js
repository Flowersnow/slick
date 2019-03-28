const expressJwt = require('express-jwt');
const config = require('../config.json');
const userService = require('../users/user.service');

module.exports = jwt;

function jwt() {
    const secret = config.secret;
    return expressJwt({
        secret,
        isRevoked
    }).unless({
        path: [
            // public routes that don't require authentication
            '/users/authenticate',
            '/users/register'
        ]
    });
}

async function isRevoked(req, payload, done) {
    const response = await userService.getById(payload.sub);
    console.log("checking if user exists jwt");
    // revoke token if user no longer exists
    if (!response || response.rowCount < 1) {
        console.log("revoking token");
        return done(null, true);
    }
    console.log("user exists, jwt is kept");
    done();
};