const express = require('express');
const router = express.Router();
const db = require('../models');
const axios = require('axios');

let hpUrl = 'https://www.hikingproject.com/data';

router.get('/:id', function(req, res) { // GET to /trails > show all of the users saved trails
  db.user.findByPk(Number(req.params.id), { include: [db.trail] })
  .then(function(user) {
    res.render('pages/trails', { user });
  })
  .catch(err => console.log(err));
});

router.get('/show/:id', function(req, res) {
  axios.get(`${hpUrl}/get-trails-by-id?ids=${Number(req.params.id)}&key=${process.env.HIKING_PROJECT_KEY}`)
  .then(function(trail) {
    res.render('pages/showTrail', { trail: trail.data.trails[0] });
  })
  .catch(err => console.log(err));
});

router.post('/', function(req, res) { // POST to /trails > add a new trail to the users saved list (Form on trails.ejs)
  db.user.findByPk(Number(req.body.id)).then(function(user) {
    db.trail.findOrCreate({
      where: {
        idnum: req.body.idnum
      },
      defaults: {
        name: req.body.name
      }
    }).then(function([newTrail, created]) {
      user.addTrail(newTrail);
    }).then(function(data) {
      res.redirect(`/trails/${user.id}`);
    });
  })
  .catch(err => console.log(err));
});

router.delete('/:id', function(req, res) { // Delete one trail from the list (Form is on trails.ejs)
  db.trail.destroy({
    where: {
      idnum: req.params.id
    }
  }).then(function(deletedTrail) {
    res.redirect(`/trails/${req.body.id}`);
  })
  .catch(err => console.log(err));
});

module.exports = router;
