const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/:id', function(req, res) { // GET to /locations > show all of the users saved locations
  db.user.findByPk(Number(req.params.id), { include: [db.location] })
  .then(function(user) {
    res.render('pages/locations', { user });
  })
  .catch(err => console.log(err));
});

router.post('/', function(req, res) { // POST to /locations > add new locations to user locations list
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
      })
      .catch(err => console.log(err));
    });
  });
});

router.delete('/:id', function(req, res) { // DELETE to /locations > remove the correct location from the users location list
  let num = req.params.id;
  db.location.destroy({
    where: {
      lat: num
    }
  }).then(function(delLocation) {
    res.redirect(`/locations/${Number(req.body.id)}`);
  })
  .catch(err => console.log(err));
});

module.exports = router;
