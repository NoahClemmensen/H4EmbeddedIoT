const express = require('express');
const router = express.Router();
const Database = require('../classes/database');

/* GET home page. */
router.get('/', async function(req, res, next) {
    const devices = await Database.getDevices();
    res.render('index', { devices: devices });
});

module.exports = router;
