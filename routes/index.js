const express = require('express');
const router = express.Router();
const Database = require('../classes/database');

/* GET home page. */
router.get('/', async function(req, res, next) {
    const devices = await Database.getDevices();
    const receivers = await Database.getReceivers();
    const settings = await Database.getSettings();
    const alarms = await Database.getRelevantAlarms();

    for (const device of devices) {
        let climateInfo = await Database.getClimateData(device.serial);
        climateInfo = climateInfo[0][0];
        try {
            device.temperature = climateInfo.temp;
            device.humidity = climateInfo.humidity;
        } catch(err) {
            device.temperature = undefined;
            device.humidity = undefined;
        }

        if (settings.fahrenheit) {
            device.temperature = (device.temperature * 9/5) + 32;
        }
    }

    for (const alarm of alarms) {
        let device = await Database.getDeviceBySerial(alarm.serial);
        device = device[0];

        alarm.device = device;
    }

    res.render('index', { devices: devices, settings: settings, receivers: receivers, alarms: alarms });
});

module.exports = router;
