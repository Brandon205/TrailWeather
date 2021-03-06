require('dotenv').config();
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const session = require('express-session');
const passport = require('./config/ppConfig.js');
const flash = require('connect-flash');
const isLoggedIn = require('./middleware/isLoggedIn');
const helmet = require('helmet');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./models');
const RateLimit = require('express-rate-limit');
const methodOverride = require('method-override');

const app = express();
app.set('view engine', 'ejs');
app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static('./public'));
app.use(ejsLayouts);
app.use(helmet());
app.use(methodOverride('_method'));

// Rate limiters for login and signup
const loginLimiter = new RateLimit({
  windowMs: 1000 * 60 * 5,
  max: 3,
  message: 'Maximum login attempts exceeded. Please try again later'
});

const signupLimiter = new RateLimit({
  windowMs: 1000 * 60 * 60,
  max: 3,
  message: 'Maximum accounts made. Please try again later'
});

// app.use('/auth/login', loginLimiter);
// app.use('/auth/signup', signupLimiter);

const sessionStore = new SequelizeStore({
  db: db.sequelize,
  expiration: 1000 * 60 * 30
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore
}));

// Use this line once to set up store table
sessionStore.sync();

// After session and before passport middleware
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) { // Will add alerts and currentUser to any EJS file
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

app.get('/', function(req, res) {
  res.render('pages/index.ejs');
});

app.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile');
});

app.use('/auth', require('./controllers/auth'));
app.use('/', require('./controllers/api'));
app.use('/locations', isLoggedIn, require('./controllers/locations'));
app.use('/trails', isLoggedIn, require('./controllers/trails'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
