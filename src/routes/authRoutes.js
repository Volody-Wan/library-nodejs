const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:authRoutes');
const passport = require('passport');

const authRoutes = express.Router();

function router(nav) {
  authRoutes.route('/signUp')
    .post((request, response) => {
      const { username, password } = request.body;
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';

      (async function addUser() {
        let client;

        try {
          client = await MongoClient.connect(url, { useUnifiedTopology: true });

          const db = client.db(dbName);
          const col = db.collection('users');
          const user = { username, password };

          const results = await col.insertOne(user);
          request.login(results.ops[0], () => {
            response.redirect('/auth/profile');
          });
        } catch (err) {
          debug(err.stack);
        }
      }());
    });

  authRoutes.route('/signIn')
    .get((request, response) => {
      response.render('signIn', {
        nav,
        title: 'Sign In',
      });
    })
    .post(passport.authenticate('local', {
      successRedirect: '/auth/profile',
      failureRedirect: '/',
    }));

  authRoutes.route('/profile')
    .all((request, response, next) => {
      if (request.user) {
        next();
      } else {
        response.redirect('/');
      }
    })
    .get((request, response) => {
      response.json(request.user);
    });
  return authRoutes;
}

module.exports = router;
