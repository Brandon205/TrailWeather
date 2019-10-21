const express = require('express');
const router = express.Router();
const db = require('../models');

// GET to /locations > show all of the users saved locations
router.get('/:id', function(req, res) {
  db.user.findByPk(Number(req.params.id), { include: [db.location] })
  .then(function(user) {
    res.render('pages/locations', { user });
  });
});

// POST to /locations > add new locations to user locations list
router.post('/', function(req, res) {
  db.user.findByPk(Number(req.body.id))
  .then(function(user) {
    db.location.findOrCreate({
      where: {
        city: req.body.city
      },
      defaults: {
        lat: req.body.lat,
        long: req.body.long
      }
    }).then(function([location, created]) {
      user.addLocation(location).then(function(data) {
        res.redirect(`/locations/${user.id}`);
      });
    });
  });
});

// DELETE to /locations > remove the correct location from the users location list
router.delete('/:id', function(req, res) {
  let num = req.params.id;
  db.location.destroy({
    where: {
      lat: num
    }
  }).then(function(delLocation) {
    res.redirect(`/locations/${Number(req.body.id)}`);
  });
});

module.exports = router;
