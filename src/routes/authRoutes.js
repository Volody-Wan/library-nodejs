const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:authRoutes');
const passport = require('passport');

const {
  USERNAMEEXISTS,
  EMAILUSED,
  PASSWORDSMISMATCH,
} = require('../constants/constants.js');

const authRoutes = express.Router();

function router() {
  authRoutes.route('/signUp')
    .post((request, response) => {
      const {
        usernameSignup,
        emailSignup,
        firstnameSignup,
        lastnameSignup,
        passwordSignup,
        confirmPasswordSignup,
      } = request.body;
      const url = 'mongodb://localhost:27017';
      const dbName = 'librarian';

      (async function addUser() {
        let client;

        try {
          client = await MongoClient.connect(url, { useUnifiedTopology: true });

          const db = client.db(dbName);
          const col = db.collection('users');
          const user = {
            username: usernameSignup.toLowerCase(),
            email: emailSignup.toLowerCase(),
            profileImage: 'https://cdn.iconscout.com/icon/free/png-512/avatar-370-456322.png',
            firstname: firstnameSignup,
            lastname: lastnameSignup,
            twitter: '',
            linkedIn: '',
            password: passwordSignup,
          };

          if (passwordSignup !== confirmPasswordSignup) {
            request.flash('error', PASSWORDSMISMATCH);
            response.redirect('/login/#toregister');
          } else {
            const result = await col.findOne({
              $or: [
                { username: user.username },
                { email: user.email },
              ],
            });

            if (!result) {
              const results = await col.insertOne(user);
              request.login(results.ops[0], () => {
                response.redirect('/profile');
              });
            } else {
              if (result.username === user.username) {
                request.flash('error', USERNAMEEXISTS);
              } else if (result.email === user.email) {
                request.flash('error', EMAILUSED);
              }
              response.redirect('/login/#toregister');
            }
          }
        } catch (err) {
          debug(err.stack);
        }
      }());
    });

  authRoutes.route('/signIn')
    .post(passport.authenticate('local', {
      successRedirect: '/profile',
      failureRedirect: '/',
      failureFlash: true,
    }));

  authRoutes.route('/logout')
    .get((req, res) => {
      req.logout();
      res.redirect('/');
    });
  return authRoutes;
}

module.exports = router;
