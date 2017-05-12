var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy,
  , User = require('./../models/user');

  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Invalid username ' + username } ); }
        if (!user.verifyPassword(password)) { return done(null, false, { message: 'Invalid password' } ); }
        return done(null, user);
      });
    }
  ));
