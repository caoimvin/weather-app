# weather-app

![](weather-app-dashboard.png)
![](weather-app-search.png)

## General structure and available endpoints

![](system.jpg)

## How to install

rename `.env.example` to `.env` and add `API_KEY` for openweathermap.org

create sqlite database for city names with `./backend/data/seed.sh` script

build and run project
```
docker-compose build
docker-compose up
```
