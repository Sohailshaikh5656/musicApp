const mysql = require("mysql2/promise")
const dotenv = require("dotenv");
dotenv.config()

let db;
try{
    db = mysql.createPool({
        host :  "localhost",
        user : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_NAME,
        port : process.env.DB_PORT

    })
    console.log("Data Base Connected Successfully !".bgCyan)
}catch(error){
    console.log(`Data Base Connection Error ! : ${error}`.bgRed)
}

module.exports = db