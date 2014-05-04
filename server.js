var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');
var bcrypt = require('bcrypt');
var session = require('express-session');
var parseString = require('xml2js').parseString;
var request = require('request');
var async = require('async');

var userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  gravatar: String
});

var showSchema = new mongoose.Schema({
  _id: Number,
  imdbId: String,
  name: String,
  actors: Array,
  airsDayOfWeek: String,
  airsTime: String,
  firstAired: Date,
  contentRating: String,
  genre: Array,
  language: String,
  network: String,
  overview: String,
  rating: Number,
  ratingCount: Number,
  runtime: Number,
  fanart: String, //base64
  banner: String, //base64
  poster: String, //base64
  episodes: [{
    overview: String,
    episodeName: String,
    episodeNumber: Number,
    firstAired: Date,
    thumbnail: String //base64
  }]
});

var episodeSchema = new mongoose.Schema({
  _id: Number,
  overview: String,
  episodeName: String,
  episodeNumber: Number,
  firstAired: Date,
  thumbnail: String, //base64
  showId: { type: Number, ref: 'Show' }
});

/**
 * User Schema pre-save hooks.
 * It is used for hashing and salting user's password and token.
 */

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for comparing user's password input with a
 * hashed and salted password stored in the database.
 */

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

var User = mongoose.model('User', userSchema);
var Show = mongoose.model('Show', showSchema);

/**
 * Passport setup.
 */

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
  User.findOne({ email: email }, function(err, user) {
    if (err) return done(err);
    if (!user) return done(null, false);
    user.comparePassword(password, function(err, isMatch) {
      if (err) return done(err);
      if (isMatch) return done(null, user);
      return done(null, false);
    });
  });
}));

mongoose.connect('localhost');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  if (req.user) res.cookie('user', JSON.stringify(req.user));
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/login', passport.authenticate('local'), function(req, res) {
  res.send(req.user);
});

app.get('/api/logout', function(req, res) {
  req.logOut();
  res.send(200);
});

app.post('/api/signup', function(req, res, next) {
  var user = new User({
    fullName: req.body.fullName,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });

  var md5 = crypto.createHash('md5').update(user.email).digest('hex');
  user.gravatar = 'https://gravatar.com/avatar/' + md5 + '&d=retro';

  user.save(function(err) {
    if (err) return next(err);
    res.send(200);
  });
});

app.get('/api/status', function(req, res) {
  res.send(req.isAuthenticated() ? req.user : 'Not Authenticated');
});

//app.get('/api/shows', function(req, res) {
//
//});


// Add new show
// @param show
app.get('/api/shows', function(req, res) {

  var apiKey = '9EF1D1E7D28FDA0B';

  async.waterfall([
    function getSeriesId(callback) {
//      var seriesName = (req.body.showName).toLowerCase().replace(/ /g,'_').replace(/[^\w-]+/g,'');
      var seriesName = 'orphan_black';
      request.get('http://thetvdb.com/api/GetSeries.php?seriesname=' + seriesName, function(error, response, body) {
        parseString(body, function(err, result) {
          var seriesId = result.Data.Series[0].seriesid;
          callback(err, seriesId);
        });
      });
    },
    function getSeriesInfo(seriesId, callback) {
      request.get('http://thetvdb.com/api/' + apiKey +  '/series/' + seriesId + '/all/en.xml', function(error, response, body) {
        parseString(body, function(err, result) {
          var seriesInfo = result.Data;
          callback(err, seriesInfo);
        });
      });
    }
  ], function(err, result) {

    var series = result[1].Series[0];
    var episodes = result[1].Episode[0];



  });


});


app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

var ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.send(401);
  }
};
