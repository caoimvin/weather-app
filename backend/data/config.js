const path = require('path')
const sqlite3 = require('sqlite3').verbose()

const db_name = path.join(__dirname, 'cities.db')
const db = new sqlite3.Database(db_name, err => {
    if (err) return console.log(err.message)
    console.log('connected to database cities.db');
})

module.exports = db