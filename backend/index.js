const express = require('express')
const cors = require('cors')
require('dotenv').config()
const axios = require('axios')
const redis = require('redis')
const path = require('path')
const { formatResponse } = require('./formatting')
const sqlite3 = require('sqlite3').verbose()

const db_name = path.join(__dirname, 'data', 'cities.db')
const db = new sqlite3.Database(db_name, err => {
    if (err) return console.log(err.message)
    console.log('connected to database cities.db');
})

async function findCity(city) {
    if (!city || city === '') return []
    const limit = 6
    const sql = `SELECT * FROM cities WHERE name LIKE ? LIMIT ${limit}`
    return new Promise((resolve, reject) => {
        db.all(sql, [`%${city}%`], (err, rows) => {
            if (err) return reject(err.message);
            resolve(rows)
        })
    })
}
async function addCities(cities) {
    if (!cities || !cities.length) return []
    const values = cities.map(city => `('${city.name}', '${city.lat}', '${city.lon}', '${city.country}', '${city.state}')`)
    const sql = `INSERT INTO cities (name, lat, lon, country, state) VALUES ${values.join(',')}`
    return new Promise((resolve, reject) => {
        db.run(sql, (err) => {
            if (err) return reject(err.message)
            resolve()
        })
    })
}

const app = express()
const port = process.env.PORT || 8000

let redisClient
(async () => {
    redisClient = redis.createClient({
        url: process.env.REDIS_URL
    });
    redisClient.on('error', (error) => console.error(`Error : ${error}`))

    await redisClient.connect()
})()

app.use(cors())

async function cacheData(req, res, next) {
    let key
    if (req.route.path === '/geocode') key = req.query.city
    else key = `${req.query.lat}&${req.query.lon}`
    let results
    try {
        const cachedResults = await redisClient.get(key)
        if (cachedResults) {
            results = JSON.parse(cachedResults)
            res.json({
                cache: true,
                message: '',
                data: results
            })
        } else {
            next()
        }
    } catch (error) {
        console.error(error);
        res.status(404)
    }
}

app.get('/', (req, res) => {
    res.json('docker works')
})

app.get('/geocode', async (req, res) => {
    const city = req.query.city
    if (!city || city === '') {
        return res.json({
            cache: false,
            message: 'value for city is missing',
            data: []
        })
    }

    const data = await findCity(city)
    if (data && data.length) return res.json({
        cache: false,
        message: 'city found in database',
        data: data
    })

    let { data: cities } = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=6&appid=${process.env.API_KEY}`)
    cities = cities.map(entry => ({ name: entry.name, lat: entry.lat, lon: entry.lon, country: entry.country, state: entry.state }))
    await addCities(cities)

    res.json({
        cache: false,
        message: 'cities add to database',
        data: cities
    })
})

app.get('/forecast', cacheData, async (req, res) => {
    const lat = req.query.lat
    const lon = req.query.lon

    if (!lat || !lon) return res.json({
        cache: false,
        message: 'value for lat or lon is missing',
        data: []
    })

    try {
        const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}&lang=en&units=metric`)

        const response = formatResponse(data)
    
        await redisClient.set(`${lat}&${lon}`, JSON.stringify(response), {
            EX: 3600,
            NX: true
        })
    
        res.json({
            cache: false,
            message: '',
            data: response
        })
    } catch (error) {
        console.error(error)
        return res.status(404).send('Data unavailable')
    }
})

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})