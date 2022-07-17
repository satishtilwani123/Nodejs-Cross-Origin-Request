var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')
const authenticate = require('./config');
const User = require('./model/user');
const jwt = require('jsonwebtoken');

const url = "mongodb://localhost:27017/confusion";

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dish');
var ImageRouter = require('./routes/ImageUpload');

mongoose.connect(url).then((db) => {
  console.log(db);
})

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use(cookieParser(authenticate.secret));

function auth(req, res, next) {
  if(!req.cookies.auth)
  {
    var err = new Error("You are not authenticated");
    err.status = 401;
    return next(err);
  } else {
    const jwt_token = req.cookies.auth;
    console.log(jwt_token);
    const user = jwt.verify(jwt_token, authenticate.secret);
    User.findOne({_id:user.id})
    .then((user) => {
      if(user != null){
        next();
      } else {
        var err = new Error("You are not authenticated");
        err.status = 401;
        return next(err);
      }
    })
  }
}

app.use(auth);

app.use('/', indexRouter);
app.use('/dishes', dishRouter);
app.use('/imageupload', ImageRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
