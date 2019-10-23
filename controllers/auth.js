const express = require('express');
const router = express.Router();
const db = require('../models');
const passport = require('../config/ppConfig');

router.get('/signup', function(req, res) {
  res.render('auth/signup.ejs');
});

router.get('/login', function(req, res) { // Will render the login page for the user
  res.render('auth/login.ejs');
});

router.get('/logout', function(req, res) { // Will log the user out and redirect them back to the landing page
  req.logout();
  req.flash('success', 'You have logged out');
  res.redirect('/');
});

router.post('/login', passport.authenticate('local', { // Will allow the user to login, uses passport to authenticate
  successRedirect: '/',
  successFlash: 'You have logged in!',
  failureRedirect: '/auth/login',
  failureFlash: 'Invalid credentials'
}));

router.post('/signup', function(req, res) { // Find or create the user, if the user is found error and redirect, else, create redirect to home
  db.user.findOrCreate({
    where: {
      email: req.body.email
    },
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
  }).then(function([user, created]) {
    if (created) {
      console.log('User successfully created');
      passport.authenticate('local', {
        successRedirect: '/',
        successFlash: 'Account created and Logged in'
      })(req, res);
    } else {
      console.log('Email already exists');
      req.flash('error', 'Email already exists'); // Not safe but better for us to see errors
      res.redirect('/auth/signup');
    }
  }).catch(function(err) {
    console.log(err);
    res.redirect('/auth/signup');
  });
});

module.exports = router;
