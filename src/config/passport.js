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
      // eslint-disable-next-line no-underscore-dangle
      _id: user._id,
      username: user.username,
    };
    done(null, returningUser);
  });
}

module.exports = passportConfig;
