require('dotenv').config();
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test', function(req, res, next) {
  res.json({ message: 'Hello World' });
});

router.get('/secret', function(req, res, next) {
    res.json({ key: process.env.SECRET_KEY});
});



module.exports = router;
