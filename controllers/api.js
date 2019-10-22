const express = require('express');
const router = express.Router();
const db = require('../models');
const axios = require('axios');

let dsUrl = 'https://api.darksky.net/forecast';
let hpUrl = 'https://www.hikingproject.com/data';

const mbClient = require('@mapbox/mapbox-sdk');
const mb = mbClient({ accessToken: process.env.MAPBOX_KEY });
const mbGeocode = require('@mapbox/mapbox-sdk/services/geocoding');
const geocode = mbGeocode(mb);

router.get('/home', function(req, res) { // Shows the main home page
  res.render('/pages/index');
});

router.get('/edit', function(req, res) {
  res.render('auth/edit');
});

router.get('/search', function(req, res) { // Shows a from for searching locations
  res.render('pages/search');
});

router.get('/results', function(req, res) { // Will take search items from query --> lat & long
  geocode.forwardGeocode({
    query: `${req.query.city}, ${req.query.state}`,
    types: ['place'],
    countries: ['us']
  }).send().then(function(response) {
    let results = response.body.features.map(result => { // Maps mapbox data to "results" --> render with all the found data
      return {
        name: result.place_name,
        lat: result.center[1],
        long: result.center[0]
      };
    });
    res.render('pages/results', { query: req.query, results });
  })
  .catch(err => console.log(err));
});

router.put('/profile/:id', function(req, res) {
  db.user.update({
    name: req.body.name,
    email: req.body.email
  }, {
    where: {
      id: req.params.id
    }
  }).then(function(updatedUser) {
    res.redirect('/profile');
  })
  .catch(err => console.log(err));
});

router.post('/lookup', function(req, res) { // NOT RESTful but needed to keep the url a bit cleaner
  let locName = req.body.city;
  axios.get(`${dsUrl}/${process.env.DARK_SKY_KEY}/${req.body.lat},${req.body.long}`)
  .then(function(weatherInfo) {
    axios.get(`${hpUrl}/get-trails?lat=${req.body.lat}&lon=${req.body.long}&maxDistance=10&key=${process.env.HIKING_PROJECT_KEY}`)
    .then(function(trailInfo) {
      res.render('pages/lookup', { weatherInfo: weatherInfo.data, trails: trailInfo.data.trails, locName });
    })
    .catch(err => console.log(err));
  });
});
module.exports = router;
