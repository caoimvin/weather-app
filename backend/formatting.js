
function formatResponse(data) {

    const current = {}
    const forecast = []
    const city = data.city
    
    const today = data.list[0]
    const list = data.list

    let day
    list.forEach(item => {
        
        const itemDay = item.dt_txt.split(' ')[0]
        const itemTime = item.dt_txt.split(' ')[1]
        
        if (day !== itemDay) {
            const dayItem = {}
            dayItem.date = itemDay
            dayItem.list = []
            dayItem.temp = item.main.temp
            dayItem.humidity = item.main.humidity
            dayItem.wind = item.wind.speed
            dayItem.rain = dayItem.rain ? dayItem.rain['3h'] : 0
            dayItem.temp_min = item.main.temp_min
            dayItem.temp_max = item.main.temp_max
            dayItem.weather = []
            dayItem.weather.push(item.weather[0].icon)

            const subItem = {}
            subItem.temp = Math.round(item.main.temp)
            subItem.weather = item.weather[0].icon
            subItem.time = itemTime

            dayItem.list.push(subItem)

            forecast.push(dayItem)

            day = itemDay
        } else {
            const dayItem = forecast.find(x => x.date === itemDay)
            dayItem.temp += item.main.temp
            dayItem.humidity += item.main.humidity
            dayItem.wind += item.wind.speed
            if (item.rain) dayItem.rain = item.rain['3h']
            if (item.main.temp_min < dayItem.temp_min) dayItem.temp_min = item.main.temp_min
            if (item.main.temp_max > dayItem.temp_max) dayItem.temp_max = item.main.temp_max
            dayItem.weather.push(item.weather[0].icon)

            const subItem = {}
            subItem.temp = Math.round(item.main.temp)
            subItem.weather = item.weather[0].icon
            subItem.time = itemTime

            dayItem.list.push(subItem)
        }
    })

    for (const item of forecast) {
        if (item.list.length === 0) continue
        item.temp = Math.round(item.temp / item.list.length)
        item.humidity = Number((item.humidity / item.list.length).toFixed(2))
        item.wind = Number((item.wind / item.list.length).toFixed(2))
        item.temp_min = Math.round(item.temp_min)
        item.temp_max = Math.round(item.temp_max)
        item.rain = Number(item.rain.toFixed(2))
        let weather = mostCommonString(item.weather)
        weather = weather.replace('n', 'd') // always use day icons for forecast
        item.weather = weather
    }

    current.date = today.dt_txt.split(' ')[0]
    current.temp = Math.round(today.main.temp)
    current.humidity = Number(today.main.humidity.toFixed(2))
    current.wind = Number(today.wind.speed.toFixed(2))
    current.rain = Number((today.rain ? today.rain['3h'] : 0).toFixed(2))
    current.temp_min = Math.round(forecast[0].temp_min)
    current.temp_max = Math.round(forecast[0].temp_max)
    current.weather = today.weather[0].icon


    return {
        current,
        forecast,
        city
    }
}

function mostCommonString(array) {
    if (array.length == 0) return null
    const stringMap = {}
    let maxElement = array[0], maxCount = 1;
    for (const string of array) {
        if (stringMap[string] == null) stringMap[string] = 1
        else stringMap[string]++

        if (stringMap[string] > maxCount) {
            maxElement = string
            maxCount = stringMap[string]
        }
    }
    return maxElement
}

module.exports = {
    formatResponse
}