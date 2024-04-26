const mysql = require("mysql");

var connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'atomicboiz',
    database: 'bookCenter'
});

module.exports = connection;