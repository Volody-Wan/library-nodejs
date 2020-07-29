const { MongoClient } = require('mongodb');
const debug = require('debug')('app:authController');
require('dotenv').config();

const {
  USERNAMEEXISTS,
  EMAILUSED,
  PASSWORDSMISMATCH,
} = require('../constants/constants.js');

function authController() {
  function postSignUp(req, res) {
    const {
      usernameSignup,
      emailSignup,
      firstnameSignup,
      lastnameSignup,
      genderSignup,
      passwordSignup,
      confirmPasswordSignup,
    } = req.body;
    const url = process.env.DB_HOST;
    const dbName = process.env.DB_NAME;

    (async function addUser() {
      let client;

      try {
        client = await MongoClient.connect(url, { useUnifiedTopology: true });

        const db = client.db(dbName);
        const col = db.collection('users');
        const user = {
          username: usernameSignup.toLowerCase(),
          email: emailSignup.toLowerCase(),
          profileImage: '',
          firstname: firstnameSignup,
          lastname: lastnameSignup,
          gender: genderSignup,
          twitter: '',
          linkedIn: '',
          password: passwordSignup,
        };

        if (genderSignup === 'male') {
          user.profileImage = 'https://cdn.iconscout.com/icon/free/png-512/avatar-370-456322.png';
        } else if (genderSignup === 'female') {
          user.profileImage = 'https://cdn.iconscout.com/icon/free/png-512/avatar-370-2130102.png';
        } else {
          user.profileImage = 'https://cdn.iconscout.com/icon/free/png-512/avatar-370-453298.png';
        }

        if (passwordSignup !== confirmPasswordSignup) {
          req.flash('error', PASSWORDSMISMATCH);
          res.redirect('/login/#toregister');
        } else {
          const result = await col.findOne({
            $or: [
              { username: user.username },
              { email: user.email },
            ],
          });

          if (!result) {
            const results = await col.insertOne(user);
            req.login(results.ops[0], () => {
              res.redirect('/profile');
            });
          } else {
            if (result.username === user.username) {
              req.flash('error', USERNAMEEXISTS);
            } else if (result.email === user.email) {
              req.flash('error', EMAILUSED);
            }
            res.redirect('/login/#toregister');
          }
        }
      } catch (err) {
        debug(err.stack);
      }
    }());
  }

  function getLogout(req, res) {
    req.logout();
    res.redirect('/');
  }

  return {
    postSignUp,
    getLogout,
  };
}

module.exports = authController;
