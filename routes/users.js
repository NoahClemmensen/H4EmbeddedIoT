const express = require('express');
const router = express.Router();

const mysql = require('mysql2/promise');

let connection;
(async () => {
  connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
})();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/db', async function(req, res, next) {
  try {
    const [results, fields] = await connection.query(
        'SELECT * FROM `Personer` WHERE `Navn` = "Noah" AND `Alder` >= 20'
    );
    res.json({ result: results});
  } catch (err) {
    console.log(err);
    res.json({ error: err});
  }

});

module.exports = router;
