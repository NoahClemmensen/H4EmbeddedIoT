var express = require('express');
const Database = require("../../classes/database");
var router = express.Router();

router.get('/', async function(req, res, next) {
    res.json(await Database.getDevices());
});

router.get('/:serial', async function(req, res, next) {
    try {
        if (!await Database.checkSerial(req.params.serial)) {
            res.status(400).send('Device not found');
            return;
        }
        res.json(await Database.getDeviceBySerial(req.params.serial));
    } catch (error) {
        res.status(500).json({"message": error});
    }
});

module.exports = router;
