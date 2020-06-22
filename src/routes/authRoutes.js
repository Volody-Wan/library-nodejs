const express = require('express');
const passport = require('passport');

const authController = require('../controllers/authController');

const authRoutes = express.Router();

function router() {
  const { postSignUp, getLogout } = authController(passport);
  authRoutes.route('/signUp').post(postSignUp);

  authRoutes.route('/signIn')
    .post(passport.authenticate('local', {
      successRedirect: '/profile',
      failureRedirect: '/',
      failureFlash: true,
    }));

  authRoutes.route('/logout').get(getLogout);

  return authRoutes;
}

module.exports = router;
