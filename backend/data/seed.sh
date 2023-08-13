#!/bin/bash

sqlite3 cities.db <<EOF
DROP TABLE IF EXISTS tmpCities;
.mode csv
.import world-cities.csv tmpCities
CREATE TABLE cities (
    name VARCHAR(100) NOT NULL,
    lat VARCHAR(100) NOT NULL,
    lon VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL
);
INSERT INTO cities (name, lat, lon, country, state) SELECT name, lat, lon, country, state from tmpCities;
DROP TABLE IF EXISTS tmpCities;
EOF

echo "sqlite database created"
