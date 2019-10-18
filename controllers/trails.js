const express = require('express');
const router = express.Router();
const db = require('../models');
const axios = require('axios');

let hpUrl = 'https://www.hikingproject.com/data';

router.get('/', function(req, res) { // GET to /trails > show all of the users saved trails
  db.trail.findAll().then(function(trails) {
    res.render('pages/trails', { trails });
  });
});

router.get('/:id', function(req, res) { // GET to /trails:id > shows more details on a specific trail
  db.trail.findOne({
    where: {
      idnum: req.params.id
    }
  }).then(function(foundTrail) {
    axios.get(`${hpUrl}/get-trails-by-id?ids=${foundTrail.idnum}&key=${process.env.HIKING_PROJECT_KEY}`);
  }).then(function(trail) {
    res.render('pages/showTrail', { trail: trail.data });
    // res.send(trail);
  });
});

router.post('/', function(req, res) { // POST to /trails > add a new trail to the users saved list (Form on trails.ejs)
  db.trail.findOrCreate({
    where: {
      idnum: req.body.idnum
    },
    defaults: {
      name: req.body.name
    }
  }).then(function(newTrail) {
    res.redirect('/trails');
  });
});

router.delete('/:id', function(req, res) { // Delete one trail from the list (Form is on trails.ejs)
  db.trail.destroy({
    where: {
      idnum: req.params.id
    }
  }).then(function(deletedTrail) {
    res.redirect('/trails');
  });
});

module.exports = router;
