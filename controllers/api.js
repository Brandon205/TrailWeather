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

router.get('/home', function(req, res) {
  res.render('/pages/index');
});

router.get('/search', function(req, res) {
  res.render('pages/search');
});

router.get('/results', function(req, res) {
  geocode.forwardGeocode({
    query: `${req.query.city}, ${req.query.state}`,
    types: ['place'],
    countries: ['us']
  }).send().then(function(response) {
    let results = response.body.features.map(result => {
      return {
        name: result.place_name,
        lat: result.center[1],
        long: result.center[0]
      };
    });
    res.render('pages/results', { query: req.query, results });
  });
});

router.get('/lookup', function(req, res) {
  // console.log(`${dsUrl}/${process.env.DARK_SKY_KEY}/${req.query.lat},${req.query.long}`);
  axios.get(`${dsUrl}/${process.env.DARK_SKY_KEY}/${req.query.lat},${req.query.long}`)
  .then(function(weatherInfo) {
    res.render('pages/lookup', { weatherInfo: weatherInfo.data });
  });
});

module.exports = router;
