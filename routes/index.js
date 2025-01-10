const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/temperature', function(req, res, next) {
    console.log(req.body);
    res.send('Temperature received');
});

router.post('/humidity', function(req, res, next) {
    console.log(req.body);
    res.send('Humidity received');
});

module.exports = router;
