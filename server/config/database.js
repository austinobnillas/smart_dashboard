const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
    host: 'localhost',
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'data_pulse'
});

module.exports = pool;




