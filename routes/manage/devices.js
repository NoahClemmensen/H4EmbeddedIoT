var express = require('express');
const Database = require("../../classes/database");
var router = express.Router();

router.get('/', async function(req, res, next) {
    res.json(await Database.getDevices());
});

router.get('/:serial', async function(req, res, next) {
    res.json(await Database.getDeviceBySerial(req.params.serial));
});

module.exports = router;
