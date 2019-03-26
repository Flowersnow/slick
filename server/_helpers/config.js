const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    user: process.env.PGUSER,
	host: process.env.PGHOST,
	database: process.env.PGDATABASE,
	password: process.env.PGPASSWORD,
	port: process.env.PGPORT,
	production: process.env.PRODUCTION,
};