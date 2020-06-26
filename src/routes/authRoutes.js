const express = require('express');
const passport = require('passport');

const authController = require('../controllers/authController');

const authRoutes = express.Router();

let adminFlag = true;

function router(nav) {
  const { postSignUp, getLogout } = authController(passport);
  authRoutes.route('/signUp').post(postSignUp);

  authRoutes.route('/signIn')
    .post(passport.authenticate('local', {
      failureRedirect: '/',
      failureFlash: true,
    }),
      function (req, res) {
        if (req.user.role !== 'admin') {
          if (adminFlag) {
            nav.pop(element => {
              element.title === 'Admin'
            });
            adminFlag = false;
          }
        } else {
          if (!adminFlag) {
            nav.push({ link: '/admin', title: 'Admin' });
            adminFlag = true;
          }
        }
        res.redirect('/profile');
      });

  authRoutes.route('/logout').get(getLogout);

  return authRoutes;
}

module.exports = router;
