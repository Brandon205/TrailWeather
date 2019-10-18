const express = require('express');
const router = express.Router();
const db = require('../models');

// GET to /locations > show all of the users saved locations
router.get('/', function(req, res) {
  db.location.findAll().then(function(locations) {
    res.render('pages/locations', { locations });
  });
});

// POST to /locations > add new locations to user locations list
router.post('/', function(req, res) {
  db.location.findOrCreate({
    where: {
    city: req.body.city
    },
    defaults: {
    lat: req.body.lat,
    long: req.body.long
    }
  }).then(function([location, created]) {
    res.redirect('/locations');
  });
});

// DELETE to /locations > remove the correct location from the users location list
router.delete('/:id', function(req, res) {
  let num = req.params.id;
  console.log(`😀 ${num}`);
  db.location.destroy({
    where: {
      lat: num
    }
  }).then(function(delLocation) {
    res.redirect('/locations');
  });
});

module.exports = router;
