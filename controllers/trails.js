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
  console.log(req.params.id);
  db.trail.findOne({
    where: {
      idnum: req.params.id
    }
  }).then(function(foundTrail) {
    // res.json(foundTrail.idnum);
    let idNum = parseInt(foundTrail.idnum);
    console.log(`${hpUrl}/get-trails-by-id?ids=${idNum}&key=${process.env.HIKING_PROJECT_KEY}/`);
    axios.get(`${hpUrl}/get-trails-by-id?ids=${idNum}&key=${process.env.HIKING_PROJECT_KEY}/`);
    // axios.get('https://www.hikingproject.com/data/get-trails-by-id?ids=7001822&key=200620206-94b8bca7fc597b4ea5b5fc0a1adc0de2');
  }).then(function(trail) {
    console.log(`LLLLLLLLLLLLLL ${trail}`);
    res.json(trail);
    // res.render('pages/showTrail', { trail: trail });
  })
  .catch(err => console.log(`IIIIIIIIIIIIIIIII ${err}`));
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
