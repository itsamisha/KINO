const Pool = require('pg').Pool

const pool = new Pool({
    user: "postgres",
    password: "Amisha@36*",
    host: "localhost",
    port: "5432",
    database: "kino"
})

module.exports = pool;