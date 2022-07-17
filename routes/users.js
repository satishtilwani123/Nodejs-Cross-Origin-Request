var express = require('express');
const User = require('../model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authenticate = require('../config');
const cookieParser = require('cookie-parser');
const { Router } = require('express');
const cors = require('./cors');

const router = express.Router();

router.use(cookieParser(authenticate.secret));

router.post('/Signup', cors.CorsOptions, (req, res, next) => {
  User.findOne({username: req.body.username})
  .then((user) => {
    if(!user){
      bcrypt.hash(req.body.password, 8)
      .then((hashpassword) => {
        if(hashpassword != null){
          User.create({username: req.body.username, password: hashpassword})
          .then((user) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: "User is Successfully Registered!",  data: user})
          }).catch((err) => next(err))
        }
      })
    } else {
      res.statusCode = 403;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, status: "You are already Registered!"})
    }
  })
})

router.post('/Login', cors.CorsOptions, (req, res, next) => {
  if(!req.cookies.auth)
  {
    console.log('cookies not found!');
    User.findOne({username: req.body.username})
    .then((user) => {
      if(!user){
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: "You are not registered!"});
      }
      else if(user.username == req.body.username){

        bcrypt.compare(req.body.password, user.password)
        .then((hashbool) => {
          console.log(user.password);
          console.log(req.body.password);
          if(!hashbool){
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: false, status: "Password is Incorrect!"});
          } else {
            const token = jwt.sign({id: user._id}, authenticate.secret);
            res.cookie('auth', token, {
              expires: new Date(Date.now() + 999999),
              secure: false,
              httpOnly: true
            })
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: "You are successfully Logined!", token: token});
          }
        })
      }
    }).catch((err) => next(err))
  } else {
    console.log('cookies found!');
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, status: "You are already Logined!"})
  }
})

router.get('/Logout', cors.CorsOptions, (req, res, next) => {
  if(req.cookies.auth){
    res.clearCookie('auth');
    res.redirect('/');
  } else {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: false, status: "You are already Logout!"})
  }
})

module.exports = router;