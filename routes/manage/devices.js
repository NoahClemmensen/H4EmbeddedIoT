var express = require('express');
const Database = require("../../classes/database");
const {response} = require("express");
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

router.post('/create', async function(req, res, next) {
    try {
        const serial = req.body.sn;
        const name = req.body.name;
        const location = req.body.location;
        const desc = req.body.desc;

        if (!serial || !name || !location || !desc) {
            res.status(400).send('Missing required fields');
            return;
        }

        if (await Database.checkSerial(serial)) {
            res.status(400).send('Device already exists');
            return;
        }

        const result = await Database.createDevice(serial, location, name, desc);
        if (result.affectedRows >= 1) {
            res.status(200).send('Device created');
        }
    } catch (error) {
        res.status(500).json({"message": error});
    }
});

router.post('/edit', async function(req, res, next) {
    try {
        const serial = req.body.sn;
        const name = req.body.name;
        const location = req.body.location;
        const desc = req.body.desc;

        if (!serial || !name || !location || !desc) {
            res.status(400).send('Missing required fields');
            return;
        }

        if (!await Database.checkSerial(serial)) {
            res.status(400).send('Device not found');
            return;
        }

        const result = await Database.editDevice(serial, location, name, desc);
        if (result.affectedRows >= 1) {
            res.status(200).send('Device edited');
        }
    } catch (error) {
        res.status(500).json({"message": error});
    }
});

router.post('/delete/:SN', async function(req, res, next) {
    try {
        const serial = req.params.SN;

        if (!await Database.checkSerial(serial)) {
            res.status(400).send('Device not found');
            return;
        }
        const result = await Database.deleteDevice(serial);
        if (result.affectedRows >= 1) {
            res.status(200).send('Device deleted');
        }
    } catch (error) {
        res.status(500).json({"message": error});
    }
});

module.exports = router;
