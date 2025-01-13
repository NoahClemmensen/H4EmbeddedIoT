const express = require('express');
const Database = require("../classes/database");
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
        const result = await Database.checkSerial(req.params.SN);

        if (!result) {
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
        const result = await Database.checkSerial(req.params.SN);

        if (!result) {
            res.status(400).send('Device not found');
            return;
        }

        await Database.logHumidity(req.body.humidity, new Date(), req.params.SN);
        res.send('Humidity received');
    } catch (error) {
        res.status(500).send('Error getting device');
    }
});

module.exports = router;
