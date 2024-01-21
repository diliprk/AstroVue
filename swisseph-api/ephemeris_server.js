const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const swisseph = require('swisseph');
const winston = require('winston');

// Set path to ephemeris files
swisseph.swe_set_ephe_path(__dirname + '/ephemeris_data');

// Set up logger
const logger = winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    defaultMeta: { service: 'swisseph-api-service' },
    transports: [
        new winston.transports.File({ filename: 'ephemeris_server.log' })
    ]
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

// 1. Endpoint to get the positions of the sun and the other planets
app.post('/planets', (req, res) => {
    try {
        const date = req.body.date;
        const flag = swisseph.SEFLG_SPEED;

        // Convert date to Julian day number
        swisseph.swe_julday(date.year, date.month, date.day, date.hour + date.minute / 60, swisseph.SE_GREG_CAL, (julday_ut) => {
            let positions = {};

            // Get position of each planet
            Object.keys(swisseph).forEach((key) => {
                if (key.startsWith('SE_') && key !== 'SE_ECL_NUT' && key !== 'SE_GREG_CAL') {
                    swisseph.swe_calc_ut(julday_ut, swisseph[key], flag, (body) => {
                        positions[key] = body;
                    });
                }
            });
            
            logger.info(`Planets positions calculated successfully for Date: ${date.year}-${date.month}-${date.day} ${date.hour}:${date.minute}`);
            res.json(positions);
        });
    } catch (error) {
        logger.error('Error calculating planets positions: ' + error.message);
        res.status(500).send('Error calculating planets positions');
    }
});

// 2. Endpoint to get the coordinates for the 12 houses
app.post('/houses', (req, res) => {
    try {
        const date = req.body.date;
        const lat = req.body.lat;
        const lon = req.body.lon;

        // Convert date to Julian day number
        swisseph.swe_julday(date.year, date.month, date.day, date.hour + date.minute / 60, swisseph.SE_GREG_CAL, (julday_ut) => {
            swisseph.swe_houses(julday_ut, lat, lon, 'P', (houses, ascendant) => {
                logger.info(`Houses coordinates calculated successfully for Date: ${date.year}-${date.month}-${date.day} ${date.hour}:${date.minute} @ lat: ${lat}, lon: ${lon}`);
                res.json({houses, ascendant});
            });
        });
    } catch (error) {
        logger.error(`Error calculating houses coordinates for lat: ${lat}, lon: ${lon}: ${error.message}`);
        res.status(500).send('Error calculating houses coordinates');
    }
});

const port = process.env.PORT || 3087;
app.listen(port, () => console.log(`Server running on port ${port}`));