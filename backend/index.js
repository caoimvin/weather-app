const express = require('express')
const cors = require('cors')
require('dotenv').config()
const axios = require('axios')
const redis = require('redis')
const path = require('path')
const { formatResponse } = require('./formatting')
const db = require('./data/config')
const { findCity, addCities } = require('./data/queries')

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

/**
 * Get cached response data from redis 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
async function cacheData(req, res, next) {
    const key = `${req.query.lat}&${req.query.lon}`
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

    const data = await findCity(db, city)
    if (data && data.length) return res.json({
        cache: false,
        message: 'city found in database',
        data: data
    })

    let { data: cities } = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=6&appid=${process.env.API_KEY}`)
    cities = cities.map(entry => ({ name: entry.name, lat: entry.lat, lon: entry.lon, country: entry.country, state: entry.state }))
    await addCities(db, cities)

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