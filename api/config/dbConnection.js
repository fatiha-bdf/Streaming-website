var mysql = require('mysql');

let db;
// Set the path to the database
if (process.env.NODE_ENV == "dev") {
      db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        port: "3306",
        database: process.env.DB_NAME,
        password: process.env.DB_PASS,
        connectionLimit: 10
      });
} else if (process.env.NODE_ENV == "preprod") {
    // For preprod server
}


let DB = module.exports = db;