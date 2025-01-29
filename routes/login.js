const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Database = require('../classes/database');

router.get('/', async function(req, res, next) {
    res.render('login');
});

router.post('/', async function(req, res, next) {
    if (!req.body.password) {
        res.status(400).json({error: "No password provided"});
        return;
    }

    const password = await Database.getPassword();
    bcrypt.compare(req.body.password, password, function(err, result) {
        if (err) {
            res.status(500).json({error: err});
        }

        if (result) {
            res.cookie('auth', req.body.password, {signed: true});
            res.redirect('/');
        } else {
            res.status(401).json({error: "Unauthorized"});
        }
    });
});

module.exports = router;
