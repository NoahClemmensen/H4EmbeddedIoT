require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Database = require('./classes/database');

const indexRouter = require('./routes/index');
const devicesRouter = require('./routes/devices');
const settingsRouter = require('./routes/settings');
const bcrypt = require('bcrypt');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

function stripBearerToken(token) {
  return token.replace('Bearer ', '');
}

// Bearer token authentication
app.use(async function (req, res, next) {
  if (!req.headers.authorization) {
    res.status(401).json({error: "Unauthorized"});
    return;
  }

  const password = await Database.getPassword();
  bcrypt.compare(stripBearerToken(req.headers.authorization), password, function(err, result) {
    if (err) {
        res.status(500).json({error: err});
    }

    if (result) {
      next();
    } else {
      res.status(401).json({error: "Unauthorized"});
    }
  });
});

app.use('/', indexRouter);
app.use('/devices', devicesRouter);
app.use('/settings', settingsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
