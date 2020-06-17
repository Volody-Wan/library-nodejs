const passport = require('passport');
require('./strategies/local.strategy.js')();

function passportConfig(app) {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    const returningUser = {
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
      firstname: user.firstname,
      lastname: user.lastname,
      twitter: user.twitter,
      linkedIn: user.linkedIn,
    };
    done(null, returningUser);
  });
}

module.exports = passportConfig;
