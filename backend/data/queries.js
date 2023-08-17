async function findCity(db, city) {
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

async function addCities(db, cities) {
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

module.exports = { findCity, addCities }