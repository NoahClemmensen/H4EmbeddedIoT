var express = require('express');
const Database = require("../../classes/database");
var router = express.Router();

router.post('/receivers/create', async function(req, res, next) {
    try {
        const email = req.body.email;
        const phone = req.body.phone;

        if (!email || !phone) {
            res.status(400).send('Missing required fields');
            return;
        }

        const result = await Database.createReceiver(email, phone);
        if (result.affectedRows >= 1) {
            res.status(200).send('Receiver created');
        }
    } catch (error) {
        res.status(500).json({"message": error});
    }
});

router.post('/receivers/delete/:id', async function(req, res, next) {
    try {
        const id = req.params.id;

        if (!await Database.checkReceiver(id)) {
            res.status(400).send('Receiver not found');
            return;
        }

        const result = await Database.deleteReceiver(id);
        if (result.affectedRows >= 1) {
            res.status(200).send('Receiver deleted');
        }
    } catch (error) {
        res.status(500).json({"message": error});
    }
});

module.exports = router;
