const dotenv = require('dotenv');
dotenv.config();
const host = window.location.hostname;
const protocol = window.location.protocol;
const formatUrl = protocol + "//" + host;
module.exports = {
    apiUrl: formatUrl + ":3001", // hardcoded port for server
};