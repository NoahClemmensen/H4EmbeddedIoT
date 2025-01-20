const express = require('express');
const Database = require("../../classes/database");
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/temperature/:SN', async function(req, res, next) {
    if (!req.body.temperature) {
        res.status(400).send('Temperature not received');
        return;
    }

    try {
        if (!await Database.checkSerial(req.params.SN)) {
            res.status(400).send('Device not found');
            return;
        }

        await Database.logTemp(req.body.temperature, new Date(), req.params.SN);
        res.send('Temperature received');
    } catch (error) {
        res.status(500).send('Error getting device');
        console.log(error);
    }
});

router.post('/humidity/:SN', async function(req, res, next) {
    if (!req.body.humidity) {
        res.status(400).send('Humidity not received');
        return;
    }

    try {
        if (!await Database.checkSerial(req.params.SN)) {
            res.status(400).send('Device not found');
            return;
        }

        await Database.logHumidity(req.body.humidity, new Date(), req.params.SN);
        res.send('Humidity received');
    } catch (error) {
        res.status(500).send('Error getting device');
    }
});

router.post('/sound/:SN', async function(req, res, next) {
    if (!req.body.sound) {
        res.status(400).send('Sound not received');
        return;
    }

    try {
        if (!await Database.checkSerial(req.params.SN)) {
            res.status(400).send('Device not found');
            return;
        }
        
        await Database.logSound(req.body.sound, new Date(), req.params.SN);
        res.send('Sound received');
    } catch (error) {
        res.status(500).json({"message": error});
    }
});

router.get('/settings/:SN', async function(req, res, next) {
    try {
        if (!await Database.checkSerial(req.params.SN)) {
            res.status(400).send('Device not found');
            return;
        }

        const settings = await Database.getSettings();
        res.json({
            max_temp: settings.max_temp,
            min_temp: settings.min_temp,
            max_humidity: settings.max_humidity,
            min_humidity: settings.min_humidity,
            max_sound: settings.max_sound,
            temp_interval: settings.temp_interval,
            humidity_interval: settings.humidity_interval
        });
    } catch (error) {
        res.status(500).send('Error getting device');
    }
});

module.exports = router;
