const {
    Pool,
} = require("pg");

const {
    user,
    host,
    database,
    password,
    port
} = require("../_helpers/config");

const pool = new Pool({
    user: user,
    host: host,
    database: database,
    password: password,
    port: port,
    ssl: false,
    max: 10,
    connectionTimeoutMillis: 10000, // return an error after 10 second if connection could not be established
})

module.exports = {
 pool
};