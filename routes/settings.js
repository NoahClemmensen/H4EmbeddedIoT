const express = require('express');
const router = express.Router();
const Database = require('../classes/database');

/* GET home page. */
router.get('/', async function(req, res, next) {
    const settings = await Database.getSettings();

    res.render('settings', { settings: settings });
});

module.exports = router;
