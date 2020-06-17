const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:local.strategy');
const { INVALIDUSER, INVALIDPASSWORD } = require('../../constants/constants.js');

function localStrategy() {
  passport.use(new Strategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    }, (req, username, password, done) => {
      const url = 'mongodb://localhost:27017';
      const dbName = 'librarian';

      (async function mongo() {
        let client;

        try {
          client = await MongoClient.connect(url, { useUnifiedTopology: true });

          const db = client.db(dbName);
          const col = db.collection('users');

          const user = await col.findOne({
            $or: [{ username: username.toLowerCase() }, { email: username.toLowerCase() }],
          });

          if (user !== null) {
            if (user.password === password) {
              done(null, user);
            } else {
              done(null, false, { message: INVALIDPASSWORD });
            }
          } else {
            done(null, false, { message: INVALIDUSER });
          }
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    },
  ));
}

module.exports = localStrategy;
