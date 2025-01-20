const express = require('express');
const Database = require("../../classes/database");
const router = express.Router();
const bcrypt = require('bcrypt');

router.get('/', async function(req, res, next) {
    res.json(await Database.getSettings());
});

router.post('/save', async function(req, res, next) {
    try {
        const settings = {
            max_temp: req.body.max_temp,
            min_temp: req.body.min_temp,
            max_fugt: req.body.max_fugt,
            min_fugt: req.body.min_fugt,
            temp_interval: req.body.temp_interval,
            fugt_interval: req.body.fugt_interval,
            max_sound: req.body.max_sound,
            start_time: req.body.start_time,
            end_time: req.body.end_time,
            password: await bcrypt.hashSync(req.body.password, 10)
        }

        await Database.saveSettings(settings);
        res.status(200).send("Settings saved");
    } catch (error) {
        res.status(500).json({error: error});
    }
});

module.exports = router;
