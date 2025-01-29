require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Database = require('./classes/database');

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const dataRouter = require('./routes/api/data');
const devicesRouter = require('./routes/manage/devices');
const settingsRouter = require('./routes/manage/settings');
const alarmsRouter = require('./routes/manage/alarms');
const bcrypt = require('bcrypt');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static(path.join(__dirname, 'public')));

// Bearer token authentication
function stripBearerToken(token) {
  return token.replace('Bearer ', '');
}

async function auth(req, res, next) {
    if (!req.headers.authorization && !req.signedCookies.auth) {
    res.status(401).json({error: "Unauthorized"});
    return;
    }

    const pass = req.headers.authorization ? stripBearerToken(req.headers.authorization) : req.signedCookies.auth;
    const dbPass = await Database.getPassword();

    bcrypt.compare(pass, dbPass, function(err, result) {
    if (err) {
      res.status(500).json({error: err});
    }

    if (result) {
      next();
    } else {
      res.status(401).json({error: "Unauthorized"});
    }
    });
}

async function cookieAuth(req, res, next) {
    if (!req.signedCookies.auth) {
        res.redirect('/login');
        return;
    }

    const password = await Database.getPassword();
    bcrypt.compare(req.signedCookies.auth, password, function(err, result) {
        if (err) {
          res.status(500).json({error: err});
        }

        if (result) {
          next();
        } else {
          res.redirect('/login');
        }
    });
}

app.use('/manage', auth);
app.get('/', cookieAuth, indexRouter);

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/api', dataRouter);
app.use('/manage/devices', devicesRouter);
app.use('/manage/settings', settingsRouter);
app.use('/manage/alarms', alarmsRouter);

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
