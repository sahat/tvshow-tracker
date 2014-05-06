var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var session = require('express-session');
var xml2js = require('xml2js');
var request = require('request');
var async = require('async');

var userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String
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
  network: String,
  overview: String,
  rating: Number,
  ratingCount: Number,
  runtime: Number,
  status: String,
  poster: String,
  episodes: [
    {
      episodeNumber: Number,
      episodeName: String,
      firstAired: Date,
      overview: String
    }
  ]
});

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

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

var User = mongoose.model('User', userSchema);
var Show = mongoose.model('Show', showSchema);

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

app.post('/api/signup', function(req, res) {
  var user = new User({
    email: req.body.email,
    password: req.body.password
  });
  user.save(function(err) {
    res.send(user);
  });
});

app.get('/api/status', function(req, res) {
  res.send(req.isAuthenticated() ? req.user : 'Not Authenticated');
});


app.get('/api/shows', function(req, res) {
  Show.find(function(err, shows) {
    res.send(shows);
  });
});

app.get('/api/shows/:id', function(req, res) {
  Show.findById(req.params.id, function(err, show) {
    console.log(show);
    res.send(show);
  });
});

// Add new show
// @param show
app.post('/api/shows', function(req, res) {
  var apiKey = '9EF1D1E7D28FDA0B';
  var seriesName = (req.body.showName).toLowerCase().replace(/ /g, '_').replace(/[^\w-]+/g, '');
  var parser = xml2js.Parser({
    explicitArray: false,
    normalizeTags: true
  });

  async.waterfall([
    function(callback) {
      request.get('http://thetvdb.com/api/GetSeries.php?seriesname=' + seriesName, function(error, response, body) {
        parser.parseString(body, function(err, result) {
          var seriesId = result.data.series.seriesid;
          callback(err, seriesId);
        });
      });
    },
    function(seriesId, callback) {
      request.get('http://thetvdb.com/api/' + apiKey + '/series/' + seriesId + '/all/en.xml', function(error, response, body) {
        parser.parseString(body, function(err, result) {
          var series = result.data.series;
          var episodes = result.data.episode;
          var show = new Show({
            _id: series.id,
            imdbId: series.imdb_id,
            name: series.seriesname,
            actors: series.actors.split('|').filter(Boolean),
            airsDayOfWeek: series.airs_dayofweek,
            airsTime: series.airs_time,
            firstAired: series.firstaired,
            contentRating: series.contentrating,
            genre: series.genre.split('|').filter(Boolean),
            network: series.network,
            overview: series.overview,
            rating: series.rating,
            ratingCount: series.ratingcount,
            runtime: series.runtime,
            status: series.status,
            poster: series.poster,
            episodes: []
          });
          for (var i = 0; i < episodes.length; i++) {
            var episode = episodes[i];
            show.episodes.push({
              episodeNumber: episode.episodenumber,
              episodeName: episode.episodename,
              firstAired: episode.firstaired,
              overview: episode.overview
            });
          }
          callback(err, show);
        });
      });
    },
    function(show, callback) {
      var url = 'http://thetvdb.com/banners/' + show.poster;
      request({ url: url, encoding: null }, function(error, response, body) {
        show.poster = 'data:' + response.headers['content-type'] + ';base64,' + body.toString('base64');
        callback(error, show);
      });
    }
  ], function(err, show) {
    show.save(function(err) {
      res.send(200);
    });
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
