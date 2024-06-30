require('dotenv').config();
const mysql = require('mysql2');

// MySQL 데이터베이스 연결 설정
const pool = mysql.createPool({
    host: "34.64.172.33",
    user: "root",
    password: "fjqm1425*",
    database: "my_db"
});

module.exports = pool.promise();