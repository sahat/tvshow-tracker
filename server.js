var path = require('path');
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');

var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var async = require('async');
var request = require('request');
var xml2js = require('xml2js');

var CronJob = require('cron').CronJob;
var moment = require('moment');
var nodemailer = require('nodemailer');
var _ = require('lodash');

var showSchema = new mongoose.Schema({
  _id: Number,
  imdbId: String,
  name: String,
  airsDayOfWeek: String,
  airsTime: String,
  firstAired: Date,
  genre: [String],
  network: String,
  overview: String,
  rating: Number,
  ratingCount: Number,
  status: String,
  poster: String,
  subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  episodes: [{
    season: Number,
    episodeNumber: Number,
    episodeName: String,
    firstAired: Date,
    overview: String
  }]
});

var userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String
});

userSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, function(err, salt) {
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

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) next();
  else res.send(401);
}

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
  var query = Show.find();

  if (req.query.genre) {
    query.where({ genre: req.query.genre });
  } else if (req.query.alphabet) {
    query.where({ name: new RegExp('^' + '[' + req.query.alphabet + ']', 'i') });
  } else {
    query.limit(12);
  }

  query.sort('-rating').exec(function(err, shows) {
    res.send(shows);
  });

});

app.get('/api/shows/:id', function(req, res) {
  Show.findById(req.params.id, function(err, show) {
    res.send(show);
  });
});

app.post('/api/subscribe', function(req, res) {
  Show.findById(req.body.showId, function(err, show) {
    show.subscribers.push(req.body.userId);
    show.save(function(err) {
      res.send(200);
    });
  });
});

app.post('/api/unsubscribe', function(req, res) {
  Show.findById(req.body.showId, function(err, show) {
    var index = show.subscribers.indexOf(req.body.userId);
    show.subscribers.splice(index, 1);
    show.save(function(err) {
      res.send(200);
    });
  });
});

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
          var seriesId = result.data.series.seriesid || result.data.series[0].seriesid;
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
              season: episode.seasonnumber,
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

// Run every 15th minute, e.g. 4:15, 4:30, 4:45, 5:00
var job = new CronJob('* */15 * * * *', function() {
  Show
    .find()
    .populate('subscribers')
    .exec(function(err, shows) {
      _.each(shows, function(show) {
        var emails = [];
        _.each(show.subscribers, function(user) {
          emails.push(user.email);
        });
        _.each(show.episodes, function(episode) {
          if (moment(episode.firstAired) > moment()) {
            var now = moment();
            var future = moment(episode.firstAired);
            var difference = moment(future).diff(moment(now));
            var twoHours = 7200000;
            if (difference <= twoHours) {
              var smtpTransport = nodemailer.createTransport('SMTP', {
                service: 'SendGrid',
                auth: { user: 'hslogin', pass: 'hspassword00' }
              });
              var mailOptions = {
                from: 'Fred Foo ✔ <foo@blurdybloop.com>',
                to: emails.join(','),
                subject: 'Your show is starting soon!',
                text: show.name + ' starts in less than 2 hours on ' + show.network + '.\n\n' +
                  'Episode ' + episode.episodeNumber + '\n\n' + episode.overview
              };
              smtpTransport.sendMail(mailOptions, function(error, response) {
                console.log("Message sent: " + response.message);
                smtpTransport.close(); // shut down the connection pool, no more messages
              });
            }
            return false;
          }
        });
      });
    });
}, null, true);
