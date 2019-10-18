const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/home', function(req, res) {
  res.render('pages/index.ejs');
});
